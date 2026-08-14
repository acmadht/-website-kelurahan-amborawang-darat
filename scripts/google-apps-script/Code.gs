/**
 * Integrasi Google Spreadsheet -> Website Kelurahan Amborawang Darat.
 * Header tabel harus berada pada baris 4, sesuai master spreadsheet.
 */

const SYNC_SHEETS = [
  "Data RT",
  "Pemerintahan",
  "Kegiatan",
  "Agenda",
  "UMKM",
  "Fasilitas",
  "Surat",
  "Pengaduan",
];

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Website Kelurahan")
    .addItem("Sinkronkan sheet aktif", "syncActiveSheet")
    .addItem("Sinkronkan semua data", "syncAllPublicSheets")
    .addItem("Tarik semua perubahan dari Admin", "pullAllFromWebsite")
    .addSeparator()
    .addItem("Aktifkan sinkron otomatis", "enableAutomaticTwoWaySync")
    .addItem("Matikan sinkron otomatis", "disableAutomaticTwoWaySync")
    .addSeparator()
    .addItem("Tarik permohonan surat dari website", "pullLetterRequests")
    .addItem("Tarik pengaduan dari website", "pullComplaints")
    .addSeparator()
    .addItem("Beri nomor surat baris aktif", "assignLetterNumberToActiveRow")
    .addItem("Buat PDF + QR surat baris aktif", "generateLetterPdfForActiveRow")
    .addItem("Buat PDF semua surat selesai", "generateAllCompletedLetters")
    .addItem("Buat template surat default", "createDefaultLetterTemplate")
    .addSeparator()
    .addItem("Tes koneksi dua arah", "testTwoWayConnection")
    .addItem("Atur koneksi", "showConnectionInfo")
    .addToUi();
}

function showConnectionInfo() {
  const props = PropertiesService.getScriptProperties();
  const endpoint = props.getProperty("SYNC_ENDPOINT") || "BELUM DIATUR";
  const secret = props.getProperty("SYNC_SECRET") ? "SUDAH DIATUR" : "BELUM DIATUR";
  SpreadsheetApp.getUi().alert(
    "Koneksi Website",
    "Endpoint: " + endpoint + "\nSecret: " + secret +
      "\n\nAtur SYNC_ENDPOINT dan SYNC_SECRET melalui Project Settings > Script Properties.",
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

function syncActiveSheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  if (SYNC_SHEETS.indexOf(sheet.getName()) === -1) {
    SpreadsheetApp.getUi().alert("Sheet ini belum termasuk modul yang dapat disinkronkan.");
    return;
  }
  const result = syncSheet_(sheet);
  SpreadsheetApp.getActive().toast(result, "Sinkronisasi", 5);
}

function syncAllPublicSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const messages = [];
  SYNC_SHEETS.forEach(function(name) {
    const sheet = ss.getSheetByName(name);
    if (!sheet) {
      messages.push(name + ": sheet tidak ditemukan");
      return;
    }
    try {
      messages.push(syncSheet_(sheet));
    } catch (error) {
      messages.push(name + ": GAGAL - " + error.message);
    }
  });
  SpreadsheetApp.getUi().alert("Hasil Sinkronisasi", messages.join("\n"), SpreadsheetApp.getUi().ButtonSet.OK);
}

function syncSheet_(sheet) {
  const rows = sheetToObjects_(sheet);
  syncRows_(sheet.getName(), rows);
  return sheet.getName() + ": berhasil, " + rows.length + " baris dikirim";
}

function syncRows_(sheetName, rows) {
  const endpoint = getRequiredProperty_("SYNC_ENDPOINT");
  const secret = getRequiredProperty_("SYNC_SECRET");
  const response = UrlFetchApp.fetch(endpoint, {
    method: "post",
    contentType: "application/json",
    headers: { "x-sync-secret": secret },
    payload: JSON.stringify({ sheet: sheetName, rows: rows }),
    muteHttpExceptions: true,
  });
  const status = response.getResponseCode();
  const body = response.getContentText();
  if (status < 200 || status >= 300) throw new Error("HTTP " + status + " - " + body);
  let json = {};
  try { json = JSON.parse(body); } catch (_) {}
  if (json.ok === false) throw new Error(json.error || "Sinkronisasi ditolak server.");
  return json;
}

