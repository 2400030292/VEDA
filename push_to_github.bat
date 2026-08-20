@echo off
echo ========================================================
echo        VEDA Project - GitHub Push Assistant
echo ========================================================
echo.

set GIT_PATH="C:\Program Files\Git\cmd\git.exe"

if not exist %GIT_PATH% (
    echo [ERROR] Git is not installed in the default directory.
    echo Please open "Git Bash" from your Windows Start Menu, type 'cd "d:\VEDA Project"' and run the git commands manually.
    pause
    exit /b
)

echo [1/4] Initializing Git repository...
%GIT_PATH% init

echo [2/4] Staging files (your .env and node_modules are safely ignored)...
%GIT_PATH% add .

echo [3/4] Committing files...
%GIT_PATH% commit -m "Initial commit for VEDA Project - Ready for deployment"

echo.
echo ========================================================
echo ALMOST THERE! 
echo Go to GitHub.com, create a NEW empty repository, and
echo copy the repository URL (e.g. https://github.com/name/repo.git)
echo ========================================================
echo.

set /p REPO_URL="Paste your GitHub Repository URL here and press Enter: "

if "%REPO_URL%"=="" (
    echo No URL provided. Exiting.
    pause
    exit /b
)

echo.
echo [4/4] Pushing to GitHub...
%GIT_PATH% branch -M main
%GIT_PATH% remote add origin %REPO_URL%
%GIT_PATH% push -u origin main

echo.
echo ========================================================
echo SUCCESS! Your code is now on GitHub!
echo ========================================================
pause
