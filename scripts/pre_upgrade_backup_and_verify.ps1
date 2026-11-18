$ErrorActionPreference = "Stop"

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupRoot = "backups\pre_upgrade_v103_backup_$timestamp"
New-Item -ItemType Directory -Path $backupRoot -Force | Out-Null
New-Item -ItemType Directory -Path "$backupRoot\Roaming" -Force | Out-Null
New-Item -ItemType Directory -Path "$backupRoot\Local" -Force | Out-Null
New-Item -ItemType Directory -Path "$backupRoot\Registry" -Force | Out-Null

Write-Host "================================================================="
Write-Host "AJ ECODRIVE ERP v1.0.3 - PRE-UPGRADE BACKUP & VERIFICATION"
Write-Host "Backup Directory: $backupRoot"
Write-Host "================================================================="

# --- 1. Fresh Timestamped Backup of Existing Application Data ---
Write-Host "`n--- 1. Backing up User Application Data ---"
$roamingDir = "$env:APPDATA\com.skyrasoft.ecodrive"
if (Test-Path $roamingDir) {
    Copy-Item -Path "$roamingDir\*" -Destination "$backupRoot\Roaming" -Recurse -Force
    Write-Host "Backed up Roaming AppData from: $roamingDir"
}

$localDir = "$env:LOCALAPPDATA\com.skyrasoft.ecodrive"
if (Test-Path $localDir) {
    Copy-Item -Path "$localDir\logs" -Destination "$backupRoot\Local\logs" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "Backed up Local AppData logs from: $localDir\logs"
}

# --- 2. Verify SQLite Database, WAL and SHM files ---
Write-Host "`n--- 2. Verifying SQLite Database & WAL/SHM State ---"
$dbPath = "$roamingDir\ecodrive_offline.db"
$walPath = "$roamingDir\ecodrive_offline.db-wal"
$shmPath = "$roamingDir\ecodrive_offline.db-shm"

if (Test-Path $dbPath) {
    $dbItem = Get-Item $dbPath
    Write-Host "SQLite Main DB: $dbPath"
    Write-Host "  Size: $($dbItem.Length) bytes ($([math]::Round($dbItem.Length / 1KB, 2)) KB)"
    Write-Host "  Last Modified: $($dbItem.LastWriteTime)"
    
    # Read first 16 bytes using shared read mode to verify SQLite header magic
    $stream = [System.IO.FileStream]::new($dbPath, [System.IO.FileMode]::Open, [System.IO.FileAccess]::Read, [System.IO.FileShare]::ReadWrite)
    $headerBytes = New-Object byte[] 16
    $bytesRead = $stream.Read($headerBytes, 0, 16)
    $stream.Close()
    $headerString = [System.Text.Encoding]::ASCII.GetString($headerBytes)
    Write-Host "  Header: $headerString"
    if ($headerString -like "SQLite format 3*") {
        Write-Host "  Verification: VALID SQLite 3 format header verified."
    } else {
        throw "CORRUPTED SQLite database: Header does not match SQLite format 3"
    }
} else {
    Write-Host "WARNING: No existing offline SQLite DB at $dbPath"
}

if (Test-Path $walPath) {
    $walItem = Get-Item $walPath
    Write-Host "WAL File Present: $($walItem.Length) bytes, Modified: $($walItem.LastWriteTime)"
} else {
    Write-Host "WAL File: Not present (database cleanly checkpointed to main file)."
}

if (Test-Path $shmPath) {
    $shmItem = Get-Item $shmPath
    Write-Host "SHM File Present: $($shmItem.Length) bytes"
} else {
    Write-Host "SHM File: Not present."
}

# Backup registry uninstall state
Write-Host "`n--- 3. Backing up Registry State ---"
$uninstKey = "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\{4561B2D4-9D59-4210-9201-1539DB941A36}"
if (Test-Path $uninstKey) {
    reg.exe export "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\{4561B2D4-9D59-4210-9201-1539DB941A36}" "$backupRoot\Registry\uninstall_v100.reg" /y | Out-Null
    Write-Host "Exported uninstall registry to $backupRoot\Registry\uninstall_v100.reg"
}