function sheetToObjects_(sheet) {
  const lastRow = sheet.getLastRow();
  const lastColumn = sheet.getLastColumn();
  if (lastRow < 5 || lastColumn < 1) return [];

  const headers = sheet.getRange(4, 1, 1, lastColumn).getDisplayValues()[0];
  const values = sheet.getRange(5, 1, lastRow - 4, lastColumn).getDisplayValues();

  return values
    .filter(function(row) {
      return row.some(function(cell) { return String(cell).trim() !== ""; });
    })
    .map(function(row) {
      const obj = {};
      headers.forEach(function(header, index) {
        const key = String(header || "").trim();
        if (key) obj[key] = row[index];
      });
      return obj;
    });
}

function getRequiredProperty_(key) {
  const value = PropertiesService.getScriptProperties().getProperty(key);
  if (!value) throw new Error(key + " belum diatur pada Script Properties.");
  return value;
}


function pullLetterRequests() {
  pullWebsiteRows_("surat", "Surat", "ID Surat");
}

function pullComplaints() {
  pullWebsiteRows_("pengaduan", "Pengaduan", "ID Pengaduan");
}

function pullWebsiteRows_(type, sheetName, idHeader) {
  const endpoint = getRequiredProperty_("SYNC_ENDPOINT").replace(/\/api\/spreadsheet-sync\/?$/, "/api/spreadsheet-inbox");
  const secret = getRequiredProperty_("SYNC_SECRET");
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) throw new Error("Sheet " + sheetName + " tidak ditemukan.");

  const response = UrlFetchApp.fetch(endpoint + "?type=" + encodeURIComponent(type), {
    method: "get",
    headers: { "x-sync-secret": secret },
    muteHttpExceptions: true,
  });
  if (response.getResponseCode() !== 200) throw new Error(response.getContentText());
  const json = JSON.parse(response.getContentText());
  const incoming = json.rows || [];

  const lastColumn = sheet.getLastColumn();
  const headers = sheet.getRange(4, 1, 1, lastColumn).getDisplayValues()[0].map(String);
  const idIndex = headers.indexOf(idHeader);
  if (idIndex < 0) throw new Error("Kolom " + idHeader + " tidak ditemukan.");

  const lastRow = Math.max(sheet.getLastRow(), 4);
  const existing = lastRow > 4
    ? sheet.getRange(5, idIndex + 1, lastRow - 4, 1).getDisplayValues().flat().map(String)
    : [];
  const existingSet = {};
  existing.forEach(function(v) { if (v) existingSet[v.trim()] = true; });

  const newItems = incoming.filter(function(obj) {
    return obj[idHeader] && !existingSet[String(obj[idHeader]).trim()];
  });

  newItems.forEach(function(obj) {
    const targetRow = findFirstEmptyIdRow_(sheet, idIndex + 1);
    headers.forEach(function(header, index) {
      if (!header || header === "No") return;
      if (Object.prototype.hasOwnProperty.call(obj, header)) {
        sheet.getRange(targetRow, index + 1).setValue(obj[header] == null ? "" : obj[header]);
      }
    });
  });
  SpreadsheetApp.getUi().alert(sheetName + ": " + newItems.length + " data baru ditarik dari website.");
}

function findFirstEmptyIdRow_(sheet, idColumn) {
  const maxRow = Math.max(sheet.getMaxRows(), 5);
  const values = sheet.getRange(5, idColumn, maxRow - 4, 1).getDisplayValues();
  for (let i = 0; i < values.length; i++) {
    if (!String(values[i][0] || "").trim()) return i + 5;
  }
  sheet.insertRowsAfter(maxRow, 100);
  return maxRow + 1;
}

