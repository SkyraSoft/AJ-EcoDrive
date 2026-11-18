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

Set-Location "frontend\src-tauri"

Write-Host "`n=== BUILDING RELEASE EXE (MSVC) ==="
cargo build --release --target x86_64-pc-windows-msvc

$exePath = "D:\cargo_target\x86_64-pc-windows-msvc\release\aj-ecodrive-erp.exe"
if (Test-Path $exePath) {
    Write-Host "`nSUCCESS: Release executable built at $exePath"
    Get-Item $exePath | Select-Object FullName, Length, LastWriteTime
} else {
    throw "Release executable not found at $exePath"
}
