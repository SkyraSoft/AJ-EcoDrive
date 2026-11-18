param(
    [string]$MsiPath
)
$absPath = (Resolve-Path $MsiPath).Path
$wi = New-Object -ComObject WindowsInstaller.Installer
$db = $wi.GetType().InvokeMember("OpenDatabase", "InvokeMethod", $null, $wi, @($absPath, 0))
$view = $db.GetType().InvokeMember("OpenView", "InvokeMethod", $null, $db, @("SELECT Property, Value FROM Property"))
$view.GetType().InvokeMember("Execute", "InvokeMethod", $null, $view, $null)

while ($true) {
    $rec = $view.GetType().InvokeMember("Fetch", "InvokeMethod", $null, $view, $null)
    if ($null -eq $rec) { break }
    $prop = $rec.GetType().InvokeMember("StringData", "GetProperty", $null, $rec, @(1))
    $val = $rec.GetType().InvokeMember("StringData", "GetProperty", $null, $rec, @(2))
    if ($prop -match "Product|Upgrade|Manufacturer|Package") {
        Write-Host "$prop = $val"
    }
}
