$ErrorActionPreference = "Stop"

$msiPath = "D:\cargo_target\x86_64-pc-windows-msvc\release\bundle\msi\AJ EcoDrive ERP_1.0.2_x64_en-US.msi"
if (-not (Test-Path $msiPath)) {
    throw "MSI file not found at $msiPath"
}

$item = Get-Item $msiPath
$hash = Get-FileHash -Path $msiPath -Algorithm SHA256

Write-Host "=== MSI FILE METADATA ==="
Write-Host "Name:           $($item.Name)"
Write-Host "Path:           $($item.FullName)"
Write-Host "Size (Bytes):   $($item.Length)"
Write-Host "Size (MB):      $([math]::Round($item.Length / 1MB, 2)) MB"
Write-Host "LastWriteTime:  $($item.LastWriteTime)"
Write-Host "SHA256:         $($hash.Hash)"

# Inspect MSI COM Properties
Write-Host "`n=== MSI DATABASE PROPERTIES ==="
$wi = New-Object -ComObject WindowsInstaller.Installer
$db = $wi.GetType().InvokeMember("OpenDatabase", "InvokeMethod", $null, $wi, @($item.FullName, 0))
$view = $db.GetType().InvokeMember("OpenView", "InvokeMethod", $null, $db, @("SELECT Property, Value FROM Property"))
$view.GetType().InvokeMember("Execute", "InvokeMethod", $null, $view, $null)

$props = @{}
while ($true) {
    $rec = $view.GetType().InvokeMember("Fetch", "InvokeMethod", $null, $view, $null)
    if ($null -eq $rec) { break }
    $p = $rec.GetType().InvokeMember("StringData", "GetProperty", $null, $rec, @(1))
    $v = $rec.GetType().InvokeMember("StringData", "GetProperty", $null, $rec, @(2))
    $props[$p] = $v
    if ($p -match "Product|Upgrade|Manufacturer|Package") {
        Write-Host "  $p = $v"
    }
}

# Inspect Files inside MSI
Write-Host "`n=== FILES INCLUDED IN MSI ==="
$fileView = $db.GetType().InvokeMember("OpenView", "InvokeMethod", $null, $db, @("SELECT File, FileName, FileSize FROM File"))
$fileView.GetType().InvokeMember("Execute", "InvokeMethod", $null, $fileView, $null)
$files = @()
while ($true) {
    $rec = $fileView.GetType().InvokeMember("Fetch", "InvokeMethod", $null, $fileView, $null)
    if ($null -eq $rec) { break }
    $fId = $rec.GetType().InvokeMember("StringData", "GetProperty", $null, $rec, @(1))
    $fName = $rec.GetType().InvokeMember("StringData", "GetProperty", $null, $rec, @(2))
    $fSize = $rec.GetType().InvokeMember("IntegerData", "GetProperty", $null, $rec, @(3))
    $files += [PSCustomObject]@{
        Id = $fId
        Name = $fName
        Size = $fSize
    }
    Write-Host "  File: $fName (Id: $fId, Size: $fSize bytes)"
}

# Copy to frontend/src-tauri/target/release/bundle/msi/
$targetDir = "frontend\src-tauri\target\release\bundle\msi"
if (-not (Test-Path $targetDir)) {
    New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
}
$targetPath = Join-Path $targetDir $item.Name
Copy-Item -Path $msiPath -Destination $targetPath -Force
Write-Host "`nMirrored MSI to repo target: $targetPath"

# Verify installers_backup
Write-Host "`n=== INSTALLERS BACKUP CHECK ==="
Get-ChildItem -Path "installers_backup" | Select-Object Name, Length, LastWriteTime | Format-Table -AutoSize | Out-String | Write-Host