/**
 * ===== OTOMATISASI SURAT =====
 * Script Properties tambahan yang dapat dipakai:
 * WEBSITE_BASE_URL        contoh: https://website-kelurahan-amborawang-darat.vercel.app
 * LETTER_TEMPLATE_ID      ID Google Docs template surat
 * LETTER_OUTPUT_FOLDER_ID ID folder Drive tujuan PDF
 * LETTER_NUMBER_PATTERN   contoh: 470/{SEQ}/KEL-AD/{ROMAN_MONTH}/{YEAR}
 *
 * Placeholder template Google Docs:
 * {{ID_SURAT}}, {{NOMOR_SURAT}}, {{TANGGAL}}, {{NAMA}}, {{NIK}}, {{RT}},
 * {{JENIS_SURAT}}, {{KEPERLUAN}}, {{PETUGAS}}, {{URL_VERIFIKASI}}
 * QR code akan ditambahkan pada bagian akhir dokumen.
 */

function getHeaderMap_(sheet) {
  const lastColumn = sheet.getLastColumn();
  const headers = sheet.getRange(4, 1, 1, lastColumn).getDisplayValues()[0];
  const map = {};
  headers.forEach(function(header, index) {
    const key = String(header || "").trim();
    if (key) map[key] = index + 1;
  });
  return map;
}

function requireSuratSheet_() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  if (sheet.getName() !== "Surat") throw new Error("Buka sheet Surat terlebih dahulu.");
  return sheet;
}

function valueAt_(sheet, row, map, header) {
  const col = map[header];
  return col ? String(sheet.getRange(row, col).getDisplayValue() || "").trim() : "";
}

function setValueAt_(sheet, row, map, header, value) {
  const col = map[header];
  if (!col) throw new Error("Kolom " + header + " tidak ditemukan pada sheet Surat.");
  sheet.getRange(row, col).setValue(value);
}

function websiteBaseUrl_() {
  const props = PropertiesService.getScriptProperties();
  const configured = String(props.getProperty("WEBSITE_BASE_URL") || "").trim().replace(/\/$/, "");
  if (configured) return configured;
  const endpoint = getRequiredProperty_("SYNC_ENDPOINT");
  return endpoint.replace(/\/api\/spreadsheet-sync\/?$/, "").replace(/\/$/, "");
}

function romanMonth_(month) {
  return ["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII"][month - 1] || "";
}

function parseSheetDate_(value) {
  if (value instanceof Date && !isNaN(value.getTime())) return value;
  const text = String(value || "").trim();
  const m = text.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);
  if (m) return new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
  const parsed = new Date(text);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
}

function assignLetterNumberToActiveRow() {
  try {
    const sheet = requireSuratSheet_();
    const row = sheet.getActiveCell().getRow();
    if (row < 5) throw new Error("Pilih salah satu baris data surat.");
    const map = getHeaderMap_(sheet);
    const existing = valueAt_(sheet, row, map, "Nomor Surat");
    if (existing) {
      SpreadsheetApp.getUi().alert("Nomor surat sudah terisi: " + existing);
      return;
    }
    const pattern = String(PropertiesService.getScriptProperties().getProperty("LETTER_NUMBER_PATTERN") || "").trim();
    if (!pattern) {
      throw new Error("LETTER_NUMBER_PATTERN belum diatur. Contoh pola: 470/{SEQ}/KEL-AD/{ROMAN_MONTH}/{YEAR}. Sesuaikan dengan tata naskah dinas kelurahan.");
    }
    const rawDate = map["Tanggal Permohonan"] ? sheet.getRange(row, map["Tanggal Permohonan"]).getValue() : new Date();
    const date = parseSheetDate_(rawDate);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const props = PropertiesService.getScriptProperties();
    const seqKey = "LETTER_SEQUENCE_" + year;
    const seq = Number(props.getProperty(seqKey) || "0") + 1;
    const type = valueAt_(sheet, row, map, "Jenis Surat");
    const rt = valueAt_(sheet, row, map, "RT");
    const number = pattern
      .replace(/\{SEQ\}/g, String(seq).padStart(3, "0"))
      .replace(/\{MONTH\}/g, String(month).padStart(2, "0"))
      .replace(/\{ROMAN_MONTH\}/g, romanMonth_(month))
      .replace(/\{YEAR\}/g, String(year))
      .replace(/\{TYPE\}/g, type)
      .replace(/\{RT\}/g, rt);
    setValueAt_(sheet, row, map, "Nomor Surat", number);
    props.setProperty(seqKey, String(seq));
    SpreadsheetApp.getActive().toast("Nomor surat dibuat: " + number, "Surat", 5);
  } catch (error) {
    SpreadsheetApp.getUi().alert("Gagal membuat nomor surat", error.message, SpreadsheetApp.getUi().ButtonSet.OK);
  }
}

