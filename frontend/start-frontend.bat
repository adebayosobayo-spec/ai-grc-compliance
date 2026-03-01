@echo off
echo Installing dependencies...
call npm install
echo.
echo Starting frontend dev server...
call npm run dev
pause
