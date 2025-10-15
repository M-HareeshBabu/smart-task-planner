@echo off
echo ========================================
echo Smart Task Planner - Installing Dependencies
echo ========================================
echo.

echo Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please download and install Node.js from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo Node.js is installed
node --version
echo.

echo Checking npm installation...
npm --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm is not available!
    echo.
    pause
    exit /b 1
)

echo npm is installed
npm --version
echo.

echo Installing dependencies...
echo This may take a few minutes...
echo.

call npm install express cors body-parser uuid node-cron dotenv bcryptjs jsonwebtoken

if errorlevel 1 (
    echo.
    echo ========================================
    echo Installation failed!
    echo ========================================
    echo Please check the error messages above.
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo Installation completed successfully!
echo ========================================
echo.
echo To start the application, run:
echo   npm start
echo.
echo Or for development mode:
echo   npm run dev
echo.
pause
