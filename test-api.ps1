# Test script for Amigo Backend API

Write-Host "Testing Amigo Backend API..." -ForegroundColor Cyan
Write-Host ""

# Test health endpoint
Write-Host "1. Testing Health Endpoint:" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:4000/" -Method Get
    $response | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "2. Testing Flight Endpoint (CNX to DMK):" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:4000/api/flights/cnx-dmk?date=2026-02-15" -Method Get
    $response | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "3. Testing Hotel Endpoint (Bangkok):" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:4000/api/hotels/bangkok?checkIn=2026-02-15&checkOut=2026-02-17" -Method Get
    $response | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