function ensureLetterOutputFolder_() {
  const props = PropertiesService.getScriptProperties();
  const id = String(props.getProperty("LETTER_OUTPUT_FOLDER_ID") || "").trim();
  if (id) return DriveApp.getFolderById(id);
  const folder = DriveApp.createFolder("Surat Kelurahan Amborawang Darat - Otomatis");
  props.setProperty("LETTER_OUTPUT_FOLDER_ID", folder.getId());
  return folder;
}

function createDefaultLetterTemplate() {
  const folder = ensureLetterOutputFolder_();
  const doc = DocumentApp.create("TEMPLATE Surat Kelurahan Amborawang Darat");
  const body = doc.getBody();
  body.clear();
  body.appendParagraph("PEMERINTAH KELURAHAN AMBORAWANG DARAT").setHeading(DocumentApp.ParagraphHeading.HEADING2).setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  body.appendParagraph("SAMBOJA BARAT, KUTAI KARTANEGARA").setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  body.appendHorizontalRule();
  body.appendParagraph("{{JENIS_SURAT}}").setHeading(DocumentApp.ParagraphHeading.HEADING2).setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  body.appendParagraph("Nomor: {{NOMOR_SURAT}}").setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  body.appendParagraph("");
  body.appendParagraph("Yang berkepentingan menerangkan bahwa:");
  body.appendParagraph("Nama : {{NAMA}}");
  body.appendParagraph("NIK : {{NIK}}");
  body.appendParagraph("RT : {{RT}}");
  body.appendParagraph("");
  body.appendParagraph("Keperluan: {{KEPERLUAN}}");
  body.appendParagraph("");
  body.appendParagraph("Dokumen ini dibuat berdasarkan data administrasi Kelurahan Amborawang Darat. Redaksi wajib disesuaikan dengan jenis surat dan ketentuan tata naskah dinas yang berlaku sebelum digunakan sebagai dokumen resmi.");
  body.appendParagraph("");
  body.appendParagraph("Tanggal: {{TANGGAL}}");
  body.appendParagraph("Petugas: {{PETUGAS}}");
  body.appendParagraph("");
  body.appendParagraph("Verifikasi dokumen: {{URL_VERIFIKASI}}");
  doc.saveAndClose();
  const file = DriveApp.getFileById(doc.getId());
  file.moveTo(folder);
  PropertiesService.getScriptProperties().setProperty("LETTER_TEMPLATE_ID", doc.getId());
  SpreadsheetApp.getUi().alert("Template default berhasil dibuat. ID template sudah disimpan. Silakan edit kop, redaksi, pejabat penandatangan, dan format sesuai ketentuan resmi kelurahan sebelum dipakai.");
}

