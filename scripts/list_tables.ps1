# scripts/list_tables.ps1
$msiPath = "installers_backup\AJ EcoDrive ERP_1.0.0_x64_en-US.msi"
$fullPath = (Resolve-Path $msiPath).Path
$wi = New-Object -ComObject WindowsInstaller.Installer
$db = $wi.GetType().InvokeMember("OpenDatabase", "InvokeMethod", $null, $wi, @($fullPath, 0))
$view = $db.GetType().InvokeMember("OpenView", "InvokeMethod", $null, $db, @("SELECT Name FROM _Tables"))
$view.GetType().InvokeMember("Execute", "InvokeMethod", $null, $view, $null)
$tables = @()
while ($true) {
    $rec = $view.GetType().InvokeMember("Fetch", "InvokeMethod", $null, $view, $null)
    if ($null -eq $rec) { break }
    $tables += $rec.GetType().InvokeMember("StringData", "GetProperty", $null, $rec, @(1))
}
Write-Host "Tables in v1.0.0: $($tables -join ', ')"
