# 🚀 Quick Deploy to Public URL

## Easiest Option: Render.com (Free & Easy)

### Step 1: Prepare Your Code
```bash
# Make sure all files are ready
cd c:\Users\admin\Desktop\mcdo-website
npm install
```

### Step 2: Create GitHub Repository
1. Go to https://github.com/new
2. Create repository "mcdo-website"
3. Push your code:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/mcdo-website.git
git push -u origin main
```

### Step 3: Deploy to Render.com
1. Go to https://render.com
2. Sign up (free)
3. Click "New +"
4. Select "Web Service"
5. Connect GitHub
6. Select your "mcdo-website" repository
7. Fill in settings:
   - **Name**: mcdo-sanfrancisco
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

8. Click "Add Environment Variable":
   - **PORT**: 3000
   - **JWT_SECRET**: (generate: use any random string)
   - **NODE_ENV**: production

9. Click "Deploy"
10. Wait 2-3 minutes
11. Your URL: `https://mcdo-sanfrancisco.onrender.com`

---

## Alternative: Railway.app (Very Simple)

### Step 1: Connect GitHub
1. Go to https://railway.app
2. Sign in with GitHub
3. Click "Create New Project"
4. Select "Deploy from GitHub repo"
5. Choose your "mcdo-website" repository

### Step 2: Add Environment Variables
1. Go to "Variables"
2. Add:
   - PORT: 3000
   - JWT_SECRET: (any random string)
   - NODE_ENV: production

### Step 3: Deploy
- Automatically deploys from GitHub
- Your URL appears in the dashboard

---

## Access Your Live System

After deployment, you'll have a URL like:
- **Production**: `https://mcdo-sanfrancisco.onrender.com`
- **Admin Login**: `https://mcdo-sanfrancisco.onrender.com/login.html`
- **Public Site**: `https://mcdo-sanfrancisco.onrender.com`

### Login Credentials
```
Username: mcdoadmin
Password: macdo2026
```

### Share with Others
Just give them this link:
```
https://mcdo-sanfrancisco.onrender.com
```

---

## Custom Domain (Optional)

### Add Your Own Domain
1. On Render/Railway dashboard
2. Go to Settings
3. Add Custom Domain
4. Update DNS records at your domain registrar
5. Point to their servers
6. Now accessible at: `https://your-domain.com`

---

## Keep Deployment Updated

### Auto-Deploy on Code Changes
GitHub automatic deployments are already enabled!

Just push changes:
```bash
git add .
git commit -m "Updated features"
git push
```

Render/Railway will automatically redeploy.

---

## Database Backups on Free Tier

Since free tier may have limitations, download regular backups:

```bash
# Download mcdo_db.sqlite locally
# Then upload it somewhere safe
```

---

## Troubleshooting

**Problem**: Deployment failed
- Check "Logs" in Render/Railway dashboard
- Ensure `.env` variables are set
- Make sure `package.json` has "start" script

**Problem**: Can't access the site
- Wait 5-10 minutes for first deployment
- Check if URL is correct in dashboard
- Try different browser

**Problem**: Database not persisting
- Free tier may reset periodically
- Set up backups: download `mcdo_db.sqlite` regularly

---

## Access Your Data

### View Database
```bash
# Download mcdo_db.sqlite from your server
# Open with SQLite viewer
```

### View Logs
- Render: Dashboard → Logs
- Railway: Dashboard → Logs

### Restart Server
- Render: Dashboard → Manual Deploy
- Railway: Dashboard → Restart

---

## Cost

- **Render Free**: $0 (may sleep after 15 min inactivity)
- **Render Paid**: $7/month (always on)
- **Railway Free**: $5 credit/month
- **Railway Paid**: Pay as you go

---

## Production Checklist

Before sharing with many people:

- [ ] Change admin password
  - Edit login credentials in server.js
  - Redeploy
  
- [ ] Set strong JWT_SECRET
  
- [ ] Enable auto-backup of database

- [ ] Set up monitoring

- [ ] Test all features work on live site

- [ ] Document system for users

---

## Your Public URLs

Fill in once deployed:

```
🌐 Public Website: https://mcdo-sanfrancisco.onrender.com
📝 Admin Login: https://mcdo-sanfrancisco.onrender.com/login.html
👥 Cooperatives: https://mcdo-sanfrancisco.onrender.com/cooperatives.html
📢 Announcements: https://mcdo-sanfrancisco.onrender.com/announcements.html
ℹ️ About: https://mcdo-sanfrancisco.onrender.com/about.html
```

---

## Next Steps

1. ✅ Deploy to Render/Railway
2. ✅ Test all features
3. ✅ Share URL with team
4. ✅ Monitor performance
5. ✅ Regular backups
6. ✅ Update features as needed
