# scripts/check_shortcuts_and_upgrade_sim.ps1
$ErrorActionPreference = "Stop"

# Inspect Shortcut
$lnkPath = "$env:APPDATA\Microsoft\Windows\Start Menu\Programs\AJ EcoDrive ERP\AJ EcoDrive ERP.lnk"
if (Test-Path $lnkPath) {
    $sh = New-Object -ComObject WScript.Shell
    $sc = $sh.CreateShortcut($lnkPath)
    Write-Host "=== START MENU SHORTCUT ==="
    Write-Host "Path:             $lnkPath"
    Write-Host "Target:           $($sc.TargetPath)"
    Write-Host "Arguments:        $($sc.Arguments)"
    Write-Host "WorkingDirectory: $($sc.WorkingDirectory)"
}

# Inspect MSI Shortcut table in v1.0.2
$msiPath = "frontend\src-tauri\target\release\bundle\msi\AJ EcoDrive ERP_1.0.2_x64_en-US.msi"
$fullPath = (Resolve-Path $msiPath).Path
$wi = New-Object -ComObject WindowsInstaller.Installer
$db = $wi.GetType().InvokeMember("OpenDatabase", "InvokeMethod", $null, $wi, @($fullPath, 0))

Write-Host "`n=== MSI SHORTCUT TABLE (v1.0.2) ==="
$scView = $db.GetType().InvokeMember("OpenView", "InvokeMethod", $null, $db, @("SELECT Shortcut, Directory_, Name, Component_, Target FROM Shortcut"))
$scView.GetType().InvokeMember("Execute", "InvokeMethod", $null, $scView, $null)
while ($true) {
    $rec = $scView.GetType().InvokeMember("Fetch", "InvokeMethod", $null, $scView, $null)
    if ($null -eq $rec) { break }
    $sId = $rec.GetType().InvokeMember("StringData", "GetProperty", $null, $rec, @(1))
    $sDir = $rec.GetType().InvokeMember("StringData", "GetProperty", $null, $rec, @(2))
    $sName = $rec.GetType().InvokeMember("StringData", "GetProperty", $null, $rec, @(3))
    $sComp = $rec.GetType().InvokeMember("StringData", "GetProperty", $null, $rec, @(4))
    $sTarg = $rec.GetType().InvokeMember("StringData", "GetProperty", $null, $rec, @(5))
    Write-Host "  Shortcut: $sName (Id: $sId, Directory: $sDir, Target: $sTarg, Component: $sComp)"
}

Write-Host "`n=== MSI COMPONENT TABLE (v1.0.2) ==="
$cView = $db.GetType().InvokeMember("OpenView", "InvokeMethod", $null, $db, @("SELECT Component, ComponentId, Directory_, KeyPath FROM Component"))
$cView.GetType().InvokeMember("Execute", "InvokeMethod", $null, $cView, $null)
while ($true) {
    $rec = $cView.GetType().InvokeMember("Fetch", "InvokeMethod", $null, $cView, $null)
    if ($null -eq $rec) { break }
    $cId = $rec.GetType().InvokeMember("StringData", "GetProperty", $null, $rec, @(1))
    $cGuid = $rec.GetType().InvokeMember("StringData", "GetProperty", $null, $rec, @(2))
    $cDir = $rec.GetType().InvokeMember("StringData", "GetProperty", $null, $rec, @(3))
    $cKey = $rec.GetType().InvokeMember("StringData", "GetProperty", $null, $rec, @(4))
    Write-Host "  Component: $cId (Guid: $cGuid, Dir: $cDir, KeyPath: $cKey)"
}

Write-Host "`n=== MSI DIRECTORY TABLE (v1.0.2) ==="
$dView = $db.GetType().InvokeMember("OpenView", "InvokeMethod", $null, $db, @("SELECT Directory, Directory_Parent, DefaultDir FROM Directory"))
$dView.GetType().InvokeMember("Execute", "InvokeMethod", $null, $dView, $null)
while ($true) {
    $rec = $dView.GetType().InvokeMember("Fetch", "InvokeMethod", $null, $dView, $null)
    if ($null -eq $rec) { break }
    $dId = $rec.GetType().InvokeMember("StringData", "GetProperty", $null, $rec, @(1))
    $dParent = $rec.GetType().InvokeMember("StringData", "GetProperty", $null, $rec, @(2))
    $dDef = $rec.GetType().InvokeMember("StringData", "GetProperty", $null, $rec, @(3))
    Write-Host "  Directory: $dId (Parent: $dParent, DefaultDir: $dDef)"
}
