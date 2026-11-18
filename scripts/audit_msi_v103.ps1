$msiPath = "D:\cargo_target\x86_64-pc-windows-msvc\release\bundle\msi\AJ EcoDrive ERP_1.0.3_x64_en-US.msi"
$windowsInstaller = New-Object -ComObject WindowsInstaller.Installer
$database = $windowsInstaller.GetType().InvokeMember("OpenDatabase", "InvokeMethod", $null, $windowsInstaller, @($msiPath, 0))
$view = $database.GetType().InvokeMember("OpenView", "InvokeMethod", $null, $database, @("SELECT Property, Value FROM Property"))
$view.GetType().InvokeMember("Execute", "InvokeMethod", $null, $view, $null)

$targetProps = @("ProductName", "ProductVersion", "ProductCode", "UpgradeCode", "ALLUSERS", "Manufacturer")
while ($record = $view.GetType().InvokeMember("Fetch", "InvokeMethod", $null, $view, $null)) {
    $name = $record.GetType().InvokeMember("StringData", "GetProperty", $null, $record, 1)
    $val = $record.GetType().InvokeMember("StringData", "GetProperty", $null, $record, 2)
    if ($targetProps -contains $name) {
        Write-Host "$name = $val"
    }
}
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($view) | Out-Null
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($database) | Out-Null
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($windowsInstaller) | Out-Null
