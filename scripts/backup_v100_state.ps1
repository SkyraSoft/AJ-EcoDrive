# scripts/backup_v100_state.ps1
$ErrorActionPreference = "Stop"

$timestamp = (Get-Date -Format "yyyyMMdd_HHmmss")
$targetBackupDir = "backups\pre_upgrade_v100_backup_$timestamp"

Write-Host "Creating backup directory: $targetBackupDir"
New-Item -ItemType Directory -Path "$targetBackupDir\appdata_roaming" -Force | Out-Null
New-Item -ItemType Directory -Path "$targetBackupDir\appdata_local_logs" -Force | Out-Null
New-Item -ItemType Directory -Path "$targetBackupDir\program_files_v100" -Force | Out-Null
New-Item -ItemType Directory -Path "$targetBackupDir\installers" -Force | Out-Null

# 1. Back up SQLite database and roaming user data
$roamingDir = "$env:APPDATA\com.skyrasoft.ecodrive"
if (Test-Path $roamingDir) {
    Copy-Item -Path "$roamingDir\*" -Destination "$targetBackupDir\appdata_roaming" -Recurse -Force
    Write-Host "Backed up Roaming AppData (including ecodrive_offline.db)."
}

# 2. Back up Local logs
$logsDir = "$env:LOCALAPPDATA\com.skyrasoft.ecodrive\logs"
if (Test-Path $logsDir) {
    Copy-Item -Path "$logsDir\*" -Destination "$targetBackupDir\appdata_local_logs" -Recurse -Force
    Write-Host "Backed up Local AppData logs."
}

# 3. Back up Installed v1.0.0 program files
$progDir = "$env:LOCALAPPDATA\Programs\AJ EcoDrive ERP"
if (Test-Path $progDir) {
    Copy-Item -Path "$progDir\*" -Destination "$targetBackupDir\program_files_v100" -Recurse -Force
    Write-Host "Backed up Installed v1.0.0 binaries and shortcuts."
}

# 4. Verify existing installers v1.0.0 and v1.0.1 in installers_backup
Copy-Item -Path "installers_backup\AJ EcoDrive ERP_1.0.0_x64_en-US.msi" -Destination "$targetBackupDir\installers" -Force
Copy-Item -Path "installers_backup\AJ EcoDrive ERP_1.0.1_x64_en-US.msi" -Destination "$targetBackupDir\installers" -Force
Write-Host "Backed up existing installers v1.0.0 and v1.0.1."

# 5. Generate Manifest with SHA256
$manifest = Get-ChildItem -Path $targetBackupDir -Recurse -File | ForEach-Object {
    [PSCustomObject]@{
        RelativePath = $_.FullName.Substring((Resolve-Path $targetBackupDir).Path.Length + 1)
        SizeBytes    = $_.Length
        SHA256       = (Get-FileHash -Path $_.FullName -Algorithm SHA256).Hash
    }
}
$manifest | Export-Clixml -Path "$targetBackupDir\manifest.xml"
$manifest | Format-Table -AutoSize | Out-String | Write-Host
Write-Host "Backup completed successfully at $targetBackupDir"
