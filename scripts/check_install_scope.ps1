# scripts/check_install_scope.ps1
$ErrorActionPreference = "Stop"

$wi = New-Object -ComObject WindowsInstaller.Installer

foreach ($item in @(
    @{ Version = "1.0.0"; Path = "installers_backup\AJ EcoDrive ERP_1.0.0_x64_en-US.msi" },
    @{ Version = "1.0.1"; Path = "installers_backup\AJ EcoDrive ERP_1.0.1_x64_en-US.msi" },
    @{ Version = "1.0.2"; Path = "frontend\src-tauri\target\release\bundle\msi\AJ EcoDrive ERP_1.0.2_x64_en-US.msi" }
)) {
    $fullPath = (Resolve-Path $item.Path).Path
    $db = $wi.GetType().InvokeMember("OpenDatabase", "InvokeMethod", $null, $wi, @($fullPath, 0))
    $view = $db.GetType().InvokeMember("OpenView", "InvokeMethod", $null, $db, @("SELECT Property, Value FROM Property"))
    $view.GetType().InvokeMember("Execute", "InvokeMethod", $null, $view, $null)
    Write-Host "Version $($item.Version):"
    while ($true) {
        $rec = $view.GetType().InvokeMember("Fetch", "InvokeMethod", $null, $view, $null)
        if ($null -eq $rec) { break }
        $p = $rec.GetType().InvokeMember("StringData", "GetProperty", $null, $rec, @(1))
        $v = $rec.GetType().InvokeMember("StringData", "GetProperty", $null, $rec, @(2))
        if ($p -in @('ALLUSERS', 'MSIINSTALLPERUSER', 'ProductCode', 'UpgradeCode', 'ProductVersion', 'SecureCustomProperties')) {
            Write-Host "  $p = $v"
        }
    }
}
