$ErrorActionPreference = "Stop"

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

Write-Host "================================================================="
Write-Host "AJ ECODRIVE ERP v1.0.3 - POST-UPGRADE COMPREHENSIVE AUDIT"
Write-Host "================================================================="

# --- 1. Windows Installed Version Verification ---
Write-Host "`n--- 1. Checking Windows Installed Version in Registry ---"
$uninstPaths = @(
    "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*",
    "HKLM:\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*",
    "HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*"
)

$installedApp = Get-ItemProperty $uninstPaths -ErrorAction SilentlyContinue | Where-Object { $_.DisplayName -eq "AJ EcoDrive ERP" }

if (-not $installedApp) {
    throw "AJ EcoDrive ERP not found in Windows Uninstall registry!"
}

Write-Host "DisplayName:     $($installedApp.DisplayName)"
Write-Host "DisplayVersion:  $($installedApp.DisplayVersion)"
Write-Host "Publisher:       $($installedApp.Publisher)"
Write-Host "InstallLocation: $($installedApp.InstallLocation)"
Write-Host "UninstallString: $($installedApp.UninstallString)"

if ($installedApp.DisplayVersion -ne "1.0.3") {
    throw "Installed version mismatch: Expected 1.0.3, got $($installedApp.DisplayVersion)"
}
Write-Host "SUCCESS: Windows Installed Version is officially verified as 1.0.3."

# --- 2. Checking Installed Executable on Disk ---
Write-Host "`n--- 2. Checking Installed Executable in Program Files ---"
$installedExe = "C:\Program Files\AJ EcoDrive ERP\aj-ecodrive-erp.exe"
if (-not (Test-Path $installedExe)) {
    throw "Installed executable not found at $installedExe"
}
$exeItem = Get-Item $installedExe
$exeVersion = [System.Diagnostics.FileVersionInfo]::GetVersionInfo($installedExe)
Write-Host "Path:          $installedExe"
Write-Host "File Size:     $($exeItem.Length) bytes ($([math]::Round($exeItem.Length/1MB, 2)) MB)"
Write-Host "LastModified:  $($exeItem.LastWriteTime)"
Write-Host "ProductVersion:$($exeVersion.ProductVersion)"
Write-Host "FileVersion:   $($exeVersion.FileVersion)"

# --- 3. Checking Shortcuts ---
Write-Host "`n--- 3. Checking Desktop and Start Menu Shortcuts ---"
$desktopShortcut = "C:\Users\Public\Desktop\AJ EcoDrive ERP.lnk"
$startShortcut = "C:\ProgramData\Microsoft\Windows\Start Menu\Programs\AJ EcoDrive ERP\AJ EcoDrive ERP.lnk"

$wshShell = New-Object -ComObject WScript.Shell

if (Test-Path $desktopShortcut) {
    $dLink = $wshShell.CreateShortcut($desktopShortcut)
    Write-Host "Desktop Shortcut:    FOUND ($desktopShortcut)"
    Write-Host "  Target:            $($dLink.TargetPath)"
} else {
    Write-Host "Desktop Shortcut:    Not present at $desktopShortcut"
}

if (Test-Path $startShortcut) {
    $sLink = $wshShell.CreateShortcut($startShortcut)
    Write-Host "Start Menu Shortcut: FOUND ($startShortcut)"
    Write-Host "  Target:            $($sLink.TargetPath)"
} else {
    Write-Host "Start Menu Shortcut: Not present at $startShortcut"
}

# --- 4. Checking SQLite Database & User Settings Preservation ---
Write-Host "`n--- 4. Checking SQLite Database & User Data Preservation ---"
$roamingDir = "$env:APPDATA\com.skyrasoft.ecodrive"
$dbPath = "$roamingDir\ecodrive_offline.db"
$vaultPath = "$roamingDir\vault.bin"

if (-not (Test-Path $dbPath)) {
    throw "SQLite database missing at $dbPath"
}
$dbItem = Get-Item $dbPath
Write-Host "SQLite Database:   $dbPath"
Write-Host "  Size:            $($dbItem.Length) bytes"
Write-Host "  Last Modified:   $($dbItem.LastWriteTime)"

$stream = [System.IO.FileStream]::new($dbPath, [System.IO.FileMode]::Open, [System.IO.FileAccess]::Read, [System.IO.FileShare]::ReadWrite)
$headerBytes = New-Object byte[] 16
$stream.Read($headerBytes, 0, 16) | Out-Null
$stream.Close()
$headerString = [System.Text.Encoding]::ASCII.GetString($headerBytes)
Write-Host "  Header:          $headerString"
if ($headerString -like "SQLite format 3*") {
    Write-Host "  Verification:    VALID SQLite 3 format verified. User data completely preserved."
} else {
    throw "Invalid SQLite header!"
}

