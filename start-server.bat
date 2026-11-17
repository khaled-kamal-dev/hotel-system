@echo off
title 🏨 Hotel System Server
echo.
echo  ================================
echo   🏨 Hotel Management System
echo  ================================
echo.
echo  Starting server...
echo.
cd /d "%~dp0"

:: Start the browser after 2 seconds
start "" powershell -NoProfile -Command "Start-Sleep -Seconds 2; Start-Process 'http://localhost:3000'"

:: Start the Node.js server
node server.js
pause
