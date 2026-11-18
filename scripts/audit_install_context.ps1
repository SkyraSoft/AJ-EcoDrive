# scripts/audit_install_context.ps1
$ErrorActionPreference = "Stop"

Write-Host "================================================================="
Write-Host "AJ ECODRIVE ERP - INSTALLATION CONTEXT AUDIT"
Write-Host "================================================================="

$pCode100 = "{4561B2D4-9D59-4210-9201-1539DB941A36}"
$pCode102 = "{92DB8E6E-1CFE-4D87-9177-6B753B0C232B}"
$upgCode  = "{7373ED16-9CB6-5FDC-A767-AAEF0307B387}"

# 1. Inspect Windows Installer COM
$wi = New-Object -ComObject WindowsInstaller.Installer

Write-Host "`n--- 1. Windows Installer Product Information for v1.0.0 ---"
try {
    $prodState = $wi.GetType().InvokeMember("ProductState", "GetProperty", $null, $wi, @($pCode100))
    Write-Host "ProductState for ${pCode100}: $prodState (INSTALLSTATE_DEFAULT = 5)"
} catch {
    Write-Host "ProductState query error: $_"
}

# Windows Installer COM ProductInfo
$propsToQuery = @(
    "PackageName", "ProductName", "PackageCode", "VersionString", 
    "Publisher", "InstallLocation", "InstallSource", "LocalPackage", 
    "AssignmentType", "InstanceType"
)

foreach ($prop in $propsToQuery) {
    try {
        $val = $wi.GetType().InvokeMember("ProductInfo", "GetProperty", $null, $wi, @($pCode100, $prop))
        Write-Host "  $prop : $val"
    } catch {
        Write-Host "  $prop : [Query Error / Not Set]"
    }
}

# 2. Check Packed Product GUID in Registry
# Convert GUID {4561B2D4-9D59-4210-9201-1539DB941A36} to Packed GUID
function Convert-ToPackedGuid([string]$guidStr) {
    $g = [guid]$guidStr
    $bytes = $g.ToByteArray()
    # Windows Installer GUID packing algorithm:
    # 8 hex chars reversed, 4 hex reversed, 4 hex reversed, pairs reversed
    $hex = $g.ToString("N")
    $p1 = ($hex.Substring(0, 8).ToCharArray() | ForEach-Object { $_ })
    [array]::Reverse($p1)
    $p2 = ($hex.Substring(8, 4).ToCharArray() | ForEach-Object { $_ })
    [array]::Reverse($p2)
    $p3 = ($hex.Substring(12, 4).ToCharArray() | ForEach-Object { $_ })
    [array]::Reverse($p3)
    $p4 = ""
    for ($i = 16; $i -lt 32; $i += 2) {
        $p4 += $hex[$i+1] + $hex[$i]
    }
    return (-join $p1) + (-join $p2) + (-join $p3) + $p4
}

$packed100 = Convert-ToPackedGuid $pCode100
$packedUpg = Convert-ToPackedGuid $upgCode
Write-Host "`n--- 2. Registry Packed GUIDs ---"
Write-Host "  Packed ProductCode (v1.0.0): $packed100"
Write-Host "  Packed UpgradeCode:          $packedUpg"

# Search in HKLM and HKU / HKCU
Write-Host "`n--- 3. Registry Installer UserData Inspection ---"
$userDataPaths = @(
    "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Installer\UserData",
    "HKLM:\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Installer\UserData"
)

foreach ($base in $userDataPaths) {
    if (Test-Path $base) {
        $sids = Get-ChildItem -Path $base -ErrorAction SilentlyContinue
        foreach ($sid in $sids) {
            $sidName = $sid.PSChildName
            $prodPath = Join-Path $sid.PSPath "Products\$packed100"
            if (Test-Path $prodPath) {
                Write-Host "FOUND v1.0.0 in Registry:"
                Write-Host "  Path: $prodPath"
                Write-Host "  Associated SID: $sidName"
                if ($sidName -eq "S-1-5-18") {
                    Write-Host "  -> S-1-5-18 is LocalSystem => INSTALLATION CONTEXT IS PER-MACHINE!"
                } else {
                    Write-Host "  -> User SID => INSTALLATION CONTEXT IS PER-USER!"
                }
                Get-ItemProperty -Path $prodPath\InstallProperties -ErrorAction SilentlyContinue | Format-List DisplayName, DisplayVersion, InstallLocation, WindowsInstaller, AuthorizedCDFPrefix | Out-String | Write-Host
            }
        }
    }
}

