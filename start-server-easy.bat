@echo off
title MCDO Website Server - Easy Start
echo.
echo ========================================
echo   MCDO Website Server
echo ========================================
echo.
echo Your Phone Link: http://192.168.1.13:8000
echo.
echo Starting server...
echo Keep this window open!
echo.
cd /d "c:\Users\admin\Desktop\mcdo"

REM Try Python first
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo Using Python server...
    python -m http.server 8000 --bind 0.0.0.0
    goto :end
)

REM Try Python3
python3 --version >nul 2>&1
if %errorlevel% == 0 (
    echo Using Python3 server...
    python3 -m http.server 8000 --bind 0.0.0.0
    goto :end
)

REM If no Python, use PowerShell
echo Using PowerShell server...
powershell -Command "$listener = New-Object System.Net.HttpListener; $listener.Prefixes.Add('http://+:8000/'); $listener.Start(); Write-Host 'Server running at http://192.168.1.13:8000'; Write-Host 'Keep this window open!'; while($listener.IsListening) { $context = $listener.GetContext(); $request = $context.Request; $response = $context.Response; $response.Headers.Add('Access-Control-Allow-Origin', '*'); $urlPath = $request.Url.LocalPath; if($urlPath -eq '/') { $filePath = '.\index.html'; } else { $filePath = '.\' + $urlPath.TrimStart('/'); } if(Test-Path $filePath) { $content = [System.IO.File]::ReadAllBytes($filePath); $response.StatusCode = 200; $response.ContentType = 'text/html'; $response.OutputStream.Write($content, 0, $content.Length); } else { $response.StatusCode = 404; } $response.Close(); }"

:end
echo.
echo Server stopped.
pause
