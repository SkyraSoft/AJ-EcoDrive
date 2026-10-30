@echo off
setlocal
title AJ EcoDrive ERP — Gmail SMTP Setup
cls

cd /d "%~dp0\backend"

node scripts\apply_gmail_smtp.js %*

if %ERRORLEVEL% EQU 0 (
  echo.
  echo ======================================================================
  echo [SUCCESS] Your Gmail SMTP is configured and authenticated with Google!
  echo ======================================================================
) else (
  echo.
  echo [ERROR] Setup did not complete. Please see above error details.
)

echo.
pause
