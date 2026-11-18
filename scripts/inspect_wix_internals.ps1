# scripts/inspect_wix_internals.ps1
$ErrorActionPreference = "Stop"

$msiPath = "installers_backup\AJ EcoDrive ERP_1.0.0_x64_en-US.msi"
$fullPath = (Resolve-Path $msiPath).Path
$wi = New-Object -ComObject WindowsInstaller.Installer
$db = $wi.GetType().InvokeMember("OpenDatabase", "InvokeMethod", $null, $wi, @($fullPath, 0))

Write-Host "=== CustomAction Table (v1.0.0) ==="
$caView = $db.GetType().InvokeMember("OpenView", "InvokeMethod", $null, $db, @("SELECT Action, Type, Source, Target FROM CustomAction"))
$caView.GetType().InvokeMember("Execute", "InvokeMethod", $null, $caView, $null)
while ($true) {
    $rec = $caView.GetType().InvokeMember("Fetch", "InvokeMethod", $null, $caView, $null)
    if ($null -eq $rec) { break }
    $a = $rec.GetType().InvokeMember("StringData", "GetProperty", $null, $rec, @(1))
    $t = $rec.GetType().InvokeMember("IntegerData", "GetProperty", $null, $rec, @(2))
    $s = $rec.GetType().InvokeMember("StringData", "GetProperty", $null, $rec, @(3))
    $tg = $rec.GetType().InvokeMember("StringData", "GetProperty", $null, $rec, @(4))
    Write-Host "  Action: $a | Type: $t | Source: $s | Target: $tg"
}

Write-Host "`n=== Registry Table (v1.0.0) ==="
$rView = $db.GetType().InvokeMember("OpenView", "InvokeMethod", $null, $db, @("SELECT Registry, Root, `Key`, `Name`, `Value`, Component_ FROM Registry"))
$rView.GetType().InvokeMember("Execute", "InvokeMethod", $null, $rView, $null)
while ($true) {
    $rec = $rView.GetType().InvokeMember("Fetch", "InvokeMethod", $null, $rView, $null)
    if ($null -eq $rec) { break }
    $reg = $rec.GetType().InvokeMember("StringData", "GetProperty", $null, $rec, @(1))
    $root = $rec.GetType().InvokeMember("IntegerData", "GetProperty", $null, $rec, @(2))
    $k = $rec.GetType().InvokeMember("StringData", "GetProperty", $null, $rec, @(3))
    $n = $rec.GetType().InvokeMember("StringData", "GetProperty", $null, $rec, @(4))
    $v = $rec.GetType().InvokeMember("StringData", "GetProperty", $null, $rec, @(5))
    $c = $rec.GetType().InvokeMember("StringData", "GetProperty", $null, $rec, @(6))
    # Root: -1 = msidbRegistryRootDefault (HKCU for per-user, HKLM for per-machine), 0 = HKCR, 1 = HKCU, 2 = HKLM
    Write-Host "  Reg: $reg | Root: $root (-1=Default, 1=HKCU, 2=HKLM) | Key: $k | Name: $n | Value: $v | Comp: $c"
}
