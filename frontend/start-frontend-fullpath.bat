@echo off
echo Looking for Node.js...

IF EXIST "C:\Program Files\nodejs\npm.cmd" (
    echo Found Node.js at C:\Program Files\nodejs\
    SET NPM="C:\Program Files\nodejs\npm.cmd"
    GOTO RUN
)

IF EXIST "C:\Program Files (x86)\nodejs\npm.cmd" (
    echo Found Node.js at C:\Program Files (x86)\nodejs\
    SET NPM="C:\Program Files (x86)\nodejs\npm.cmd"
    GOTO RUN
)

IF EXIST "%APPDATA%\nvm\current\npm.cmd" (
    echo Found Node.js via nvm
    SET NPM="%APPDATA%\nvm\current\npm.cmd"
    GOTO RUN
)

echo ERROR: Could not find npm. Please install Node.js from https://nodejs.org
pause
EXIT /B 1

:RUN
echo Installing dependencies...
%NPM% install

echo.
echo Starting frontend dev server...
%NPM% run dev
pause