# --- 4. Verify v1.0.3 MSI SHA-256 and Properties ---
Write-Host "`n--- 4. Verifying v1.0.3 MSI Package Integrity ---"
$msiPath = "D:\cargo_target\x86_64-pc-windows-msvc\release\bundle\msi\AJ EcoDrive ERP_1.0.3_x64_en-US.msi"
if (-not (Test-Path $msiPath)) {
    throw "MSI package not found at $msiPath"
}
$msiItem = Get-Item $msiPath
$sha256 = (Get-FileHash -Path $msiPath -Algorithm SHA256).Hash
Write-Host "MSI File: $msiPath"
Write-Host "  Size: $($msiItem.Length) bytes"
Write-Host "  SHA-256: $sha256"

# Verify MSI properties
$windowsInstaller = New-Object -ComObject WindowsInstaller.Installer
$database = $windowsInstaller.GetType().InvokeMember("OpenDatabase", "InvokeMethod", $null, $windowsInstaller, @($msiPath, 0))
$view = $database.GetType().InvokeMember("OpenView", "InvokeMethod", $null, $database, @("SELECT Property, Value FROM Property"))
$view.GetType().InvokeMember("Execute", "InvokeMethod", $null, $view, $null)

$msiProps = @{}
while ($record = $view.GetType().InvokeMember("Fetch", "InvokeMethod", $null, $view, $null)) {
    $pName = $record.GetType().InvokeMember("StringData", "GetProperty", $null, $record, 1)
    $pVal = $record.GetType().InvokeMember("StringData", "GetProperty", $null, $record, 2)
    $msiProps[$pName] = $pVal
}
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($view) | Out-Null
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($database) | Out-Null
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($windowsInstaller) | Out-Null

Write-Host "  ProductName:    $($msiProps['ProductName'])"
Write-Host "  ProductVersion: $($msiProps['ProductVersion'])"
Write-Host "  ProductCode:    $($msiProps['ProductCode'])"
Write-Host "  UpgradeCode:    $($msiProps['UpgradeCode'])"
Write-Host "  ALLUSERS:       $($msiProps['ALLUSERS'])"

# Confirm UpgradeCode match
$installedUpgradeCode = "{7373ED16-9CB6-5FDC-A767-AAEF0307B387}"
if ($msiProps['UpgradeCode'] -ne $installedUpgradeCode) {
    throw "UpgradeCode MISMATCH! Expected $installedUpgradeCode but got $($msiProps['UpgradeCode'])"
}
Write-Host "  UpgradeCode MATCH: Successfully matched installed version UpgradeCode."

if ($msiProps['ProductVersion'] -ne "1.0.3") {
    throw "ProductVersion MISMATCH! Expected 1.0.3 but got $($msiProps['ProductVersion'])"
}

# --- 5. Gracefully Close Currently Running Application ---
Write-Host "`n--- 5. Closing Currently Running Application Process ---"
$runningProcs = Get-Process "aj-ecodrive-erp" -ErrorAction SilentlyContinue
if ($runningProcs) {
    foreach ($p in $runningProcs) {
        Write-Host "Found running process: ID $($p.Id), Path: $($p.Path)"
        Write-Host "Attempting CloseMainWindow()..."
        $p.CloseMainWindow() | Out-Null
        $closed = $p.WaitForExit(4000)
        if (-not $closed) {
            Write-Host "Application did not close via CloseMainWindow (v1.0.0 close-prevention bug); stopping process safely..."
            Stop-Process -Id $p.Id -Force
            Start-Sleep -Seconds 1
        }
        Write-Host "Process $($p.Id) terminated."
    }
} else {
    Write-Host "No aj-ecodrive-erp processes currently running."
}

# Verify no running instances remain
$remaining = Get-Process "aj-ecodrive-erp" -ErrorAction SilentlyContinue
if ($remaining) {
    throw "Failed to stop all aj-ecodrive-erp instances: $($remaining.Id)"
}
Write-Host "All aj-ecodrive-erp instances stopped cleanly."

# --- 6. Confirm All Previous Installer Backups Preserved ---
Write-Host "`n--- 6. Confirming Previous Installer Backups ---"
$installers = Get-ChildItem "installers_backup" -Filter "*.msi"
foreach ($inst in $installers) {
    Write-Host "  Preserved: $($inst.Name) ($($inst.Length) bytes, $($inst.LastWriteTime))"
}

Write-Host "`nPre-upgrade verification completed successfully. Ready for MSI upgrade."
