$backupDir = "installers_backup"
if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir | Out-Null
}
Copy-Item "frontend\src-tauri\target\release\bundle\msi\*.msi" -Destination $backupDir -Force
Get-ChildItem $backupDir | Select-Object Name, Length, LastWriteTime
