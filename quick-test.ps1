Write-Host "Testing Hotel API..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://localhost:4000/api/hotels/bangkok?checkIn=2026-02-15&checkOut=2026-02-17"
    Write-Host "SUCCESS!" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "ERROR: $_" -ForegroundColor Red
}
