# scripts/check_registry_table.ps1
$msiPath = "installers_backup\AJ EcoDrive ERP_1.0.0_x64_en-US.msi"
$fullPath = (Resolve-Path $msiPath).Path
$wi = New-Object -ComObject WindowsInstaller.Installer
$db = $wi.GetType().InvokeMember("OpenDatabase", "InvokeMethod", $null, $wi, @($fullPath, 0))

$view = $db.GetType().InvokeMember("OpenView", "InvokeMethod", $null, $db, @("SELECT * FROM Registry"))
$view.GetType().InvokeMember("Execute", "InvokeMethod", $null, $view, $null)
Write-Host "Registry entries in v1.0.0:"
while ($true) {
    $rec = $view.GetType().InvokeMember("Fetch", "InvokeMethod", $null, $view, $null)
    if ($null -eq $rec) { break }
    $reg = $rec.GetType().InvokeMember("StringData", "GetProperty", $null, $rec, @(1))
    $root = $rec.GetType().InvokeMember("IntegerData", "GetProperty", $null, $rec, @(2))
    $k = $rec.GetType().InvokeMember("StringData", "GetProperty", $null, $rec, @(3))
    $n = $rec.GetType().InvokeMember("StringData", "GetProperty", $null, $rec, @(4))
    $v = $rec.GetType().InvokeMember("StringData", "GetProperty", $null, $rec, @(5))
    $c = $rec.GetType().InvokeMember("StringData", "GetProperty", $null, $rec, @(6))
    Write-Host "  Root: $root | Key: $k | Name: $n | Value: $v | Comp: $c"
}
