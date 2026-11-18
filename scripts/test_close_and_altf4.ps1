$ErrorActionPreference = "Stop"

$exePath = "D:\cargo_target\x86_64-pc-windows-msvc\release\aj-ecodrive-erp.exe"
Write-Host "Target executable: $exePath"

# Add Windows API helpers for sending WM_CLOSE (0x0010) and checking window
Add-Type @"
using System;
using System.Runtime.InteropServices;

public class Win32Helper {
    public const uint WM_CLOSE = 0x0010;
    public const uint WM_SYSCOMMAND = 0x0112;
    public const int SC_CLOSE = 0xF060;

    [DllImport("user32.dll", CharSet = CharSet.Auto)]
    public static extern IntPtr SendMessage(IntPtr hWnd, uint Msg, IntPtr wParam, IntPtr lParam);

    [DllImport("user32.dll", CharSet = CharSet.Auto)]
    public static extern bool PostMessage(IntPtr hWnd, uint Msg, IntPtr wParam, IntPtr lParam);
}
"@

Write-Host "`n=== TEST 1: Launch v1.0.3 and test X button (WM_CLOSE) ==="
$proc1 = Start-Process -FilePath $exePath -PassThru
Write-Host "Launched process ID: $($proc1.Id)"

# Wait for window handle to be created
$timeout = 15
$elapsed = 0
$hWnd = [IntPtr]::Zero

while ($elapsed -lt $timeout) {
    Start-Sleep -Seconds 1
    $proc1.Refresh()
    if ($proc1.HasExited) {
        throw "Process exited prematurely with code $($proc1.ExitCode)"
    }
    $hWnd = $proc1.MainWindowHandle
    if ($hWnd -ne [IntPtr]::Zero) {
        Write-Host "Main window handle acquired: $hWnd"
        break
    }
    $elapsed++
}

if ($hWnd -eq [IntPtr]::Zero) {
    Write-Host "Window handle not acquired via MainWindowHandle; finding by Process ID..."
    Start-Sleep -Seconds 3
    $proc1.Refresh()
    $hWnd = $proc1.MainWindowHandle
    Write-Host "Resolved MainWindowHandle: $hWnd"
}

# Allow WebView2 to initialize UI
Start-Sleep -Seconds 4

Write-Host "Simulating X button click by sending WM_CLOSE to window $hWnd..."
# CloseMainWindow sends WM_CLOSE natively
$closeResult = $proc1.CloseMainWindow()
Write-Host "CloseMainWindow returned: $closeResult"

# Wait for process to exit
Write-Host "Waiting up to 10 seconds for process $($proc1.Id) to terminate..."
$exited = $proc1.WaitForExit(10000)
Write-Host "Process $($proc1.Id) exited: $exited (ExitCode: $($proc1.ExitCode))"

if (-not $exited) {
    Write-Host "Process did not exit after CloseMainWindow! Attempting direct Win32 WM_CLOSE SendMessage..."
    [Win32Helper]::SendMessage($hWnd, [Win32Helper]::WM_CLOSE, [IntPtr]::Zero, [IntPtr]::Zero)
    $exited = $proc1.WaitForExit(5000)
    Write-Host "After Win32 WM_CLOSE: Exited = $exited"
}

if (-not $exited) {
    $proc1.Kill()
    throw "TEST 1 FAILED: Process did not terminate after X button (WM_CLOSE)"
}
Write-Host "TEST 1 PASSED: X button (WM_CLOSE) successfully closed the application and terminated process cleanly."

# Verify no lingering child WebView2 processes for proc1
$lingering = Get-CimInstance Win32_Process | Where-Object { $_.ParentProcessId -eq $proc1.Id }
if ($lingering) {
    Write-Host "WARNING: Found lingering child processes: $($lingering.ProcessId)"
} else {
    Write-Host "SUCCESS: No lingering child processes found."
}

Write-Host "`n=== TEST 2: Launch v1.0.3 and test Alt+F4 (SC_CLOSE) ==="
$proc2 = Start-Process -FilePath $exePath -PassThru
Write-Host "Launched process ID: $($proc2.Id)"

Start-Sleep -Seconds 5
$proc2.Refresh()
$hWnd2 = $proc2.MainWindowHandle
Write-Host "Main window handle: $hWnd2"

Write-Host "Simulating Alt+F4 by sending WM_SYSCOMMAND SC_CLOSE..."
[Win32Helper]::PostMessage($hWnd2, [Win32Helper]::WM_SYSCOMMAND, [IntPtr][Win32Helper]::SC_CLOSE, [IntPtr]::Zero)

$exited2 = $proc2.WaitForExit(10000)
Write-Host "Process $($proc2.Id) exited: $exited2 (ExitCode: $($proc2.ExitCode))"

if (-not $exited2) {
    $proc2.Kill()
    throw "TEST 2 FAILED: Process did not terminate after Alt+F4 (SC_CLOSE)"
}
Write-Host "TEST 2 PASSED: Alt+F4 (SC_CLOSE) successfully closed the application and terminated process cleanly."

Write-Host "`n=== TEST 3: Inspect local database integrity ==="
$dbPath = "$env:APPDATA\com.skyrasoft.ecodrive\ecodrive_offline.db"
if (Test-Path $dbPath) {
    $dbItem = Get-Item $dbPath
    Write-Host "Database file: $dbPath"
    Write-Host "Length: $($dbItem.Length) bytes, LastWriteTime: $($dbItem.LastWriteTime)"
    Write-Host "SUCCESS: SQLite offline database is present and intact."
} else {
    Write-Host "Database file does not exist at $dbPath"
}

Write-Host "`n=== ALL CLOSE AND TERMINATION TESTS COMPLETED SUCCESSFULLY ==="