function generateLetterPdfForActiveRow() {
  try {
    const sheet = requireSuratSheet_();
    const row = sheet.getActiveCell().getRow();
    if (row < 5) throw new Error("Pilih salah satu baris data surat.");
    const result = generateLetterPdfForRow_(sheet, row);
    try { syncSheet_(sheet); } catch (_) {}
    SpreadsheetApp.getUi().alert("PDF surat berhasil dibuat.\n" + result.pdfUrl);
  } catch (error) {
    SpreadsheetApp.getUi().alert("Gagal membuat PDF", error.message, SpreadsheetApp.getUi().ButtonSet.OK);
  }
}

function generateAllCompletedLetters() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Surat");
  if (!sheet) throw new Error("Sheet Surat tidak ditemukan.");
  const map = getHeaderMap_(sheet);
  const lastRow = sheet.getLastRow();
  let success = 0;
  let skipped = 0;
  const errors = [];
  for (let row = 5; row <= lastRow; row++) {
    const id = valueAt_(sheet, row, map, "ID Surat");
    if (!id) continue;
    const status = valueAt_(sheet, row, map, "Status").toLowerCase();
    const link = valueAt_(sheet, row, map, "Link Dokumen");
    if (status !== "selesai" || link) { skipped++; continue; }
    try { generateLetterPdfForRow_(sheet, row); success++; }
    catch (error) { errors.push(id + ": " + error.message); }
  }
  try { syncSheet_(sheet); } catch (_) {}
  SpreadsheetApp.getUi().alert("Pembuatan PDF selesai", "Berhasil: " + success + "\nDilewati: " + skipped + (errors.length ? "\nGagal:\n" + errors.join("\n") : ""), SpreadsheetApp.getUi().ButtonSet.OK);
}

function generateLetterPdfForRow_(sheet, row) {
  const map = getHeaderMap_(sheet);
  const id = valueAt_(sheet, row, map, "ID Surat").toUpperCase();
  const name = valueAt_(sheet, row, map, "Nama Pemohon");
  const letterType = valueAt_(sheet, row, map, "Jenis Surat");
  const letterNumber = valueAt_(sheet, row, map, "Nomor Surat");
  const status = valueAt_(sheet, row, map, "Status").toLowerCase();
  if (!id || !name || !letterType) throw new Error("ID Surat, Nama Pemohon, dan Jenis Surat wajib terisi.");
  if (!letterNumber) throw new Error("Nomor Surat belum terisi. Gunakan menu 'Beri nomor surat baris aktif' atau isi nomor resmi secara manual.");
  if (status !== "selesai") throw new Error("Status harus Selesai sebelum PDF final dibuat.");

  const props = PropertiesService.getScriptProperties();
  const templateId = String(props.getProperty("LETTER_TEMPLATE_ID") || "").trim();
  if (!templateId) throw new Error("LETTER_TEMPLATE_ID belum diatur. Jalankan menu 'Buat template surat default' atau isi ID template Google Docs resmi.");
  const folder = ensureLetterOutputFolder_();
  const safeId = id.replace(/[^A-Z0-9-]/g, "_");
  const copy = DriveApp.getFileById(templateId).makeCopy("SURAT-" + safeId + "-" + name, folder);
  const doc = DocumentApp.openById(copy.getId());
  const body = doc.getBody();
  const verificationUrl = websiteBaseUrl_() + "/verifikasi-surat/" + encodeURIComponent(id);
  const rawDate = map["Tanggal Selesai"] ? sheet.getRange(row, map["Tanggal Selesai"]).getValue() : new Date();
  const date = parseSheetDate_(rawDate);
  const dateText = Utilities.formatDate(date, Session.getScriptTimeZone() || "Asia/Makassar", "dd/MM/yyyy");
  const replacements = {
    "{{ID_SURAT}}": id,
    "{{NOMOR_SURAT}}": letterNumber,
    "{{TANGGAL}}": dateText,
    "{{NAMA}}": name,
    "{{NIK}}": valueAt_(sheet, row, map, "NIK"),
    "{{RT}}": valueAt_(sheet, row, map, "RT"),
    "{{JENIS_SURAT}}": letterType,
    "{{KEPERLUAN}}": valueAt_(sheet, row, map, "Keperluan"),
    "{{PETUGAS}}": valueAt_(sheet, row, map, "Petugas"),
    "{{URL_VERIFIKASI}}": verificationUrl,
  };
  Object.keys(replacements).forEach(function(key) {
    body.replaceText(key.replace(/[{}]/g, "\\$&"), replacements[key] || "-");
  });

  body.appendParagraph("");
  const qrTitle = body.appendParagraph("QR VERIFIKASI");
  qrTitle.setBold(true).setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  const qrUrl = "https://quickchart.io/qr?size=180&margin=2&text=" + encodeURIComponent(verificationUrl);
  const qrResponse = UrlFetchApp.fetch(qrUrl, { muteHttpExceptions: true });
  if (qrResponse.getResponseCode() >= 200 && qrResponse.getResponseCode() < 300) {
    const qrParagraph = body.appendParagraph("");
    qrParagraph.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
    qrParagraph.appendInlineImage(qrResponse.getBlob()).setWidth(120).setHeight(120);
  }
  body.appendParagraph(id).setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  doc.saveAndClose();

  const pdfBlob = copy.getAs(MimeType.PDF).setName("SURAT-" + safeId + ".pdf");
  const pdfFile = folder.createFile(pdfBlob);
  pdfFile.setDescription("Surat otomatis " + id + " | " + letterType);
  setValueAt_(sheet, row, map, "Link Dokumen", pdfFile.getUrl());
  setValueAt_(sheet, row, map, "URL Verifikasi", verificationUrl);
  if (map["Tampil Cek Publik"] && !valueAt_(sheet, row, map, "Tampil Cek Publik")) {
    setValueAt_(sheet, row, map, "Tampil Cek Publik", "Ya");
  }
  return { pdfUrl: pdfFile.getUrl(), verificationUrl: verificationUrl, docUrl: copy.getUrl() };
}



