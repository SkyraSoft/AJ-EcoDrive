$msiPath = "D:\cargo_target\x86_64-pc-windows-msvc\release\bundle\msi\AJ EcoDrive ERP_1.0.3_x64_en-US.msi"
$logPath = "C:\Users\USER\Downloads\EV Showroom Management system\backups\pre_upgrade_v103_backup_20261118_150612\msi_upgrade_runas.log"
try {
    Write-Host "Attempting elevated msiexec via -Verb RunAs..."
    $proc = Start-Process -FilePath "msiexec.exe" -ArgumentList "/i `"$msiPath`" /qn /l*v `"$logPath`"" -Verb RunAs -Wait -PassThru
    Write-Host "msiexec ExitCode: $($proc.ExitCode)"
} catch {
    Write-Host "RunAs Exception: $($_.Exception.Message)"
}
