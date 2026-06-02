# MCDO Website - Phone Access Guide

## Problem: Website Can't Be Reached on Phone

When you paste the link on your phone and open it in Chrome, it shows "can't be reached" because the website is running locally on your computer and not accessible from other devices.

## Solution: Start a Local Development Server

### Option 1: Python Server (Recommended)

1. **Double-click `start-server.bat`**
   - This will start a Python HTTP server
   - The console will show the local and phone access URLs

2. **Access from your phone:**
   - Make sure your phone and computer are on the same WiFi network
   - Open Chrome on your phone
   - Enter the URL shown in the console (e.g., `http://192.168.1.100:8000`)

### Option 2: Node.js Server

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   ```

3. **Access from your phone:**
   - Use the URL shown in the console

### Option 3: Python Manual

1. **Open Command Prompt** in the project folder
2. **Run:**
   ```bash
   python -m http.server 8000
   ```
3. **Access from your phone:**
   - Find your computer's IP address
   - Go to `http://YOUR_IP:8000` on your phone

## Troubleshooting

### If it still doesn't work:

1. **Check Network Connection:**
   - Ensure both devices are on the same WiFi
   - Try disconnecting and reconnecting to WiFi

2. **Check Firewall:**
   - Windows: Allow Python/Node.js through Windows Firewall
   - Temporarily disable firewall to test

3. **Find Your IP Address:**
   - Windows: Open Command Prompt and run `ipconfig`
   - Look for "IPv4 Address" (usually starts with 192.168.x.x)
   - Use this IP address on your phone

4. **Try Different Ports:**
   - If port 8000 doesn't work, try port 3000 or 8080

5. **Check Antivirus Software:**
   - Some antivirus software blocks local servers
   - Temporarily disable to test

## Quick Test

1. **Start the server** using one of the methods above
2. **Note the IP address** shown in the console
3. **On your computer**, try accessing `http://YOUR_IP:8000`
4. **If it works on computer**, try the same URL on your phone
5. **If it doesn't work**, check the troubleshooting steps above

## Success Indicators

- Server console shows "Server listening on port 8000"
- You can access the website on your computer using `http://localhost:8000`
- You can access the website on your phone using `http://YOUR_IP:8000`
- The website displays properly and all features work on mobile

## Need Help?

If you're still having issues, check:
- Both devices are on the same network
- Firewall is not blocking the connection
- Server is actually running (check console output)
- IP address is correct
