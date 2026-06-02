@echo off
title MCDO Website Server
echo.
echo ========================================
echo   MCDO Website Server Starting...
echo ========================================
echo.
echo Your IP Address: 192.168.1.13
echo Phone Access Link: http://192.168.1.13:8000
echo.
echo IMPORTANT: Keep this window open while using the website!
echo Closing this window will stop the server.
echo.
echo Starting server on port 8000...
echo.

powershell -Command "& {
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add('http://+:8000/')
    try {
        $listener.Start()
        Write-Host 'Server started successfully!'
        Write-Host 'Local access: http://localhost:8000'
        Write-Host 'Phone access: http://192.168.1.13:8000'
        Write-Host '========================================'
        Write-Host 'Server is running... Press Ctrl+C to stop'
        Write-Host '========================================'
        
        while ($listener.IsListening) {
            try {
                $context = $listener.GetContext()
                $request = $context.Request
                $response = $context.Response
                
                # Add CORS headers
                $response.Headers.Add('Access-Control-Allow-Origin', '*')
                $response.Headers.Add('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
                $response.Headers.Add('Access-Control-Allow-Headers', 'Content-Type')
                
                # Get the file path
                $urlPath = $request.Url.LocalPath
                if ($urlPath -eq '/') {
                    $filePath = '.\index.html'
                } else {
                    $filePath = '.\' + $urlPath.TrimStart('/')
                }
                
                # Serve the file
                if (Test-Path $filePath) {
                    $content = [System.IO.File]::ReadAllBytes($filePath)
                    $response.StatusCode = 200
                    $response.ContentType = 'text/html'
                    $response.OutputStream.Write($content, 0, $content.Length)
                } else {
                    $response.StatusCode = 404
                    $errorText = [System.Text.Encoding]::UTF8.GetBytes('<h1>404 - File Not Found</h1>')
                    $response.OutputStream.Write($errorText, 0, $errorText.Length)
                }
                
                $response.Close()
            } catch {
                Write-Host 'Error processing request: ' $_.Exception.Message
            }
        }
    } catch {
        Write-Host 'Error starting server: ' $_.Exception.Message
        Write-Host ''
        Write-Host 'Troubleshooting:'
        Write-Host '1. Make sure port 8000 is not in use'
        Write-Host '2. Check Windows Firewall settings'
        Write-Host '3. Try running as Administrator'
    }
}"

echo.
echo Server stopped.
pause
