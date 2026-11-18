# scripts/audit_msi_upgrade.ps1
# Read-Only Installer Upgrade Audit for AJ EcoDrive ERP v1.0.2

$ErrorActionPreference = "Stop"

function Get-MsiProperties($db) {
    $view = $db.GetType().InvokeMember("OpenView", "InvokeMethod", $null, $db, @("SELECT Property, Value FROM Property"))
    $view.GetType().InvokeMember("Execute", "InvokeMethod", $null, $view, $null)
    $props = @{}
    while ($true) {
        $rec = $view.GetType().InvokeMember("Fetch", "InvokeMethod", $null, $view, $null)
        if ($null -eq $rec) { break }
        $p = $rec.GetType().InvokeMember("StringData", "GetProperty", $null, $rec, @(1))
        $v = $rec.GetType().InvokeMember("StringData", "GetProperty", $null, $rec, @(2))
        $props[$p] = $v
    }
    return $props
}

function Get-MsiUpgradeTable($db) {
    try {
        $view = $db.GetType().InvokeMember("OpenView", "InvokeMethod", $null, $db, @("SELECT UpgradeCode, VersionMin, VersionMax, Language, Attributes, Remove, ActionProperty FROM Upgrade"))
        $view.GetType().InvokeMember("Execute", "InvokeMethod", $null, $view, $null)
        $rows = @()
        while ($true) {
            $rec = $view.GetType().InvokeMember("Fetch", "InvokeMethod", $null, $view, $null)
            if ($null -eq $rec) { break }
            $rows += [PSCustomObject]@{
                UpgradeCode    = $rec.GetType().InvokeMember("StringData", "GetProperty", $null, $rec, @(1))
                VersionMin     = $rec.GetType().InvokeMember("StringData", "GetProperty", $null, $rec, @(2))
                VersionMax     = $rec.GetType().InvokeMember("StringData", "GetProperty", $null, $rec, @(3))
                Language       = $rec.GetType().InvokeMember("StringData", "GetProperty", $null, $rec, @(4))
                Attributes     = $rec.GetType().InvokeMember("IntegerData", "GetProperty", $null, $rec, @(5))
                Remove         = $rec.GetType().InvokeMember("StringData", "GetProperty", $null, $rec, @(6))
                ActionProperty = $rec.GetType().InvokeMember("StringData", "GetProperty", $null, $rec, @(7))
            }
        }
        return $rows
    } catch {
        return @()
    }
}

function Get-MsiFiles($db) {
    $view = $db.GetType().InvokeMember("OpenView", "InvokeMethod", $null, $db, @("SELECT File, Component_, FileName, FileSize, Version, Sequence FROM File"))
    $view.GetType().InvokeMember("Execute", "InvokeMethod", $null, $view, $null)
    $files = @()
    while ($true) {
        $rec = $view.GetType().InvokeMember("Fetch", "InvokeMethod", $null, $view, $null)
        if ($null -eq $rec) { break }
        $files += [PSCustomObject]@{
            FileId     = $rec.GetType().InvokeMember("StringData", "GetProperty", $null, $rec, @(1))
            Component  = $rec.GetType().InvokeMember("StringData", "GetProperty", $null, $rec, @(2))
            FileName   = $rec.GetType().InvokeMember("StringData", "GetProperty", $null, $rec, @(3))
            FileSize   = $rec.GetType().InvokeMember("IntegerData", "GetProperty", $null, $rec, @(4))
            Version    = $rec.GetType().InvokeMember("StringData", "GetProperty", $null, $rec, @(5))
            Sequence   = $rec.GetType().InvokeMember("IntegerData", "GetProperty", $null, $rec, @(6))
        }
    }
    return $files
}

