import { FieldValue, type DocumentReference, type Firestore } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/admin";

function cleanDigits(value: unknown) {
  return String(value ?? "").replace(/\D/g, "");
}

function normalizeRt(value: unknown) {
  const numeric = Number(String(value ?? "").replace(/\D/g, ""));
  return Number.isInteger(numeric) && numeric > 0 && numeric <= 13
    ? String(numeric).padStart(2, "0")
    : "";
}

function isActiveResident(value: unknown) {
  const status = String(value ?? "Aktif").trim().toLowerCase();
  return !["pindah", "meninggal"].includes(status);
}

function isActiveRecord(value: unknown) {
  const status = String(value ?? "").trim().toLowerCase();
  return !["tidak aktif", "nonaktif", "dihapus", "dihapuskan"].includes(status);
}

function genderKey(value: unknown) {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (normalized.includes("laki")) return "male";
  if (normalized.includes("perempuan")) return "female";
  return "other";
}

function ageFromBirthDate(value: unknown) {
  const raw = String(value ?? "").trim();
  if (!raw) return null;
  const birth = new Date(`${raw}T00:00:00`);
  if (Number.isNaN(birth.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const month = now.getMonth() - birth.getMonth();
  if (month < 0 || (month === 0 && now.getDate() < birth.getDate())) age -= 1;
  return age >= 0 ? age : null;
}

function normalizedName(value: unknown) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function mostFrequentRt(values: string[]) {
  const counts = new Map<string, number>();
  for (const value of values) {
    const rt = normalizeRt(value);
    if (rt) counts.set(rt, (counts.get(rt) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]?.[0] ?? "";
}

function increment(map: Map<string, number>, rt: unknown, amount = 1) {
  const normalized = normalizeRt(rt);
  if (!normalized) return;
  map.set(normalized, (map.get(normalized) ?? 0) + amount);
}

async function commitPatches(
  db: Firestore,
  patches: Array<{ ref: DocumentReference; data: Record<string, unknown> }>,
) {
  // Firestore membatasi maksimal 500 operasi per batch. Gunakan 400 agar aman
  // untuk data penduduk/KK yang jumlahnya dapat ratusan hingga ribuan.
  const chunkSize = 400;
  for (let start = 0; start < patches.length; start += chunkSize) {
    const batch = db.batch();
    for (const patch of patches.slice(start, start + chunkSize)) {
      batch.set(patch.ref, patch.data, { merge: true });
    }
    await batch.commit();
  }
}

type RecalculateResult = {
  familyMemberCountsUpdated: number;
  familyRtLinked: number;
  rtStatisticsUpdated: number;
  aidRtLinked: number;
  umkmRtLinked: number;
  inventoryRtLinked: number;
  serviceRequestRtLinked: number;
  villageStatsUpdated: boolean;
};

/**
 * Menjaga seluruh data yang mempunyai hubungan RT tetap konsisten.
 *
 * Hubungan utama:
 * - residents -> statistik penduduk RT + RT keluarga berdasarkan No. KK
 * - families -> jumlah KK per RT
 * - residents/families -> RT bansos
 * - ownerNik UMKM -> RT penduduk pemilik
 * - facilities.rt -> daftar fasilitas otomatis pada Data RT
 * - inventory.location -> RT fasilitas bila nama lokasi sama
 * - populationMutations -> jumlah riwayat mutasi terkait RT
 * - serviceRequests/complaints -> jumlah administrasi/pengaduan terkait RT
 *
 * Data pribadi tetap berada di koleksi asal. Dokumen rts hanya menyimpan angka
 * agregat dan nama fasilitas publik yang aman untuk ditampilkan.
 */
export async function recalculateAdministrativeData(): Promise<RecalculateResult> {
  const db = getAdminDb();
  const [
    residentSnap,
    familySnap,
    rtSnap,
    aidSnap,
    umkmSnap,
    facilitySnap,
    mutationSnap,
    inventorySnap,
    serviceRequestSnap,
    complaintSnap,
    statsDoc,
  ] = await Promise.all([
    db.collection("residents").get(),
    db.collection("families").get(),
    db.collection("rts").get(),
    db.collection("socialAssistance").get(),
    db.collection("umkm").get(),
    db.collection("facilities").get(),
    db.collection("populationMutations").get(),
    db.collection("inventory").get(),
    db.collection("serviceRequests").get(),
    db.collection("complaints").get(),
    db.collection("villageStats").doc("main").get(),
  ]);

  const residents = residentSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const families = familySnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  const previousStats = statsDoc.exists ? statsDoc.data() ?? {} : {};
  const residentFamilyNumbersAvailable = residents.some((resident) => {
    const row = resident as Record<string, unknown>;
    return Boolean(cleanDigits(row.familyCardNumber) && normalizeRt(row.rt) && isActiveResident(row.domicileStatus));
  });
  // Setelah sebuah modul pernah memiliki data dan menjadi sumber Data RT,
  // koleksi kosong tetap dianggap sebagai keadaan valid (artinya nilainya 0).
  // Dengan begitu menghapus record terakhir tidak meninggalkan angka/nama lama.
  const residentsAreAuthoritative = residentSnap.size > 0 || previousStats.residentsLinkedToRt === true;
  const familiesAreAuthoritative = familySnap.size > 0 || residentFamilyNumbersAvailable || previousStats.familiesLinkedToRt === true;
  const facilitiesAreAuthoritative = facilitySnap.size > 0 || previousStats.facilitiesLinkedToRt === true;

  const allResidentsByFamily = new Map<string, typeof residents>();
  const activeResidentsByRt = new Map<string, typeof residents>();
  const residentRtByNik = new Map<string, string>();

  for (const resident of residents) {
    const row = resident as Record<string, unknown>;
    const kk = cleanDigits(row.familyCardNumber);
    if (kk) {
      const bucket = allResidentsByFamily.get(kk) ?? [];
      bucket.push(resident);
      allResidentsByFamily.set(kk, bucket);
    }

    const rt = normalizeRt(row.rt);
    const nik = cleanDigits(row.nik);
    if (nik && rt && isActiveResident(row.domicileStatus)) residentRtByNik.set(nik, rt);

    if (rt && isActiveResident(row.domicileStatus)) {
      const bucket = activeResidentsByRt.get(rt) ?? [];
      bucket.push(resident);
      activeResidentsByRt.set(rt, bucket);
    }
  }

  // Keluarga mengikuti RT mayoritas anggota aktif dengan No. KK yang sama.
  // Ini membuat perubahan RT penduduk tidak meninggalkan jumlah KK pada RT lama.
  let familyMemberCountsUpdated = 0;
  let familyRtLinked = 0;
  const familiesByRt = new Map<string, number>();
  const familyRtByNumber = new Map<string, string>();

  // No. KK pada data Penduduk juga dapat menentukan RT keluarga walaupun
  // koleksi Keluarga belum dibuat. Ini penting agar Bansos yang hanya memiliki
  // No. KK tetap dapat tersambung ke Data RT.
  for (const [familyCardNumber, linkedResidents] of allResidentsByFamily.entries()) {
    const linkedRt = mostFrequentRt(
      linkedResidents
        .filter((resident) => isActiveResident((resident as Record<string, unknown>).domicileStatus))
        .map((resident) => String((resident as Record<string, unknown>).rt ?? "")),
    );
    if (linkedRt) familyRtByNumber.set(familyCardNumber, linkedRt);
  }

  const familyPatches: Array<{ ref: DocumentReference; data: Record<string, unknown> }> = [];

  for (const familyDoc of familySnap.docs) {
    const data = familyDoc.data();
    const kk = cleanDigits(data.familyCardNumber);
    const linkedResidents = kk ? allResidentsByFamily.get(kk) ?? [] : [];
    const activeLinked = linkedResidents.filter((resident) =>
      isActiveResident((resident as Record<string, unknown>).domicileStatus),
    );
    const linkedRt = mostFrequentRt(
      activeLinked.map((resident) => String((resident as Record<string, unknown>).rt ?? "")),
    );
    const effectiveRt = linkedRt || normalizeRt(data.rt);
    const patch: Record<string, unknown> = {};

    if (residentsAreAuthoritative && kk) {
      const activeCount = activeLinked.length;
      if (Number(data.memberCount) !== activeCount) {
        patch.memberCount = activeCount;
        familyMemberCountsUpdated += 1;
      }
      if (linkedRt && normalizeRt(data.rt) !== linkedRt) {
        patch.rt = linkedRt;
        patch.linkedRtSource = "No. KK Penduduk";
        familyRtLinked += 1;
      }
    }

    if (Object.keys(patch).length) {
      patch.derivedUpdatedAt = FieldValue.serverTimestamp();
      familyPatches.push({ ref: familyDoc.ref, data: patch });
    }

    if (effectiveRt) increment(familiesByRt, effectiveRt);
    if (kk && effectiveRt) familyRtByNumber.set(kk, effectiveRt);
  }
  if (familyPatches.length) await commitPatches(db, familyPatches);

  // Bila koleksi Keluarga belum dibuat, No. KK unik pada Penduduk tetap dapat
  // menjadi sumber jumlah KK per RT. Saat Keluarga mulai diisi, koleksi Keluarga
  // mengambil alih sebagai sumber utama agar tidak terjadi hitung ganda.
  if (familySnap.size === 0 && residentFamilyNumbersAvailable) {
    const uniqueFamiliesByRt = new Map<string, Set<string>>();
    for (const resident of residents) {
      const row = resident as Record<string, unknown>;
      if (!isActiveResident(row.domicileStatus)) continue;
      const rt = normalizeRt(row.rt);
      const kk = cleanDigits(row.familyCardNumber);
      if (!rt || !kk) continue;
      const bucket = uniqueFamiliesByRt.get(rt) ?? new Set<string>();
      bucket.add(kk);
      uniqueFamiliesByRt.set(rt, bucket);
    }
    for (const [rt, cards] of uniqueFamiliesByRt.entries()) familiesByRt.set(rt, cards.size);
  }

  // Bansos mengikuti NIK/No. KK saat identitas tersebut ditemukan.
  let aidRtLinked = 0;
  const aidCountByRt = new Map<string, number>();
  const aidPatches: Array<{ ref: DocumentReference; data: Record<string, unknown> }> = [];
  for (const aidDoc of aidSnap.docs) {
    const data = aidDoc.data();
    const nik = cleanDigits(data.nik);
    const kk = cleanDigits(data.familyCardNumber);
    const linkedRt = (nik && residentRtByNik.get(nik)) || (kk && familyRtByNumber.get(kk)) || "";
    const effectiveRt = linkedRt || normalizeRt(data.rt);

    if (linkedRt && normalizeRt(data.rt) !== linkedRt) {
      aidPatches.push({
        ref: aidDoc.ref,
        data: {
          rt: linkedRt,
          linkedRtSource: nik && residentRtByNik.get(nik) ? "NIK Penduduk" : "No. KK",
          derivedUpdatedAt: FieldValue.serverTimestamp(),
        },
      });
      aidRtLinked += 1;
    }

    if (effectiveRt && isActiveRecord(data.receiptStatus)) increment(aidCountByRt, effectiveRt);
  }
  if (aidPatches.length) await commitPatches(db, aidPatches);

  // UMKM dapat mengikuti RT pemilik bila NIK pemilik cocok dengan Penduduk.
  let umkmRtLinked = 0;
  const umkmCountByRt = new Map<string, number>();
  const umkmPatches: Array<{ ref: DocumentReference; data: Record<string, unknown> }> = [];
  for (const umkmDoc of umkmSnap.docs) {
    const data = umkmDoc.data();
    const ownerNik = cleanDigits(data.ownerNik);
    const linkedRt = ownerNik ? residentRtByNik.get(ownerNik) ?? "" : "";
    const effectiveRt = linkedRt || normalizeRt(data.rt);

    if (linkedRt && normalizeRt(data.rt) !== linkedRt) {
      umkmPatches.push({
        ref: umkmDoc.ref,
        data: { rt: linkedRt, linkedRtSource: "NIK Pemilik", derivedUpdatedAt: FieldValue.serverTimestamp() },
      });
      umkmRtLinked += 1;
    }

    if (effectiveRt && data.isActive !== false && data.isPublic !== false) increment(umkmCountByRt, effectiveRt);
  }
  if (umkmPatches.length) await commitPatches(db, umkmPatches);

  // Fasilitas menjadi sumber tunggal daftar fasilitas pada detail Data RT.
  const facilityNamesByRt = new Map<string, string[]>();
  const facilityRtByName = new Map<string, string>();
  const facilityCountByRt = new Map<string, number>();
  for (const facilityDoc of facilitySnap.docs) {
    const data = facilityDoc.data();
    const rt = normalizeRt(data.rt);
    const name = String(data.name ?? "").trim();
    const publicActive = data.isPublic !== false && isActiveRecord(data.status);
    if (!rt) continue;
    if (name) facilityRtByName.set(normalizedName(name), rt);
    if (!publicActive) continue;
    increment(facilityCountByRt, rt);
    if (name) {
      const names = facilityNamesByRt.get(rt) ?? [];
      if (!names.includes(name)) names.push(name);
      facilityNamesByRt.set(rt, names);
    }
  }

  // Inventaris memperoleh RT otomatis bila Lokasi persis sama dengan nama Fasilitas.
  let inventoryRtLinked = 0;
  const inventoryItemCountByRt = new Map<string, number>();
  const inventoryQuantityByRt = new Map<string, number>();
  const inventoryPatches: Array<{ ref: DocumentReference; data: Record<string, unknown> }> = [];
  for (const inventoryDoc of inventorySnap.docs) {
    const data = inventoryDoc.data();
    const locationRt = facilityRtByName.get(normalizedName(data.location)) ?? "";
    const effectiveRt = locationRt || normalizeRt(data.rt);

    if (locationRt && normalizeRt(data.rt) !== locationRt) {
      inventoryPatches.push({
        ref: inventoryDoc.ref,
        data: { rt: locationRt, linkedRtSource: "Lokasi Fasilitas", derivedUpdatedAt: FieldValue.serverTimestamp() },
      });
      inventoryRtLinked += 1;
    }

    if (effectiveRt) {
      increment(inventoryItemCountByRt, effectiveRt);
      increment(inventoryQuantityByRt, effectiveRt, Math.max(0, Number(data.quantity) || 0));
    }
  }
  if (inventoryPatches.length) await commitPatches(db, inventoryPatches);

  // Mutasi disimpan sebagai riwayat; tidak mengubah Penduduk secara otomatis.
  // Namun jumlah catatan yang menyentuh suatu RT tetap dihitung sebagai agregat.
  const mutationCountByRt = new Map<string, number>();
  for (const mutationDoc of mutationSnap.docs) {
    const data = mutationDoc.data();
    const touched = new Set([normalizeRt(data.originRt), normalizeRt(data.destinationRt)].filter(Boolean));
    for (const rt of touched) increment(mutationCountByRt, rt);
  }

  // Permohonan surat dapat mengambil RT dari NIK bila RT masih kosong.
  let serviceRequestRtLinked = 0;
  const serviceRequestCountByRt = new Map<string, number>();
  const servicePatches: Array<{ ref: DocumentReference; data: Record<string, unknown> }> = [];
  for (const requestDoc of serviceRequestSnap.docs) {
    const data = requestDoc.data();
    const currentRt = normalizeRt(data.rt);
    const linkedRt = !currentRt ? residentRtByNik.get(cleanDigits(data.nik)) ?? "" : "";
    const effectiveRt = currentRt || linkedRt;
    if (!currentRt && linkedRt) {
      servicePatches.push({
        ref: requestDoc.ref,
        data: { rt: linkedRt, linkedRtSource: "NIK Penduduk", derivedUpdatedAt: FieldValue.serverTimestamp() },
      });
      serviceRequestRtLinked += 1;
    }
    if (effectiveRt) increment(serviceRequestCountByRt, effectiveRt);
  }
  if (servicePatches.length) await commitPatches(db, servicePatches);

  const complaintCountByRt = new Map<string, number>();
  for (const complaintDoc of complaintSnap.docs) {
    increment(complaintCountByRt, complaintDoc.data().rt);
  }

  // Data RT menjadi ringkasan aman dari seluruh modul yang mempunyai hubungan RT.
  let rtStatisticsUpdated = 0;
  const rtBatch = db.batch();
  const finalRtRows: Array<Record<string, unknown>> = [];

  for (const rtDoc of rtSnap.docs) {
    const data = rtDoc.data();
    const rtNumber = normalizeRt(data.number || rtDoc.id);
    const derived: Record<string, unknown> = {};

    if (rtNumber && residentsAreAuthoritative) {
      const active = activeResidentsByRt.get(rtNumber) ?? [];
      let male = 0;
      let female = 0;
      let toddler = 0;
      let elderly = 0;

      for (const resident of active) {
        const row = resident as Record<string, unknown>;
        const gender = genderKey(row.gender);
        if (gender === "male") male += 1;
        if (gender === "female") female += 1;
        const age = ageFromBirthDate(row.birthDate);
        if (age !== null && age < 5) toddler += 1;
        if (age !== null && age >= 60) elderly += 1;
      }

      Object.assign(derived, {
        populationCount: active.length,
        maleCount: male,
        femaleCount: female,
        toddlerCount: toddler,
        elderlyCount: elderly,
      });
    }

    if (rtNumber && familiesAreAuthoritative) {
      derived.familyCount = familiesByRt.get(rtNumber) ?? 0;
    }

    if (rtNumber) {
      if (facilitiesAreAuthoritative) derived.facilities = facilityNamesByRt.get(rtNumber) ?? [];
      Object.assign(derived, {
        facilityCount: facilityCountByRt.get(rtNumber) ?? 0,
        umkmCount: umkmCountByRt.get(rtNumber) ?? 0,
        socialAssistanceCount: aidCountByRt.get(rtNumber) ?? 0,
        inventoryItemCount: inventoryItemCountByRt.get(rtNumber) ?? 0,
        inventoryQuantity: inventoryQuantityByRt.get(rtNumber) ?? 0,
        mutationCount: mutationCountByRt.get(rtNumber) ?? 0,
        serviceRequestCount: serviceRequestCountByRt.get(rtNumber) ?? 0,
        complaintCount: complaintCountByRt.get(rtNumber) ?? 0,
      });
    }

    const changedPatch: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(derived)) {
      if (Array.isArray(value)) {
        const before = Array.isArray(data[key]) ? data[key].map(String) : [];
        const after = value.map(String);
        if (JSON.stringify(before) !== JSON.stringify(after)) changedPatch[key] = value;
      } else if (Number.isFinite(Number(value))) {
        if (Number(data[key]) !== Number(value)) changedPatch[key] = value;
      } else if (data[key] !== value) {
        changedPatch[key] = value;
      }
    }

    if (Object.keys(changedPatch).length) {
      changedPatch.derivedUpdatedAt = FieldValue.serverTimestamp();
      changedPatch.statisticsSource = "otomatis-data-terhubung-rt";
      rtBatch.set(rtDoc.ref, changedPatch, { merge: true });
      rtStatisticsUpdated += 1;
    }

    finalRtRows.push({ ...data, ...derived, number: rtNumber || data.number });
  }
  if (rtStatisticsUpdated) await rtBatch.commit();

  const totals = finalRtRows.reduce<{
    population: number;
    families: number;
    male: number;
    female: number;
    houses: number;
    toddlers: number;
    elderly: number;
    facilities: number;
    umkm: number;
    socialAssistance: number;
    inventoryItems: number;
    mutations: number;
    rtCount: number;
  }>(
    (acc, rt) => {
      if (rt.isActive === false) return acc;
      acc.population += Number(rt.populationCount) || 0;
      acc.families += Number(rt.familyCount) || 0;
      acc.male += Number(rt.maleCount) || 0;
      acc.female += Number(rt.femaleCount) || 0;
      acc.houses += Number(rt.houseCount) || 0;
      acc.toddlers += Number(rt.toddlerCount) || 0;
      acc.elderly += Number(rt.elderlyCount) || 0;
      acc.facilities += Number(rt.facilityCount) || 0;
      acc.umkm += Number(rt.umkmCount) || 0;
      acc.socialAssistance += Number(rt.socialAssistanceCount) || 0;
      acc.inventoryItems += Number(rt.inventoryItemCount) || 0;
      acc.mutations += Number(rt.mutationCount) || 0;
      acc.rtCount += 1;
      return acc;
    },
    {
      population: 0,
      families: 0,
      male: 0,
      female: 0,
      houses: 0,
      toddlers: 0,
      elderly: 0,
      facilities: 0,
      umkm: 0,
      socialAssistance: 0,
      inventoryItems: 0,
      mutations: 0,
      rtCount: 0,
    },
  );

  if (finalRtRows.length) {
    await db.collection("villageStats").doc("main").set(
      {
        ...totals,
        residentsLinkedToRt: residentsAreAuthoritative,
        familiesLinkedToRt: familiesAreAuthoritative,
        facilitiesLinkedToRt: facilitiesAreAuthoritative,
        derivedUpdatedAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
  }

  return {
    familyMemberCountsUpdated,
    familyRtLinked,
    rtStatisticsUpdated,
    aidRtLinked,
    umkmRtLinked,
    inventoryRtLinked,
    serviceRequestRtLinked,
    villageStatsUpdated: Boolean(finalRtRows.length),
  };
}
