$ErrorActionPreference = "Stop"

Write-Host "=== INITIALIZING VS DEV ENVIRONMENT ==="
$vsDevShell = "D:\VS\BuildTools\Common7\Tools\Launch-VsDevShell.ps1"
if (-not (Test-Path $vsDevShell)) {
    throw "Visual Studio Developer Shell script not found at $vsDevShell"
}
& $vsDevShell -Arch amd64 -HostArch amd64

# Add Node and WiX to PATH
$nodeDir = "C:\Users\USER\.nodejs\node-v26.13.0-win-x64"
$wixDir = "C:\Users\USER\AppData\Local\tauri\WixTools"
$env:Path = "$nodeDir;$wixDir;$env:Path"

# Direct Cargo build artifacts to D: drive where 34.5 GB is available
$env:CARGO_TARGET_DIR = "D:\cargo_target"
Write-Host "CARGO_TARGET_DIR set to: $env:CARGO_TARGET_DIR"

Set-Location "frontend\src-tauri"

Write-Host "`n=== STEP 1 & 2: VERIFY TOOLCHAIN & TARGET ==="
rustup show
rustc -vV

Write-Host "`n=== STEP 3: RUN CARGO FMT --CHECK ==="
cargo fmt --check
Write-Host "cargo fmt --check PASSED!"

Write-Host "`n=== STEP 4: RUN RUST UNIT TESTS (MSVC) ==="
cargo test --target x86_64-pc-windows-msvc -- --nocapture
Write-Host "cargo test PASSED!"

Write-Host "`n=== STEP 5: RUN CARGO CHECK (MSVC) ==="
cargo check --target x86_64-pc-windows-msvc
Write-Host "cargo check PASSED!"
