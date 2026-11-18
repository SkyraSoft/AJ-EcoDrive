$msiPath = "D:\cargo_target\x86_64-pc-windows-msvc\release\bundle\msi\AJ EcoDrive ERP_1.0.3_x64_en-US.msi"
$logPath = "C:\Users\USER\Downloads\EV Showroom Management system\backups\pre_upgrade_v103_backup_20261118_150612\msi_upgrade_passive.log"
$p = Start-Process "msiexec.exe" -ArgumentList "/i `"$msiPath`" /passive /l*v `"$logPath`"" -Wait -PassThru
Write-Host "ExitCode: $($p.ExitCode)"
