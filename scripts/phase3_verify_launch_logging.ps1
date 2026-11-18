$logDir = Join-Path $env:LOCALAPPDATA "com.skyrasoft.ecodrive\logs"
Write-Host "Log directory: $logDir"
if (Test-Path $logDir) {
    Write-Host "Existing logs before test:"
    Get-ChildItem -Path $logDir | Select-Object Name, Length, LastWriteTime | Format-Table -AutoSize | Out-String | Write-Host
} else {
    Write-Host "Log directory does not exist yet."
}

$exePath = "D:\cargo_target\x86_64-pc-windows-msvc\release\aj-ecodrive-erp.exe"
if (-not (Test-Path $exePath)) {
    Write-Error "Release executable not found at $exePath"
    exit 1
}

$beforeLogs = @()
if (Test-Path $logDir) {
    $beforeLogs = (Get-ChildItem -Path $logDir).FullName
}

$tempData = Join-Path $env:TEMP "tauri_test_isolated_profile"
if (Test-Path $tempData) {
    Remove-Item -Path $tempData -Recurse -Force -ErrorAction SilentlyContinue
}
New-Item -ItemType Directory -Path $tempData -Force | Out-Null
$env:WEBVIEW2_USER_DATA_FOLDER = $tempData

Write-Host "`nLaunching executable: $exePath"
Write-Host "Using isolated WEBVIEW2_USER_DATA_FOLDER: $tempData"

$proc = Start-Process -FilePath $exePath -PassThru
$targetPid = $proc.Id
Write-Host "Process started with PID: $targetPid"

# Wait a few seconds for initialization
Start-Sleep -Seconds 5

$liveProc = Get-Process -Id $targetPid -ErrorAction SilentlyContinue
if ($null -ne $liveProc) {
    Write-Host "Process Status:"
    Write-Host "  PID: $($liveProc.Id)"
    Write-Host "  Name: $($liveProc.ProcessName)"
    Write-Host "  Responding: $($liveProc.Responding)"
    Write-Host "  WS (Memory MB): $([math]::Round($liveProc.WorkingSet64 / 1MB, 2))"
    
    # Check WebView2 processes spawned
    $wvProcs = Get-Process | Where-Object { $_.ProcessName -like "*msedgewebview2*" }
    Write-Host "  WebView2 processes detected: $($wvProcs.Count)"
} else {
    Write-Host "Process exited early!"
}

# Stop test process
if ($null -ne $liveProc) {
    Stop-Process -Id $targetPid -Force
    Write-Host "Test process terminated cleanly."
}

Start-Sleep -Seconds 1

# Check logs created
Write-Host "`nLogs verification:"
if (Test-Path $logDir) {
    $afterLogs = Get-ChildItem -Path $logDir
    Write-Host "Total logs now: $($afterLogs.Count)"
    $afterLogs | Select-Object Name, Length, LastWriteTime | Format-Table -AutoSize | Out-String | Write-Host
    
    $newLog = $afterLogs | Where-Object { $_.Name -like "*$targetPid*" }
    if ($newLog) {
        Write-Host "MATCH FOUND for PID ${targetPid}: $($newLog.Name)"
        Write-Host "--- Content of $($newLog.Name) ---"
        Get-Content $newLog.FullName | Select-Object -First 30 | Write-Host
        Write-Host "--------------------------------"
    } else {
        Write-Host "WARNING: No log file found matching PID $targetPid"
    }
} else {
    Write-Host "WARNING: Log directory not created!"
}

# Clean isolated profile
Remove-Item -Path $tempData -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "`nVerification complete."
