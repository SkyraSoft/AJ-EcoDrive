@echo off
title EcoDrive ERP - Launcher
echo ==========================================================
echo   EcoDrive ERP - Full Stack Launch
echo ==========================================================
echo Starting Backend in a dedicated terminal window...
start "EcoDrive Backend API (Port 3000)" "%~dp0start_backend.bat"
timeout /t 3 /nobreak >nul
echo Starting Frontend in a dedicated terminal window...
start "EcoDrive Frontend Vite (Port 5173)" "%~dp0start_frontend.bat"
echo.
echo All services launched in external terminal windows!
echo Backend: http://localhost:3000
echo Frontend: http://localhost:5173

