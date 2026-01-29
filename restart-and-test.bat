@echo off
REM Restart API server and run tests

echo.
echo ================================
echo 🔄 Restarting API Server
echo ================================
echo.

REM Kill any existing node processes
echo Stopping any running API servers...
taskkill /F /IM node.exe /T 2>nul || echo No node processes found

REM Wait a moment
timeout /t 2 /nobreak

REM Start API server
echo.
echo Starting API server from e:\api-db-app...
cd e:\api-db-app
start "API Server" node server.js

REM Wait for API to start
echo Waiting 5 seconds for API to initialize...
timeout /t 5 /nobreak

REM Test API health
echo.
echo Testing API health...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:3000/scheduling-groups' -UseBasicParsing -ErrorAction Stop; if ($response.StatusCode -eq 200) { Write-Host '✅ API is ready' } } catch { Write-Host '⚠️  API not ready yet, but proceeding...' }"

REM Return to test directory
echo.
echo ================================
echo 🧪 Running Tests
echo ================================
echo.

cd e:\playwright-api-tests
call npm test

echo.
echo ================================
echo ✅ Test run complete
echo ================================
echo.
echo Note: API server is still running in a separate window
echo Close the API window when done, or run: taskkill /F /IM node.exe
pause
