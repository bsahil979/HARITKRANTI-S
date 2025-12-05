# PowerShell script to start the backend server
# This bypasses the execution policy issue

Write-Host "Starting backend server..." -ForegroundColor Green
Write-Host ""

# Change to backend directory
Set-Location $PSScriptRoot

# Set execution policy for this process only
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process -Force

# Start the server
Write-Host "Running: node src/index.js" -ForegroundColor Yellow
Write-Host ""

node src/index.js



