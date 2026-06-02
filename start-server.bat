@echo off
echo Starting MCDO Website Server...
echo.
echo This will start a local server so you can access the website from your phone
echo.
echo Please make sure:
echo 1. Your phone and computer are on the same WiFi network
echo 2. Your firewall allows connections on port 8000
echo.
echo Press any key to start the server...
pause > nul

python start-server.py

pause
