# scripts/read_uninstall_reg.ps1
$regKey = "HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\{4561B2D4-9D59-4210-9201-1539DB941A36}"
if (Test-Path $regKey) {
    Get-ItemProperty $regKey | Format-List *
} else {
    Write-Host "Key not found in HKLM"
}
