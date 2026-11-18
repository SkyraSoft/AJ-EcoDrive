param(
    [string]$ExePath
)
$tempData = Join-Path $env:TEMP "tauri_test_isolated_profile"
if (Test-Path $tempData) {
    Remove-Item -Path $tempData -Recurse -Force -ErrorAction SilentlyContinue
}
New-Item -ItemType Directory -Path $tempData -Force | Out-Null
$env:WEBVIEW2_USER_DATA_FOLDER = $tempData

Write-Host "Launching $ExePath with isolated WEBVIEW2_USER_DATA_FOLDER = $tempData"
$p = Start-Process -FilePath $ExePath -PassThru
Start-Sleep -Seconds 4

$proc = Get-Process -Id $p.Id -ErrorAction SilentlyContinue
if ($null -ne $proc) {
    Write-Host "SUCCESS: Isolated process is running! Id=$($proc.Id), Name=$($proc.ProcessName), Responding=$($proc.Responding)"
    Stop-Process -Id $proc.Id -Force
    Write-Host "Process stopped successfully."
} else {
    Write-Host "Process exited early."
}

Remove-Item -Path $tempData -Recurse -Force -ErrorAction SilentlyContinue
