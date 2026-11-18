$ErrorActionPreference = "Stop"

Write-Host "=== INITIALIZING VS DEV ENVIRONMENT ==="
$vsDevShell = "D:\VS\BuildTools\Common7\Tools\Launch-VsDevShell.ps1"
& $vsDevShell -Arch amd64 -HostArch amd64

# Add Node and WiX to PATH
$nodeDir = "C:\Users\USER\.nodejs\node-v26.13.0-win-x64"
$wixDir = "C:\Users\USER\AppData\Local\tauri\WixTools"
$env:Path = "$nodeDir;$wixDir;$env:Path"

$env:CARGO_TARGET_DIR = "D:\cargo_target"
Write-Host "CARGO_TARGET_DIR: $env:CARGO_TARGET_DIR"

Set-Location "frontend"

Write-Host "`n=== BUILDING TAURI MSI BUNDLE v1.0.3 ==="
cmd.exe /c "npx --yes @tauri-apps/cli build --target x86_64-pc-windows-msvc --bundles msi"

Write-Host "`nBuild process completed. Checking output files..."
$msiDir = "D:\cargo_target\x86_64-pc-windows-msvc\release\bundle\msi"
if (Test-Path $msiDir) {
    Get-ChildItem -Path $msiDir -Filter "*.msi" | Select-Object Name, Length, LastWriteTime
}
