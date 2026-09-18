@echo off
chcp 65001 >nul
echo.
echo [Arnix] Starting Development Server on http://localhost:3000 ...
echo.
cd /d "%~dp0"
call npm.cmd run dev
