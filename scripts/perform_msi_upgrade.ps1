$ErrorActionPreference = "Stop"

$msiPath = "D:\cargo_target\x86_64-pc-windows-msvc\release\bundle\msi\AJ EcoDrive ERP_1.0.3_x64_en-US.msi"
$logPath = "C:\Users\USER\Downloads\EV Showroom Management system\backups\pre_upgrade_v103_backup_20261118_150612\msi_upgrade.log"

Write-Host "================================================================="
Write-Host "PERFORMING MSI UPGRADE TO v1.0.3"
Write-Host "MSI: $msiPath"
Write-Host "Log: $logPath"
Write-Host "================================================================="

$proc = Start-Process -FilePath "msiexec.exe" -ArgumentList "/i `"$msiPath`" /qn /norestart /l*v `"$logPath`"" -Wait -PassThru

Write-Host "`nmsiexec exited with ExitCode: $($proc.ExitCode)"

if ($proc.ExitCode -eq 0) {
    Write-Host "SUCCESS: Windows Installer upgrade completed with exit code 0."
} elseif ($proc.ExitCode -eq 3010) {
    Write-Host "SUCCESS: Windows Installer upgrade completed (reboot recommended, code 3010)."
} else {
    Write-Host "ERROR: Upgrade failed with exit code $($proc.ExitCode). Checking log tail..."
    if (Test-Path $logPath) {
        Get-Content $logPath -Tail 30
    }
    throw "MSI Upgrade failed with exit code $($proc.ExitCode)"
}
