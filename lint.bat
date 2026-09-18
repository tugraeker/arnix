@echo off
chcp 65001 >nul
echo.
echo [Arnix] Running Lint...
echo.
cd /d "%~dp0"
call npm.cmd run lint
echo.
echo lint exit code: %ERRORLEVEL%
echo.
