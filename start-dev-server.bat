@echo off
REM Start a local development web server
REM Opens automatically at http://localhost:3000

cd /d "%~dp0public"

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Starting server with Python...
    echo Open: http://localhost:3000
    echo Press Ctrl+C to stop
    python -m http.server 3000
) else (
    REM Try Node.js http-server as fallback
    echo Python not found. Trying Node.js...
    npx http-server -p 3000
)
