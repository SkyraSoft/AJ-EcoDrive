# scripts/check_all_reg_keys.ps1
$ErrorActionPreference = "Stop"

$packed = "4d2b165495d9012429105193bd49a163"
$pcode = "{4561B2D4-9D59-4210-9201-1539DB941A36}"
$upg = "61de37376bc9cdf57a76aafe30703b78"

$locations = @(
    "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Installer\UserData\*\Products\$packed",
    "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Installer\Managed\*\Installer\Products\$packed",
    "HKCU:\Software\Microsoft\Installer\Products\$packed",
    "HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\$pcode",
    "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\$pcode",
    "HKLM:\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\$pcode",
    "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Installer\UpgradeCodes\$upg",
    "HKCU:\Software\Microsoft\Installer\UpgradeCodes\$upg"
)

foreach ($loc in $locations) {
    $matches = Resolve-Path $loc -ErrorAction SilentlyContinue
    if ($matches) {
        foreach ($m in $matches) {
            Write-Host "`nFOUND REGISTRY KEY: $($m.Path)"
            Get-ItemProperty $m.Path | Format-List *
        }
    } else {
        Write-Host "NOT FOUND: $loc"
    }
}