function Get-MsiInstallSequence($db) {
    $view = $db.GetType().InvokeMember("OpenView", "InvokeMethod", $null, $db, @("SELECT Action, Condition, Sequence FROM InstallExecuteSequence ORDER BY Sequence"))
    $view.GetType().InvokeMember("Execute", "InvokeMethod", $null, $view, $null)
    $seq = @()
    while ($true) {
        $rec = $view.GetType().InvokeMember("Fetch", "InvokeMethod", $null, $view, $null)
        if ($null -eq $rec) { break }
        $seq += [PSCustomObject]@{
            Action    = $rec.GetType().InvokeMember("StringData", "GetProperty", $null, $rec, @(1))
            Condition = $rec.GetType().InvokeMember("StringData", "GetProperty", $null, $rec, @(2))
            Sequence  = $rec.GetType().InvokeMember("IntegerData", "GetProperty", $null, $rec, @(3))
        }
    }
    return $seq
}

Write-Host "================================================================="
Write-Host "AJ ECODRIVE ERP - READ-ONLY MSI UPGRADE AUDIT"
Write-Host "Date/Time: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
Write-Host "================================================================="

$msiList = @(
    @{ Version = "1.0.0"; Path = "installers_backup\AJ EcoDrive ERP_1.0.0_x64_en-US.msi" },
    @{ Version = "1.0.1"; Path = "installers_backup\AJ EcoDrive ERP_1.0.1_x64_en-US.msi" },
    @{ Version = "1.0.2"; Path = "frontend\src-tauri\target\release\bundle\msi\AJ EcoDrive ERP_1.0.2_x64_en-US.msi" }
)

$wi = New-Object -ComObject WindowsInstaller.Installer
$allInfo = @{}

foreach ($item in $msiList) {
    $fullPath = (Resolve-Path $item.Path).Path
    $fileInfo = Get-Item $fullPath
    $hash = (Get-FileHash -Path $fullPath -Algorithm SHA256).Hash
    $sig = Get-AuthenticodeSignature -FilePath $fullPath

    $db = $wi.GetType().InvokeMember("OpenDatabase", "InvokeMethod", $null, $wi, @($fullPath, 0))
    $props = Get-MsiProperties $db
    $upgrade = Get-MsiUpgradeTable $db
    $files = Get-MsiFiles $db
    $sequence = Get-MsiInstallSequence $db

    $allInfo[$item.Version] = @{
        Path       = $fullPath
        Size       = $fileInfo.Length
        SHA256     = $hash
        Signature  = $sig.Status
        Props      = $props
        Upgrade    = $upgrade
        Files      = $files
        Sequence   = $sequence
    }
}

Write-Host "`n--- 1. COMPARATIVE UPGRADE & PRODUCT METADATA ---"
foreach ($v in @("1.0.0", "1.0.1", "1.0.2")) {
    $info = $allInfo[$v]
    $p = $info.Props
    Write-Host "`nVersion $v : $($info.Path)"
    Write-Host "  Size (Bytes):            $($info.Size)"
    Write-Host "  SHA256:                  $($info.SHA256)"
    Write-Host "  Authenticode Status:     $($info.Signature)"
    Write-Host "  ProductCode:             $($p['ProductCode'])"
    Write-Host "  UpgradeCode:             $($p['UpgradeCode'])"
    Write-Host "  ProductVersion:          $($p['ProductVersion'])"
    Write-Host "  ProductName:             $($p['ProductName'])"
    Write-Host "  Manufacturer:            $($p['Manufacturer'])"
    Write-Host "  SecureCustomProperties:  $($p['SecureCustomProperties'])"
}

Write-Host "`n--- 2. UPGRADE TABLE CONFIGURATION (v1.0.2) ---"
$upg102 = $allInfo["1.0.2"].Upgrade
$upg102 | Format-Table -AutoSize | Out-String | Write-Host

Write-Host "`n--- 3. KEY SEQUENCE ACTIONS IN InstallExecuteSequence (v1.0.2) ---"
$seq102 = $allInfo["1.0.2"].Sequence
$keyActions = @("FindRelatedProducts", "MigrateFeatureStates", "ValidateProductID", "InstallValidate", "RemoveExistingProducts", "InstallInitialize", "InstallFiles", "InstallFinalize")
$seq102 | Where-Object { $keyActions -contains $_.Action } | Format-Table -AutoSize | Out-String | Write-Host

