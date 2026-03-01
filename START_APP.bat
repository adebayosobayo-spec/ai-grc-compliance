@echo off
title BAYEAUX AI
color 0A
echo.
echo  ====================================
echo   BAYEAUX AI  -  Starting...
echo  ====================================
echo.

:: Kill anything on ports 8000 and 3000
echo  Stopping old processes...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8000 "') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000 "') do taskkill /F /PID %%a >nul 2>&1
timeout /t 1 /nobreak >nul

:: Start Backend
echo  Starting Backend  (port 8000)...
start "BAYEAUX Backend" cmd /c "cd /d %~dp0backend && venv\Scripts\python.exe run.py"

timeout /t 3 /nobreak >nul

:: Start Frontend
echo  Starting Frontend (port 3000)...
start "BAYEAUX Frontend" cmd /c "cd /d %~dp0frontend && npm run dev"

timeout /t 5 /nobreak >nul

:: Open browser
echo  Opening browser...
start http://localhost:3000

echo.
echo  App is running at http://localhost:3000
echo  (Close this window whenever you want - servers keep running)
echo.
