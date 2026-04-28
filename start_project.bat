@echo off
title 3D Transformation Project
set PORT=8000

echo ==========================================
echo    Starting 3D Transformation Website
echo ==========================================
echo.
echo 1. Opening your browser to http://localhost:%PORT%...
start http://localhost:%PORT%

echo 2. Starting local server...
echo.
echo [NOTE] Keep this window open while using the website.
echo [NOTE] Press Ctrl+C or close this window to stop the server.
echo.

python -m http.server %PORT%

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Failed to start server. Please ensure Python is installed.
    echo Alternatively, you can open index.html directly in your browser.
    pause
)
