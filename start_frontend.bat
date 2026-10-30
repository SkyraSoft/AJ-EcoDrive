@echo off
title EcoDrive Frontend Vite (Port 5173)
cd /d "%~dp0frontend"
echo ==========================================================
echo   EcoDrive ERP Frontend Dev Server (Port 5173)
echo ==========================================================
echo Starting Vite dev server...
npm run dev
pause

