@echo off
chcp 65001 >nul
echo.
echo [Arnix] Installing npm dependencies...
echo.
cd /d "%~dp0"
call npm.cmd install --no-audit --no-fund --progress=false
echo.
echo [Arnix] npm install completed with code %ERRORLEVEL%
echo.