# Check UpgradeCode in Registry UpgradeCodes
Write-Host "`n--- 4. Registry UpgradeCode Registration ---"
$upgRegPaths = @(
    "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Installer\UpgradeCodes\$packedUpg",
    "HKCU:\Software\Microsoft\Installer\UpgradeCodes\$packedUpg"
)
foreach ($upgP in $upgRegPaths) {
    if (Test-Path $upgP) {
        Write-Host "Found UpgradeCode at: $upgP"
        Get-ItemProperty -Path $upgP | Out-String | Write-Host
    }
}

# Check Current User SID
$currentUserSid = [System.Security.Principal.WindowsIdentity]::GetCurrent().User.Value
Write-Host "Current User SID: $currentUserSid"

# 5. Inspect v1.0.2 MSI Properties for Context
Write-Host "`n--- 5. v1.0.2 MSI Properties & Scope Inspection ---"
$msi102Path = (Resolve-Path "frontend\src-tauri\target\release\bundle\msi\AJ EcoDrive ERP_1.0.2_x64_en-US.msi").Path
$db102 = $wi.GetType().InvokeMember("OpenDatabase", "InvokeMethod", $null, $wi, @($msi102Path, 0))

$view = $db102.GetType().InvokeMember("OpenView", "InvokeMethod", $null, $db102, @("SELECT Property, Value FROM Property"))
$view.GetType().InvokeMember("Execute", "InvokeMethod", $null, $view, $null)
$p102 = @{}
while ($true) {
    $rec = $view.GetType().InvokeMember("Fetch", "InvokeMethod", $null, $view, $null)
    if ($null -eq $rec) { break }
    $p = $rec.GetType().InvokeMember("StringData", "GetProperty", $null, $rec, @(1))
    $v = $rec.GetType().InvokeMember("StringData", "GetProperty", $null, $rec, @(2))
    $p102[$p] = $v
}

Write-Host "v1.0.2 MSI Property Settings:"
Write-Host "  ALLUSERS:            '$($p102['ALLUSERS'])'"
Write-Host "  MSIINSTALLPERUSER:   '$($p102['MSIINSTALLPERUSER'])'"
Write-Host "  ProductCode:         '$($p102['ProductCode'])'"
Write-Host "  UpgradeCode:         '$($p102['UpgradeCode'])'"
Write-Host "  ProductVersion:      '$($p102['ProductVersion'])'"
Write-Host "  Manufacturer:        '$($p102['Manufacturer'])'"
Write-Host "  ProductName:         '$($p102['ProductName'])'"
Write-Host "  SecureCustomProps:   '$($p102['SecureCustomProperties'])'"

# 6. Check Component Directory & Registration in v1.0.2
Write-Host "`n--- 6. v1.0.2 Component & Shortcut Registration Scopes ---"
$compView = $db102.GetType().InvokeMember("OpenView", "InvokeMethod", $null, $db102, @("SELECT Component, Directory_, Attributes, KeyPath FROM Component"))
$compView.GetType().InvokeMember("Execute", "InvokeMethod", $null, $compView, $null)
while ($true) {
    $rec = $compView.GetType().InvokeMember("Fetch", "InvokeMethod", $null, $compView, $null)
    if ($null -eq $rec) { break }
    $cId = $rec.GetType().InvokeMember("StringData", "GetProperty", $null, $rec, @(1))
    $cDir = $rec.GetType().InvokeMember("StringData", "GetProperty", $null, $rec, @(2))
    $cAttr = $rec.GetType().InvokeMember("IntegerData", "GetProperty", $null, $rec, @(3))
    $cKey = $rec.GetType().InvokeMember("StringData", "GetProperty", $null, $rec, @(4))
    Write-Host "  Component: $cId | Dir: $cDir | Attr: $cAttr | Key: $cKey"
}