/**
 * ===== SINKRONISASI DUA ARAH =====
 * Firestore adalah sumber data bersama. Admin dan Spreadsheet menggunakan
 * Firestore ID yang sama agar perubahan tidak membuat duplikat.
 */

const MIRROR_KEY_HEADERS = {
  "Data RT": "RT",
  "Pemerintahan": "Nama",
  "Kegiatan": "ID Konten",
  "Agenda": "ID Agenda",
  "UMKM": "ID UMKM",
  "Fasilitas": "ID Fasilitas",
  "Surat": "ID Surat",
  "Pengaduan": "ID Pengaduan",
};

function mirrorEndpoint_() {
  return getRequiredProperty_("SYNC_ENDPOINT")
    .replace(/\/api\/spreadsheet-sync\/?$/, "/api/spreadsheet-mirror");
}

function ensureFirestoreIdColumn_(sheet) {
  const lastColumn = sheet.getLastColumn();
  const headers = sheet.getRange(4, 1, 1, lastColumn).getDisplayValues()[0].map(String);
  let index = headers.indexOf("Firestore ID");
  if (index >= 0) return index + 1;
  const col = lastColumn + 1;
  sheet.getRange(4, col).setValue("Firestore ID");
  sheet.getRange(4, col).setBackground("#E7E6E6").setFontWeight("bold");
  sheet.getRange(2, col).setValue("OTOMATIS - jangan diubah");
  sheet.hideColumns(col);
  return col;
}

function rowObjectFromSheet_(sheet, row) {
  const lastColumn = sheet.getLastColumn();
  const headers = sheet.getRange(4, 1, 1, lastColumn).getDisplayValues()[0];
  const values = sheet.getRange(row, 1, 1, lastColumn).getDisplayValues()[0];
  const obj = {};
  headers.forEach(function(header, i) {
    const key = String(header || "").trim();
    if (key) obj[key] = values[i];
  });
  return obj;
}

