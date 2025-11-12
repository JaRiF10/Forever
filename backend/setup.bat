@echo off
REM My Sayang Backend Setup Script for Windows

echo.
echo ========================================
echo   My Sayang Backend Setup (Windows)
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js not found. Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo ✅ Node.js found: %NODE_VERSION%

REM Install dependencies
echo.
echo 📦 Installing dependencies...
call npm install

REM Copy .env.example to .env if .env doesn't exist
if not exist .env (
    echo.
    echo 🔧 Creating .env file...
    copy .env.example .env
    echo ✅ .env created. Please edit it with your MongoDB URI and JWT secret.
    echo.
    echo 📝 Open .env and update:
    echo    - MONGO_URI (local or MongoDB Atlas)
    echo    - JWT_SECRET (strong random string)
) else (
    echo ✅ .env already exists
)

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo 🚀 To start the server, run:
echo    npm dev         (development with auto-reload)
echo    npm start       (production)
echo.
echo 📚 API runs on http://localhost:5000
echo.
echo 💾 Make sure MongoDB is running:
echo    docker run -d -p 27017:27017 --name mongodb mongo:latest
echo    (or use MongoDB Atlas cloud)
echo.
pause