Write-Host "`n--- 4. FILE TABLE COMPARISON (v1.0.0 vs v1.0.1 vs v1.0.2) ---"
foreach ($v in @("1.0.0", "1.0.1", "1.0.2")) {
    Write-Host "`nFiles in v$v MSI:"
    $allInfo[$v].Files | Select-Object FileId, FileName, FileSize, Version | Format-Table -AutoSize | Out-String | Write-Host
}

Write-Host "`n--- 5. CHECK CURRENT ACTIVE INSTALLATION ON THIS SYSTEM ---"
$regPaths = @(
    "HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*",
    "HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*",
    "HKLM:\Software\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*"
)
$installed = Get-ItemProperty $regPaths -ErrorAction SilentlyContinue | Where-Object { 
    $_.DisplayName -match "AJ EcoDrive|EcoDrive" -or $_.PSChildName -eq $allInfo["1.0.0"].Props["ProductCode"] -or $_.PSChildName -eq $allInfo["1.0.1"].Props["ProductCode"] -or $_.PSChildName -eq $allInfo["1.0.2"].Props["ProductCode"]
}
if ($installed) {
    Write-Host "Found Installed Product in Registry:"
    $installed | Select-Object DisplayName, DisplayVersion, Publisher, InstallLocation, InstallDate, UninstallString, PSChildName | Format-List | Out-String | Write-Host
} else {
    Write-Host "Checking Windows Installer database directly for ProductCode..."
    foreach ($v in @("1.0.0", "1.0.1", "1.0.2")) {
        $pcode = $allInfo[$v].Props["ProductCode"]
        try {
            $prodState = $wi.GetType().InvokeMember("ProductState", "GetProperty", $null, $wi, @($pcode))
            Write-Host "  ProductCode $pcode (v$v) ProductState: $prodState"
            if ($prodState -eq 5) { # INSTALLSTATE_DEFAULT
                $instDir = $wi.GetType().InvokeMember("ProductInfo", "GetProperty", $null, $wi, @($pcode, "InstallLocation"))
                $localPkg = $wi.GetType().InvokeMember("ProductInfo", "GetProperty", $null, $wi, @($pcode, "LocalPackage"))
                Write-Host "    InstallLocation: $instDir"
                Write-Host "    LocalPackage:    $localPkg"
            }
        } catch {
            Write-Host "  ProductCode $pcode check error: $_"
        }
    }
}

Write-Host "`n--- 6. APPLICATION DATA & BACKUP LOCATIONS ---"
$appDataLocations = @(
    "$env:LOCALAPPDATA\com.ajecodrive.erp",
    "$env:APPDATA\com.ajecodrive.erp",
    "$env:LOCALAPPDATA\aj_ecodrive_erp",
    "$env:APPDATA\aj_ecodrive_erp",
    "$env:LOCALAPPDATA\AJ EcoDrive ERP",
    "$env:APPDATA\AJ EcoDrive ERP",
    "C:\Program Files\AJ EcoDrive ERP",
    "C:\Program Files (x86)\AJ EcoDrive ERP"
)

foreach ($loc in $appDataLocations) {
    if (Test-Path $loc) {
        $items = Get-ChildItem -Path $loc -Recurse -ErrorAction SilentlyContinue
        $size = ($items | Measure-Object -Property Length -Sum).Sum
        Write-Host "Found: $loc (Items: $($items.Count), Total Size: $size bytes)"
    } else {
        Write-Host "Not present: $loc"
    }
}

Write-Host "`n--- 7. EXISTING INSTALLERS BACKUP INTEGRITY ---"
Get-ChildItem -Path "installers_backup", "backups" -Recurse -Filter "*.msi" -ErrorAction SilentlyContinue | Select-Object FullName, Length, LastWriteTime | Format-Table -AutoSize | Out-String | Write-Host
