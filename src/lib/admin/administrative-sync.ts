import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/admin";

function cleanDigits(value: unknown) {
  return String(value ?? "").replace(/\D/g, "");
}

function normalizeRt(value: unknown) {
  const numeric = Number(String(value ?? "").replace(/\D/g, ""));
  return Number.isInteger(numeric) && numeric > 0 && numeric < 100
    ? String(numeric).padStart(2, "0")
    : "";
}

function isActiveResident(value: unknown) {
  const status = String(value ?? "Aktif").trim().toLowerCase();
  return !["pindah", "meninggal"].includes(status);
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

type RecalculateResult = {
  familyMemberCountsUpdated: number;
  rtStatisticsUpdated: number;
  aidRtLinked: number;
  villageStatsUpdated: boolean;
};

/**
 * Menjaga data administratif yang memang saling berkaitan tetap konsisten.
 *
 * Sumber utama:
 * - residents -> jumlah penduduk/gender/balita/lansia per RT + anggota KK
 * - families  -> jumlah KK per RT
 * - residents/families -> mengisi RT bansos bila RT kosong dan NIK/No.KK cocok
 *
 * Agar data lama tidak tiba-tiba menjadi nol saat input masih parsial, statistik
 * suatu RT hanya diturunkan dari koleksi rinci jika RT tersebut sudah memiliki
 * data rinci terkait.
 */
export async function recalculateAdministrativeData(): Promise<RecalculateResult> {
  const db = getAdminDb();
  const [residentSnap, familySnap, rtSnap, aidSnap] = await Promise.all([
    db.collection("residents").get(),
    db.collection("families").get(),
    db.collection("rts").get(),
    db.collection("socialAssistance").get(),
  ]);

  const residents = residentSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const families = familySnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const rts = rtSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const aid = aidSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  // Begitu koleksi rinci sudah dipakai, koleksi tersebut menjadi sumber angka RT.
  // Ini penting agar RT asal ikut menjadi 0 saat warga/KK terakhir dipindahkan.
  const residentsAreAuthoritative = residentSnap.size > 0;
  const familiesAreAuthoritative = familySnap.size > 0;

  const allResidentsByFamily = new Map<string, typeof residents>();
  const activeResidentsByRt = new Map<string, typeof residents>();
  const residentRtByNik = new Map<string, string>();

  for (const resident of residents) {
    const kk = cleanDigits((resident as Record<string, unknown>).familyCardNumber);
    if (kk) {
      const bucket = allResidentsByFamily.get(kk) ?? [];
      bucket.push(resident);
      allResidentsByFamily.set(kk, bucket);
    }

    const rt = normalizeRt((resident as Record<string, unknown>).rt);

    const nik = cleanDigits((resident as Record<string, unknown>).nik);
    if (nik && rt) residentRtByNik.set(nik, rt);

    if (rt && isActiveResident((resident as Record<string, unknown>).domicileStatus)) {
      const bucket = activeResidentsByRt.get(rt) ?? [];
      bucket.push(resident);
      activeResidentsByRt.set(rt, bucket);
    }
  }

  const familiesByRt = new Map<string, number>();
  const familyRtByNumber = new Map<string, string>();
  for (const family of families) {
    const rt = normalizeRt((family as Record<string, unknown>).rt);
    const kk = cleanDigits((family as Record<string, unknown>).familyCardNumber);
    if (rt) familiesByRt.set(rt, (familiesByRt.get(rt) ?? 0) + 1);
    if (kk && rt) familyRtByNumber.set(kk, rt);
  }

  let familyMemberCountsUpdated = 0;
  const familyBatch = db.batch();
  for (const familyDoc of familySnap.docs) {
    const data = familyDoc.data();
    const kk = cleanDigits(data.familyCardNumber);
    if (!residentsAreAuthoritative || !kk) continue;
    const linkedResidents = allResidentsByFamily.get(kk) ?? [];
    const activeCount = linkedResidents.filter((resident) =>
      isActiveResident((resident as Record<string, unknown>).domicileStatus),
    ).length;
    if (Number(data.memberCount) !== activeCount) {
      familyBatch.set(
        familyDoc.ref,
        { memberCount: activeCount, derivedUpdatedAt: FieldValue.serverTimestamp() },
        { merge: true },
      );
      familyMemberCountsUpdated += 1;
    }
  }
  if (familyMemberCountsUpdated) await familyBatch.commit();

  let rtStatisticsUpdated = 0;
  const rtBatch = db.batch();
  const finalRtRows: Array<Record<string, unknown>> = [];

  for (const rtDoc of rtSnap.docs) {
    const data = rtDoc.data();
    const rtNumber = normalizeRt(data.number || rtDoc.id);
    const derived: Record<string, unknown> = {};

    // Penduduk adalah sumber otomatis untuk statistik demografi RT.
    // Semua RT dihitung, termasuk RT yang sekarang tidak punya warga lagi.
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

    // Keluarga/KK adalah sumber otomatis untuk jumlah KK per RT.
    // RT yang KK terakhirnya pindah akan otomatis berubah menjadi 0.
    if (rtNumber && familiesAreAuthoritative) {
      derived.familyCount = familiesByRt.get(rtNumber) ?? 0;
    }

    // Hanya menulis jika nilai memang berubah agar listener Firestore tidak ramai.
    const changedPatch: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(derived)) {
      if (Number(data[key]) !== Number(value)) changedPatch[key] = value;
    }

    if (Object.keys(changedPatch).length) {
      changedPatch.derivedUpdatedAt = FieldValue.serverTimestamp();
      changedPatch.statisticsSource = "otomatis-penduduk-keluarga";
      rtBatch.set(rtDoc.ref, changedPatch, { merge: true });
      rtStatisticsUpdated += 1;
    }

    finalRtRows.push({ ...data, ...derived, number: rtNumber || data.number });
  }
  if (rtStatisticsUpdated) await rtBatch.commit();

  let aidRtLinked = 0;
  const aidBatch = db.batch();
  for (const aidDoc of aidSnap.docs) {
    const data = aidDoc.data();
    const nik = cleanDigits(data.nik);
    const kk = cleanDigits(data.familyCardNumber);
    const linkedRt = (nik && residentRtByNik.get(nik)) || (kk && familyRtByNumber.get(kk)) || "";
    if (!linkedRt || normalizeRt(data.rt) === linkedRt) continue;

    // Jika warga/KK berpindah RT, Bansos yang terhubung ikut pindah otomatis.
    aidBatch.set(
      aidDoc.ref,
      {
        rt: linkedRt,
        linkedRtSource: nik && residentRtByNik.get(nik) ? "NIK Penduduk" : "No. KK",
        derivedUpdatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
    aidRtLinked += 1;
  }
  if (aidRtLinked) await aidBatch.commit();

  const totals = finalRtRows.reduce<{ population: number; families: number; male: number; female: number; rtCount: number }>(
    (acc, rt) => {
      if (rt.isActive === false) return acc;
      acc.population += Number(rt.populationCount) || 0;
      acc.families += Number(rt.familyCount) || 0;
      acc.male += Number(rt.maleCount) || 0;
      acc.female += Number(rt.femaleCount) || 0;
      acc.rtCount += 1;
      return acc;
    },
    { population: 0, families: 0, male: 0, female: 0, rtCount: 0 },
  );

  if (finalRtRows.length) {
    await db.collection("villageStats").doc("main").set(
      { ...totals, derivedUpdatedAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() },
      { merge: true },
    );
  }

  return {
    familyMemberCountsUpdated,
    rtStatisticsUpdated,
    aidRtLinked,
    villageStatsUpdated: Boolean(finalRtRows.length),
  };
}
