# scripts/test_related_products.ps1
$ErrorActionPreference = "Stop"

$upgCode = "{7373ED16-9CB6-5FDC-A767-AAEF0307B387}"
$wi = New-Object -ComObject WindowsInstaller.Installer

Write-Host "Calling `$wi.RelatedProducts('$upgCode')..."
$related = $wi.GetType().InvokeMember("RelatedProducts", "GetProperty", $null, $wi, @($upgCode))

$found = @()
foreach ($p in $related) {
    $found += $p
    Write-Host "  Found Related ProductCode: $p"
    try {
        $name = $wi.GetType().InvokeMember("ProductInfo", "GetProperty", $null, $wi, @($p, "ProductName"))
        $ver = $wi.GetType().InvokeMember("ProductInfo", "GetProperty", $null, $wi, @($p, "VersionString"))
        $loc = $wi.GetType().InvokeMember("ProductInfo", "GetProperty", $null, $wi, @($p, "InstallLocation"))
        $assign = $wi.GetType().InvokeMember("ProductInfo", "GetProperty", $null, $wi, @($p, "AssignmentType"))
        Write-Host "    ProductName:     $name"
        Write-Host "    VersionString:   $ver"
        Write-Host "    InstallLocation: $loc"
        Write-Host "    AssignmentType:  $assign"
    } catch {
        Write-Host "    Error getting info: $_"
    }
}

if ($found.Count -eq 0) {
    Write-Host "WARNING: No related products found for UpgradeCode $upgCode!"
} else {
    Write-Host "`nSUCCESS: Windows Installer successfully detects $($found.Count) related product(s) via UpgradeCode."
}
