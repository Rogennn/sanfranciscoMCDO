# Server Connection Troubleshooting Guide

## Problem: "192.168.1.13 refused to connect" (ERR_CONNECTION_REFUSED)

This error means the server is not running or is blocked.

## Step-by-Step Solutions:

### 1. Try the Ultimate Server
**Double-click:** `start-server-ultimate.bat`
This file:
- Automatically detects your IP address
- Kills any processes blocking port 8000
- Tries multiple server methods
- Shows detailed error messages

### 2. Check if Server is Actually Running
After running the server, you should see:
- "SUCCESS: Server running at http://192.168.1.13:8000"
- "Keep this window open!"

If you see error messages instead, the server isn't starting.

### 3. Windows Firewall Fix
1. **Press Windows Key + R**
2. **Type:** `wf.msc` and press Enter
3. **Click "Inbound Rules"** on the left
4. **Click "New Rule..."** on the right
5. **Select "Port"** and click Next
6. **Select "TCP"** and "Specific local ports: 8000"
7. **Click "Allow the connection"**
8. **Check all profiles (Domain, Private, Public)**
9. **Name it:** "MCDO Website Server"
10. **Click Finish**

### 4. Run as Administrator
1. **Right-click** `start-server-ultimate.bat`
2. **Select "Run as administrator"**
3. **Try accessing the website again**

### 5. Check Network Connection
1. **Make sure phone and computer are on same WiFi**
2. **Disconnect and reconnect both devices to WiFi**
3. **Restart your router** if possible

### 6. Alternative Port Method
If port 8000 doesn't work, try port 3000:
1. **Open Command Prompt as Administrator**
2. **Navigate to:** `cd c:\Users\admin\Desktop\mcdo`
3. **Run:** `python -m http.server 3000 --bind 0.0.0.0`
4. **Use:** `http://192.168.1.13:3000` on your phone

### 7. Check for Antivirus Blocking
Some antivirus software blocks local servers:
1. **Temporarily disable antivirus**
2. **Try the server again**
3. **Re-enable antivirus after testing**

### 8. Network Reset
If nothing works:
1. **Open Command Prompt as Administrator**
2. **Run:** `netsh winsock reset`
3. **Run:** `netsh int ip reset`
4. **Restart computer**
5. **Try the server again**

## Quick Test Checklist:
- [ ] Server window shows "SUCCESS: Server running at http://192.168.1.13:8000"
- [ ] Server window stays open (don't close it)
- [ ] Phone and computer on same WiFi network
- [ ] Windows Firewall allows port 8000
- [ ] No antivirus blocking
- [ ] Try running as administrator

## Still Not Working?
If you've tried everything above:
1. **Copy the exact error messages** from the server window
2. **Check if other devices on your network** can access the link
3. **Try a different browser** on your phone (Chrome, Firefox, Safari)
4. **Restart both devices** and try again

## Success Indicators:
- Server window shows success message
- You can access `http://localhost:8000` on your computer
- You can access `http://192.168.1.13:8000` on your phone
- Website loads properly and all features work