function automaticSpreadsheetEdit(e) {
  try {
    if (!e || !e.range) return;
    const sheet = e.range.getSheet();
    if (e.range.getRow() < 5 || SYNC_SHEETS.indexOf(sheet.getName()) === -1) return;
    ensureFirestoreIdColumn_(sheet);
    const row = e.range.getRow();
    const obj = rowObjectFromSheet_(sheet, row);
    syncRows_(sheet.getName(), [obj]);
    // Immediately read Firestore back so a newly-created row receives its stable Firestore ID.
    pullSheetFromWebsite_(sheet.getName(), false);
  } catch (error) {
    console.error("automaticSpreadsheetEdit", error);
  }
}

function periodicFirestoreToSpreadsheet() {
  try {
    pullAllFromWebsite_(false);
  } catch (error) {
    console.error("periodicFirestoreToSpreadsheet", error);
  }
}

function enableAutomaticTwoWaySync() {
  disableAutomaticTwoWaySync_(false);
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  SYNC_SHEETS.forEach(function(name) {
    const sheet = ss.getSheetByName(name);
    if (sheet) ensureFirestoreIdColumn_(sheet);
  });
  // First pull Admin/Firestore state before enabling edits, preventing duplicate creation.
  pullAllFromWebsite_(false);
  ScriptApp.newTrigger("automaticSpreadsheetEdit").forSpreadsheet(ss).onEdit().create();
  ScriptApp.newTrigger("periodicFirestoreToSpreadsheet").timeBased().everyMinutes(1).create();
  SpreadsheetApp.getUi().alert(
    "Sinkron otomatis aktif.\n\nSpreadsheet → Firestore: setelah sel diedit.\nAdmin/Firestore → Spreadsheet: diperiksa setiap 1 menit.\n\nFirestore ID disimpan pada kolom tersembunyi agar data tidak duplikat."
  );
}

function disableAutomaticTwoWaySync() {
  disableAutomaticTwoWaySync_(true);
}

function disableAutomaticTwoWaySync_(showMessage) {
  const names = { automaticSpreadsheetEdit: true, periodicFirestoreToSpreadsheet: true };
  ScriptApp.getProjectTriggers().forEach(function(trigger) {
    if (names[trigger.getHandlerFunction()]) ScriptApp.deleteTrigger(trigger);
  });
  if (showMessage) SpreadsheetApp.getUi().alert("Sinkron otomatis dimatikan.");
}

function pullAllFromWebsite() {
  pullAllFromWebsite_(true);
}

function pullAllFromWebsite_(showMessage) {
  const messages = [];
  SYNC_SHEETS.forEach(function(name) {
    try { messages.push(pullSheetFromWebsite_(name, false)); }
    catch (error) { messages.push(name + ": GAGAL - " + error.message); }
  });
  if (showMessage) SpreadsheetApp.getUi().alert("Tarik dari Admin/Firestore", messages.join("\n"), SpreadsheetApp.getUi().ButtonSet.OK);
  return messages;
}

