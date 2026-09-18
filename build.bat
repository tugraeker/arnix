@echo off
chcp 65001 >nul
echo.
echo [Arnix] Running Production Build (next build)...
echo.
cd /d "%~dp0"
call npm.cmd run build
echo.
echo build exit code: %ERRORLEVEL%
echo.
