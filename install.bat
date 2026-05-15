@echo off
REM Installation script for Doctor Booking API Test Suite
REM This script installs all dependencies and sets up the testing environment

echo.
echo ===============================================
echo Doctor Booking API - Test Suite Setup
echo ===============================================
echo.

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: npm is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ✓ npm found
echo.

REM Display current Node and npm versions
echo Node.js and npm versions:
node --version
npm --version
echo.

REM Install dependencies
echo Installing dependencies...
echo.
npm install

if %ERRORLEVEL% NEQ 0 (
    echo ERROR: npm install failed
    pause
    exit /b 1
)

echo.
echo ✓ Dependencies installed successfully!
echo.

REM Display next steps
echo ===============================================
echo Setup Complete!
echo ===============================================
echo.
echo Available commands:
echo   npm test              - Run all tests
echo   npm run test:watch    - Run tests in watch mode
echo   npm run test:coverage - Generate coverage report
echo.
echo Test files created:
echo   - auth.test.js        (17 test cases)
echo   - doctor.test.js      (18 test cases)
echo   - schedule.test.js    (12 test cases)
echo   - appointment.test.js (25 test cases)
echo   - integration.test.js (10+ test cases)
echo.
echo Documentation:
echo   - TEST_SUMMARY.md      - Complete overview
echo   - TEST_DOCUMENTATION.md - Detailed documentation
echo   - TESTING_GUIDE.md     - Quick start guide
echo.
echo To run tests now, execute:
echo   npm test
echo.
pause
