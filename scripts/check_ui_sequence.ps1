# scripts/check_ui_sequence.ps1
$msiPath = "frontend\src-tauri\target\release\bundle\msi\AJ EcoDrive ERP_1.0.2_x64_en-US.msi"
$fullPath = (Resolve-Path $msiPath).Path
$wi = New-Object -ComObject WindowsInstaller.Installer
$db = $wi.GetType().InvokeMember("OpenDatabase", "InvokeMethod", $null, $wi, @($fullPath, 0))

$view = $db.GetType().InvokeMember("OpenView", "InvokeMethod", $null, $db, @("SELECT Action, Condition, Sequence FROM InstallUISequence ORDER BY Sequence"))
$view.GetType().InvokeMember("Execute", "InvokeMethod", $null, $view, $null)
Write-Host "=== InstallUISequence (v1.0.2) ==="
while ($true) {
    $rec = $view.GetType().InvokeMember("Fetch", "InvokeMethod", $null, $view, $null)
    if ($null -eq $rec) { break }
    $a = $rec.GetType().InvokeMember("StringData", "GetProperty", $null, $rec, @(1))
    $c = $rec.GetType().InvokeMember("StringData", "GetProperty", $null, $rec, @(2))
    $s = $rec.GetType().InvokeMember("IntegerData", "GetProperty", $null, $rec, @(3))
    Write-Host "  Action: $a, Condition: $c, Sequence: $s"
}
