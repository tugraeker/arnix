@echo off
chcp 65001 >nul
echo.
echo [Arnix] Running TypeScript typecheck (tsc --noEmit)...
echo.
cd /d "%~dp0"
call .\node_modules\.bin\tsc.cmd --noEmit
echo.
echo tsc exit code: %ERRORLEVEL%
echo.
