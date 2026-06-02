@echo off
title MCDO Website Server - Ultimate Fix
echo.
echo ========================================
echo   MCDO Website Server - Ultimate Fix
echo ========================================
echo.
echo STEP 1: Checking your IP address...
for /f "tokens=2 delims=:" %%i in ('ipconfig ^| findstr "IPv4"') do set IP=%%i
set IP=%IP%
echo Your IP: %IP%
echo.
echo STEP 2: Starting server...
echo Phone Link: http://%IP%:8000
echo.
echo IMPORTANT: Keep this window open!
echo.

cd /d "%~dp0"

REM First try to kill any existing process on port 8000
echo Checking for existing processes on port 8000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8000"') do (
    echo Found process %%a on port 8000, terminating...
    taskkill /f /pid %%a >nul 2>&1
)

REM Try different server methods
echo Method 1: Trying Python...
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo Python found, starting server...
    echo Server will run at: http://%IP%:8000
    echo Opening browser...
    start http://localhost:8000
    python -m http.server 8000 --bind 0.0.0.0
    goto :success
)

echo Method 2: Trying Python3...
python3 --version >nul 2>&1
if %errorlevel% == 0 (
    echo Python3 found, starting server...
    echo Server will run at: http://%IP%:8000
    echo Opening browser...
    start http://localhost:8000
    python3 -m http.server 8000 --bind 0.0.0.0
    goto :success
)

echo Method 3: Using PowerShell...
echo Starting PowerShell server...
echo Server will run at: http://%IP%:8000
powershell -Command "& {
    try {
        $listener = New-Object System.Net.HttpListener
        $listener.Prefixes.Add('http://+:8000/')
        $listener.Start()
        Write-Host 'SUCCESS: Server running at http://%IP%:8000'
        Write-Host 'Keep this window open!'
        Write-Host '========================================'
        Start-Process "http://localhost:8000"
        
        while($listener.IsListening) {
            try {
                $context = $listener.GetContext()
                $request = $context.Request
                $response = $context.Response
                
                $response.Headers.Add('Access-Control-Allow-Origin', '*')
                $urlPath = $request.Url.LocalPath
                if($urlPath -eq '/') { $filePath = '.\index.html' } 
                else { $filePath = '.\' + $urlPath.TrimStart('/') }
                
                if(Test-Path $filePath) {
                    $content = [System.IO.File]::ReadAllBytes($filePath)
                    $response.StatusCode = 200
                    $response.ContentType = 'text/html'
                    $response.OutputStream.Write($content, 0, $content.Length)
                } else {
                    $response.StatusCode = 404
                }
                $response.Close()
            } catch {
                Write-Host 'Request error: ' $_.Exception.Message
            }
        }
    } catch {
        Write-Host 'ERROR: ' $_.Exception.Message
        Write-Host ''
        Write-Host 'TROUBLESHOOTING:'
        Write-Host '1. Run as Administrator'
        Write-Host '2. Check Windows Firewall'
        Write-Host '3. Make sure port 8000 is not blocked'
    }
}"

:success
echo.
echo Server stopped.
pause
