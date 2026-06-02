# MCDO San Francisco - Deployment Guide

## Quick Start (Local Development)
```
npm install
npm start
```
Access at: http://localhost:3000

---

## Production Deployment

### Option 1: Deploy to Free Cloud Services

#### **Render.com** (Recommended - Free Tier Available)
1. Create account at https://render.com
2. Connect GitHub repository
3. Create new Web Service
4. Set environment variables in Render dashboard:
   - PORT=3000
   - JWT_SECRET=(generate using: openssl rand -hex 32)
   - NODE_ENV=production
5. Deploy automatically
6. Access at: `https://your-app-name.onrender.com`

#### **Railway.app** (Free Tier)
1. Go to https://railway.app
2. Connect GitHub repository
3. Add environment variables
4. Deploy automatically
5. Access at: `https://your-railway-app.up.railway.app`

#### **Heroku** (Paid but popular)
```bash
npm install -g heroku
heroku login
heroku create mcdo-sanfrancisco
git push heroku main
```

---

### Option 2: Deploy on Your Own Server (VPS)

#### Using DigitalOcean, AWS, Azure, or Linode:

1. **Create a droplet/instance with Node.js**
   - Ubuntu 20.04 LTS or later
   - 2GB RAM minimum
   - 20GB storage

2. **SSH into your server**
   ```bash
   ssh root@your_server_ip
   ```

3. **Install Node.js & npm**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   node --version
   ```

4. **Clone or upload project**
   ```bash
   cd /var/www
   git clone https://your-repo-url.git mcdo-website
   cd mcdo-website
   npm install
   ```

5. **Create .env file with production settings**
   ```bash
   nano .env
   ```
   Add your production values

6. **Install PM2 (Process Manager)**
   ```bash
   sudo npm install -g pm2
   pm2 start server.js --name "mcdo-server"
   pm2 startup
   pm2 save
   ```

7. **Install Nginx (Reverse Proxy)**
   ```bash
   sudo apt-get install nginx
   ```

8. **Configure Nginx**
   ```bash
   sudo nano /etc/nginx/sites-available/default
   ```
   Add:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com www.your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

9. **Enable SSL with Let's Encrypt**
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

10. **Restart Nginx**
    ```bash
    sudo systemctl restart nginx
    ```

11. **Access your site**
    - Go to: `https://your-domain.com`

---

### Option 3: Docker Deployment

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. **Build and run**
   ```bash
   docker build -t mcdo-website .
   docker run -p 3000:3000 -e JWT_SECRET=your_secret mcdo-website
   ```

---

## Security Checklist

✅ Update JWT_SECRET with strong random value
✅ Set NODE_ENV=production
✅ Enable HTTPS/SSL certificate
✅ Set up firewall rules
✅ Regular database backups
✅ Update dependencies: `npm audit fix`
✅ Monitor server logs
✅ Set up rate limiting
✅ Enable CORS only for trusted domains

---

## Database Backup Strategy

### Automated Daily Backups
Create `backup.sh`:
```bash
#!/bin/bash
BACKUP_DIR="/backups/mcdo-website"
mkdir -p $BACKUP_DIR
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
cp /var/www/mcdo-website/mcdo_db.sqlite $BACKUP_DIR/mcdo_db_$TIMESTAMP.sqlite
# Keep only last 30 days
find $BACKUP_DIR -name "*.sqlite" -mtime +30 -delete
```

Schedule with cron:
```bash
crontab -e
# Add: 0 2 * * * /home/user/backup.sh
```

---

## Access Information

### Public URLs
- **Production URL**: https://your-domain.com
- **Admin Login**: https://your-domain.com/login.html
- **Admin Dashboard**: https://your-domain.com/admin.html

### Admin Credentials
- **Username**: mcdoadmin
- **Password**: macdo2026

**⚠️ IMPORTANT**: Change these credentials after first login!

---

## Monitoring & Maintenance

### Check Server Status
```bash
pm2 status
pm2 logs
```

### Update Dependencies
```bash
npm update
npm audit
npm audit fix
```

### Restart Server
```bash
pm2 restart mcdo-server
```

---

## Troubleshooting

**Problem**: Port already in use
```bash
lsof -i :3000
kill -9 <PID>
```

**Problem**: Database locked
- Stop server and restart

**Problem**: High memory usage
- Check logs: `pm2 logs`
- Restart: `pm2 restart mcdo-server`

---

## Support

For issues, check:
- Server logs: `pm2 logs`
- Browser console: F12
- Network tab for API errors
- System resources: `top` or `htop`