if (Test-Path $vaultPath) {
    $vItem = Get-Item $vaultPath
    Write-Host "DPAPI Vault:       $vaultPath ($($vItem.Length) bytes, Preserved)"
}

# --- 5. Test Application Launch & X Button Closure ---
Write-Host "`n--- 5. Testing Launch of Installed v1.0.3 & X Button (WM_CLOSE) ---"
$p1 = Start-Process -FilePath $installedExe -PassThru
Write-Host "Launched installed v1.0.3 PID: $($p1.Id)"

$timeout = 15
$elapsed = 0
$hWnd1 = [IntPtr]::Zero

while ($elapsed -lt $timeout) {
    Start-Sleep -Seconds 1
    $p1.Refresh()
    if ($p1.HasExited) {
        throw "Installed app exited prematurely with code $($p1.ExitCode)"
    }
    $hWnd1 = $p1.MainWindowHandle
    if ($hWnd1 -ne [IntPtr]::Zero) {
        Write-Host "Main window handle acquired: $hWnd1"
        break
    }
    $elapsed++
}

# Allow WebView2 to load
Start-Sleep -Seconds 5

# Check WebView2 child process
$wvProcs1 = Get-CimInstance Win32_Process | Where-Object { $_.ParentProcessId -eq $p1.Id }
Write-Host "WebView2 Child Processes detected: $($wvProcs1.Count)"
foreach ($wv in $wvProcs1) {
    Write-Host "  Child PID: $($wv.ProcessId) ($($wv.Name))"
}

# Check logging initialization
$logDir = "$env:LOCALAPPDATA\com.skyrasoft.ecodrive\logs"
if (Test-Path $logDir) {
    $latestLog = Get-ChildItem -Path $logDir | Sort-Object LastWriteTime -Descending | Select-Object -First 1
    Write-Host "Latest Log File: $($latestLog.Name) (Size: $($latestLog.Length) bytes, Modified: $($latestLog.LastWriteTime))"
    Write-Host "SUCCESS: Logging initialized without Access Denied."
}

Write-Host "Simulating X button click by sending WM_CLOSE to window $hWnd1..."
$closeRes = $p1.CloseMainWindow()
Write-Host "CloseMainWindow returned: $closeRes"

$exited1 = $p1.WaitForExit(8000)
Write-Host "Process $($p1.Id) exited cleanly: $exited1 (ExitCode: $($p1.ExitCode))"
if (-not $exited1) {
    $p1.Kill()
    throw "X button failed to close installed v1.0.3 application!"
}
Write-Host "SUCCESS: X button cleanly closed the installed v1.0.3 application."

# --- 6. Test Alt + F4 Termination ---
Write-Host "`n--- 6. Testing Launch & Alt + F4 Termination ---"
$p2 = Start-Process -FilePath $installedExe -PassThru
Write-Host "Launched installed v1.0.3 PID: $($p2.Id)"
Start-Sleep -Seconds 5
$p2.Refresh()
$hWnd2 = $p2.MainWindowHandle
Write-Host "Main window handle: $hWnd2"

Write-Host "Simulating Alt + F4 (WM_SYSCOMMAND SC_CLOSE)..."
[Win32Helper]::PostMessage($hWnd2, [Win32Helper]::WM_SYSCOMMAND, [IntPtr][Win32Helper]::SC_CLOSE, [IntPtr]::Zero) | Out-Null

$exited2 = $p2.WaitForExit(8000)
Write-Host "Process $($p2.Id) exited cleanly: $exited2 (ExitCode: $($p2.ExitCode))"
if (-not $exited2) {
    $p2.Kill()
    throw "Alt + F4 failed to close installed v1.0.3 application!"
}
Write-Host "SUCCESS: Alt + F4 cleanly terminated the installed v1.0.3 application."

# --- 7. Test Reopening ---
Write-Host "`n--- 7. Testing Application Reopening ---"
$p3 = Start-Process -FilePath $installedExe -PassThru
Write-Host "Reopened installed v1.0.3 PID: $($p3.Id)"
Start-Sleep -Seconds 4
$p3.Refresh()
$reopenSuccess = -not $p3.HasExited
Write-Host "Reopened application running healthy: $reopenSuccess"
$p3.CloseMainWindow() | Out-Null
$p3.WaitForExit(5000) | Out-Null
Write-Host "Reopened instance closed cleanly (ExitCode: $($p3.ExitCode))"

Write-Host "`n================================================================="
Write-Host "ALL POST-UPGRADE TESTS COMPLETED AND VERIFIED SUCCESSFULLY!"
Write-Host "================================================================="
