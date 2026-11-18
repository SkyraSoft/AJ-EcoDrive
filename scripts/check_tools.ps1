Write-Host "=== VS WHERE CHECK ==="
$vswhere = "C:\Program Files (x86)\Microsoft Visual Studio\Installer\vswhere.exe"
if (Test-Path $vswhere) {
    & $vswhere -latest -products * -requires Microsoft.VisualStudio.Component.VC.Tools.x86.x64 -property installationPath
    & $vswhere -latest -products * -format json | Out-File -Encoding utf8 "scripts/vswhere_info.json"
} else {
    Write-Host "vswhere.exe not found at standard path"
}

Write-Host "`n=== COMPILERS & TOOLS IN PATH ==="
$cl = Get-Command cl.exe -ErrorAction SilentlyContinue
$link = Get-Command link.exe -ErrorAction SilentlyContinue
$rc = Get-Command rc.exe -ErrorAction SilentlyContinue
Write-Host "cl.exe: $($cl.Source)"
Write-Host "link.exe: $($link.Source)"
Write-Host "rc.exe: $($rc.Source)"

Write-Host "`n=== RUSTUP STATUS ==="
rustup toolchain list
rustup target list --installed
rustup show

Write-Host "`n=== WIX TOOLSET ==="
$candle = Get-Command candle.exe -ErrorAction SilentlyContinue
$light = Get-Command light.exe -ErrorAction SilentlyContinue
Write-Host "candle.exe: $($candle.Source)"
Write-Host "light.exe: $($light.Source)"

$wixDirs = @(
    "C:\Program Files (x86)\WiX Toolset v3.11\bin",
    "C:\Program Files (x86)\WiX Toolset v3.14\bin",
    "C:\Program Files\WiX Toolset v3.11\bin",
    "C:\Program Files\WiX Toolset v3.14\bin",
    "$env:LOCALAPPDATA\Programs\WiX Toolset v3.11\bin",
    "$env:LOCALAPPDATA\Programs\WiX Toolset v3.14\bin"
)
foreach ($wDir in $wixDirs) {
    if (Test-Path "$wDir\candle.exe") {
        Write-Host "Found WiX at: $wDir"
    }
}

Write-Host "`n=== TAURI CLI ==="
$tauri = Get-Command cargo-tauri.exe -ErrorAction SilentlyContinue
Write-Host "cargo-tauri.exe: $($tauri.Source)"
if (-not $tauri) {
    $tauriInNpm = Get-Command tauri.cmd -ErrorAction SilentlyContinue
    Write-Host "tauri.cmd in npm: $($tauriInNpm.Source)"
}
cargo tauri --version 2>&1
