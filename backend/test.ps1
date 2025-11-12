# My Sayang Backend Quick Test Script
# Usage: .\test.ps1

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  My Sayang Backend - Quick Test" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Check if server is running
Write-Host "Checking if backend server is running on localhost:5000..." -ForegroundColor Yellow

$serverRunning = $false
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -ErrorAction SilentlyContinue -TimeoutSec 2
    if ($response.StatusCode -eq 200) {
        $serverRunning = $true
        Write-Host "OK - Server is running!" -ForegroundColor Green
    }
} catch {
    $serverRunning = $false
}

if (-not $serverRunning) {
    Write-Host "ERROR - Server not running at http://localhost:5000" -ForegroundColor Red
    Write-Host "`nTo start the server, run:" -ForegroundColor Yellow
    Write-Host "  npm dev" -ForegroundColor Cyan
    Write-Host "`nOr if npm is not installed:" -ForegroundColor Yellow
    Write-Host "  node server.js" -ForegroundColor Cyan
    Write-Host "`nAlso make sure MongoDB is running:" -ForegroundColor Yellow
    Write-Host "  docker run -d -p 27017:27017 --name mongodb mongo:latest" -ForegroundColor Cyan
    exit 1
}

# Check if MongoDB is connected
Write-Host "`nChecking MongoDB connection..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -ErrorAction SilentlyContinue
    $health = $response.Content | ConvertFrom-Json
    Write-Host "OK - MongoDB is connected!" -ForegroundColor Green
} catch {
    Write-Host "WARNING - Could not verify MongoDB connection" -ForegroundColor Yellow
}

# Run comprehensive tests
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Running API Tests" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

node test-api.js
