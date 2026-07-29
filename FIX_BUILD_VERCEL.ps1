$ErrorActionPreference = "Stop"

if (-not (Test-Path ".\package.json")) {
  throw "Jalankan script ini dari folder utama website-kelurahan-cms yang berisi package.json."
}

Write-Host "1/3 Membersihkan folder patch yang ikut terbaca TypeScript..." -ForegroundColor Cyan
@(".\PATCH_UPLOAD_V2", ".\PATCH_FIRESTORE_REST") | ForEach-Object {
  if (Test-Path $_) {
    Remove-Item $_ -Recurse -Force
    Write-Host "Dihapus: $_"
  }
}

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

Write-Host "2/3 Memperbaiki Firebase Admin settings..." -ForegroundColor Cyan
$adminPath = ".\src\lib\firebase\admin.ts"
if (-not (Test-Path $adminPath)) {
  throw "File tidak ditemukan: $adminPath"
}
$adminContent = [System.IO.File]::ReadAllText((Resolve-Path $adminPath))
$adminUpdated = [regex]::Replace(
  $adminContent,
  '(?m)^\s*ignoreUndefinedProperties\s*:\s*true\s*,?\s*\r?\n',
  ''
)
if ($adminUpdated -eq $adminContent) {
  Write-Host "Baris ignoreUndefinedProperties tidak ditemukan atau sudah diperbaiki."
} else {
  [System.IO.File]::WriteAllText((Resolve-Path $adminPath), $adminUpdated, $utf8NoBom)
  Write-Host "Firebase Admin settings diperbaiki."
}

Write-Host "3/3 Memperbaiki tipe data daftar admin..." -ForegroundColor Cyan
$managerPath = ".\src\components\admin\AdminCollectionManager.tsx"
if (-not (Test-Path $managerPath)) {
  throw "File tidak ditemukan: $managerPath"
}
$managerContent = [System.IO.File]::ReadAllText((Resolve-Path $managerPath))
$old = 'setItems(sortByOrder(snap.docs.map(d=>({id:d.id,...d.data()}))));'
$new = 'const rows=snap.docs.map(d=>({id:d.id,...d.data()})) as Array<Record<string,unknown>&{order?:number}>;setItems(sortByOrder(rows));'

if ($managerContent.Contains($old)) {
  $managerContent = $managerContent.Replace($old, $new)
  [System.IO.File]::WriteAllText((Resolve-Path $managerPath), $managerContent, $utf8NoBom)
  Write-Host "AdminCollectionManager diperbaiki."
} elseif ($managerContent.Contains('const rows=snap.docs.map(d=>({id:d.id,...d.data()}))')) {
  Write-Host "AdminCollectionManager sudah diperbaiki sebelumnya."
} else {
  throw "Pola kode di AdminCollectionManager tidak ditemukan. Jangan lanjutkan build. Kirim isi fungsi load() untuk diperiksa."
}

Write-Host "`nPerbaikan selesai." -ForegroundColor Green
Write-Host "Jalankan:" -ForegroundColor Yellow
Write-Host "  npm run typecheck"
Write-Host "  npm run build"