function pullSheetFromWebsite_(sheetName, showToast) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) throw new Error("Sheet " + sheetName + " tidak ditemukan.");
  const idCol = ensureFirestoreIdColumn_(sheet);
  const secret = getRequiredProperty_("SYNC_SECRET");
  const url = mirrorEndpoint_() + "?sheet=" + encodeURIComponent(sheetName);
  const response = UrlFetchApp.fetch(url, {
    method: "get",
    headers: { "x-sync-secret": secret },
    muteHttpExceptions: true,
  });
  if (response.getResponseCode() !== 200) throw new Error("HTTP " + response.getResponseCode() + " - " + response.getContentText());
  const json = JSON.parse(response.getContentText());
  if (!json.ok) throw new Error(json.error || "Mirror ditolak server.");
  const incoming = json.rows || [];

  const lastColumn = sheet.getLastColumn();
  const headers = sheet.getRange(4, 1, 1, lastColumn).getDisplayValues()[0].map(function(v) { return String(v || "").trim(); });
  const keyHeader = MIRROR_KEY_HEADERS[sheetName];
  const keyCol = headers.indexOf(keyHeader) + 1;
  const maxDataRow = Math.max(sheet.getLastRow(), 5);
  const currentIds = sheet.getRange(5, idCol, maxDataRow - 4, 1).getDisplayValues().flat();
  const currentKeys = keyCol > 0 ? sheet.getRange(5, keyCol, maxDataRow - 4, 1).getDisplayValues().flat() : [];
  const idToRow = {};
  const keyToRow = {};
  currentIds.forEach(function(v, i) { const k = String(v || "").trim(); if (k) idToRow[k] = i + 5; });
  currentKeys.forEach(function(v, i) { const k = String(v || "").trim().toLowerCase(); if (k) keyToRow[k] = i + 5; });

  let inserted = 0;
  let updated = 0;
  incoming.forEach(function(obj) {
    const fid = String(obj["Firestore ID"] || "").trim();
    const natural = keyHeader ? String(obj[keyHeader] || "").trim().toLowerCase() : "";
    let row = fid && idToRow[fid] ? idToRow[fid] : (natural && keyToRow[natural] ? keyToRow[natural] : 0);
    if (!row) { row = findFirstEmptyMirrorRow_(sheet, idCol, keyCol); inserted++; }
    else updated++;

    headers.forEach(function(header, index) {
      if (!header || header === "No") return;
      if (!Object.prototype.hasOwnProperty.call(obj, header)) return;
      const cell = sheet.getRange(row, index + 1);
      // Preserve calculated cells such as population/KK rekap formulas.
      if (cell.getFormula()) return;
      const incomingValue = obj[header] == null ? "" : obj[header];
      if (String(cell.getDisplayValue()) !== String(incomingValue)) cell.setValue(incomingValue);
    });
    if (fid) sheet.getRange(row, idCol).setValue(fid);
    if (fid) idToRow[fid] = row;
    if (natural) keyToRow[natural] = row;
  });

  const msg = sheetName + ": " + updated + " diperbarui, " + inserted + " ditambahkan";
  if (showToast) SpreadsheetApp.getActive().toast(msg, "Dua arah", 4);
  return msg;
}

function findFirstEmptyMirrorRow_(sheet, idCol, keyCol) {
  const maxRow = Math.max(sheet.getMaxRows(), 5);
  const idVals = sheet.getRange(5, idCol, maxRow - 4, 1).getDisplayValues();
  const keyVals = keyCol > 0 ? sheet.getRange(5, keyCol, maxRow - 4, 1).getDisplayValues() : [];
  for (let i = 0; i < idVals.length; i++) {
    const idEmpty = !String(idVals[i][0] || "").trim();
    const keyEmpty = keyCol <= 0 || !String(keyVals[i][0] || "").trim();
    if (idEmpty && keyEmpty) return i + 5;
  }
  sheet.insertRowsAfter(maxRow, 100);
  return maxRow + 1;
}

function testTwoWayConnection() {
  const endpoint = getRequiredProperty_("SYNC_ENDPOINT");
  const secret = getRequiredProperty_("SYNC_SECRET");
  const response = UrlFetchApp.fetch(mirrorEndpoint_() + "?sheet=" + encodeURIComponent("Data RT"), {
    method: "get", headers: { "x-sync-secret": secret }, muteHttpExceptions: true,
  });
  if (response.getResponseCode() !== 200) throw new Error("Tes gagal: HTTP " + response.getResponseCode() + " - " + response.getContentText());
  const data = JSON.parse(response.getContentText());
  SpreadsheetApp.getUi().alert("Koneksi berhasil. Endpoint aktif dan Firestore dapat dibaca. Data RT ditemukan: " + (data.rows || []).length + ".\n\nEndpoint: " + endpoint);
}
