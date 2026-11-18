# scripts/check_summary_info.ps1
$ErrorActionPreference = "Stop"

$wi = New-Object -ComObject WindowsInstaller.Installer

foreach ($item in @(
    @{ Version = "1.0.0"; Path = "installers_backup\AJ EcoDrive ERP_1.0.0_x64_en-US.msi" },
    @{ Version = "1.0.2"; Path = "frontend\src-tauri\target\release\bundle\msi\AJ EcoDrive ERP_1.0.2_x64_en-US.msi" }
)) {
    $fullPath = (Resolve-Path $item.Path).Path
    Write-Host "`n=== Version $($item.Version) Summary Information ==="
    $sumInfo = $wi.GetType().InvokeMember("SummaryInformation", "GetProperty", $null, $wi, @($fullPath, 0))
    # PID_WORDCOUNT (15) - UAC elevation / installation context:
    # 0 or not set: Legacy
    # 2: Elevate to admin (per-machine)
    # 4: Next-generation installer (per-user / per-machine dual)
    try {
        $wordCount = $sumInfo.GetType().InvokeMember("Property", "GetProperty", $null, $sumInfo, @(15))
        Write-Host "  PID_WORDCOUNT (Property 15 - Elevation/InstallScope flags): $wordCount"
    } catch {
        Write-Host "  PID_WORDCOUNT: Error reading"
    }

    try {
        $author = $sumInfo.GetType().InvokeMember("Property", "GetProperty", $null, $sumInfo, @(4))
        Write-Host "  Author: $author"
        $template = $sumInfo.GetType().InvokeMember("Property", "GetProperty", $null, $sumInfo, @(9))
        Write-Host "  Template (Architecture/Language): $template"
        $revNumber = $sumInfo.GetType().InvokeMember("Property", "GetProperty", $null, $sumInfo, @(9)) # PackageCode
        $pkgCode = $sumInfo.GetType().InvokeMember("Property", "GetProperty", $null, $sumInfo, @(9))
        Write-Host "  PackageCode: $pkgCode"
    } catch {}

    # Check ALLUSERS and MSIINSTALLPERUSER properties in db
    $db = $wi.GetType().InvokeMember("OpenDatabase", "InvokeMethod", $null, $wi, @($fullPath, 0))
    $view = $db.GetType().InvokeMember("OpenView", "InvokeMethod", $null, $db, @("SELECT Property, Value FROM Property"))
    $view.GetType().InvokeMember("Execute", "InvokeMethod", $null, $view, $null)
    while ($true) {
        $rec = $view.GetType().InvokeMember("Fetch", "InvokeMethod", $null, $view, $null)
        if ($null -eq $rec) { break }
        $p = $rec.GetType().InvokeMember("StringData", "GetProperty", $null, $rec, @(1))
        $v = $rec.GetType().InvokeMember("StringData", "GetProperty", $null, $rec, @(2))
        if ($p -in @('ALLUSERS', 'MSIINSTALLPERUSER')) {
            Write-Host "  Property $p = '$v'"
        }
    }
}
