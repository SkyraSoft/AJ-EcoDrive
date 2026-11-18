Write-Host "=== CHECK LAUNCH DEV CMD / DEV SHELL ==="
$vsPath = "D:\VS\BuildTools"
$devShellPs = "$vsPath\Common7\Tools\Launch-VsDevShell.ps1"
Write-Host "DevShell PS exists: $(Test-Path $devShellPs)"

$devCmdBat = "$vsPath\Common7\Tools\VsDevCmd.bat"
Write-Host "DevCmd BAT exists: $(Test-Path $devCmdBat)"

Write-Host "`n=== TEST INITIALIZING DEV SHELL IN POWERSHELL ==="
if (Test-Path $devShellPs) {
    & $devShellPs -Arch amd64 -HostArch amd64
    $cl = Get-Command cl.exe -ErrorAction SilentlyContinue
    $link = Get-Command link.exe -ErrorAction SilentlyContinue
    $rc = Get-Command rc.exe -ErrorAction SilentlyContinue
    Write-Host "cl.exe found: $($cl.Source)"
    if ($cl) { & cl.exe 2>&1 | Select-Object -First 2 }
    Write-Host "link.exe found: $($link.Source)"
    Write-Host "rc.exe found: $($rc.Source)"
    Write-Host "Windows SDK Dir: $env:WindowsSdkDir"
    Write-Host "Windows SDK Version: $env:WindowsSDKVersion"
    Write-Host "VCToolsInstallDir: $env:VCToolsInstallDir"
    Write-Host "VCToolsVersion: $env:VCToolsVersion"
}

Write-Host "`n=== CHECK FRONTEND PACKAGE.JSON FOR TAURI ==="
$pkg = Get-Content "frontend/package.json" -Raw | ConvertFrom-Json
Write-Host "devDependencies.tauri: $($pkg.devDependencies.'@tauri-apps/cli')"
Write-Host "dependencies.tauri: $($pkg.dependencies.'@tauri-apps/api')"

Write-Host "`n=== CHECK NPX TAURI ==="
$tauriNode = "frontend/node_modules/@tauri-apps/cli/bin/tauri.js"
Write-Host "Local tauri.js exists: $(Test-Path $tauriNode)"

Write-Host "`n=== SEARCH FOR WIX TOOLSET ==="
$wixFound = @()
Get-ChildItem -Path "C:\", "D:\" -Filter "candle.exe" -Recurse -ErrorAction SilentlyContinue -Depth 4 | ForEach-Object {
    $wixFound += $_.FullName
}
Write-Host "Found WiX candle.exe locations: $($wixFound -join '; ')"
