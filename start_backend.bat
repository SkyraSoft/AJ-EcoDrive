@echo off
title EcoDrive Backend API (Port 3000)
cd /d "%~dp0backend"
echo ==========================================================
echo   EcoDrive ERP Backend API Server (Port 3000)
echo ==========================================================
echo Starting server...
node src/server.js
pause

