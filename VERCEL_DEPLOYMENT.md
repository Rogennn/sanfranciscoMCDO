# Vercel Deployment Guide - COMPLETE SETUP

## ✅ FILES CREATED FOR VERCEL DEPLOYMENT

The following files have been created/modified for Vercel deployment:

1. **vercel.json** - Vercel configuration
2. **api/index.js** - Express app for Vercel serverless functions
3. **lib/db.js** - PostgreSQL database connection
4. **routes/notes.js** - Notes API routes
5. **routes/about.js** - About content API routes
6. **routes/cooperatives.js** - Cooperatives API routes
7. **routes/announcements.js** - Announcements API routes
8. **.env.production** - Environment configuration (needs DATABASE_URL)

## 📋 WHAT YOU NEED TO DO (3 Steps)

### Step 1: Set Up PostgreSQL Database (5 minutes)

**Choose Supabase (FREE & EASIEST):**

1. Go to [supabase.com](https://supabase.com) and sign up (free)
2. Click "New Project"
3. Fill in:
   - Name: `mcdo-sanfrancisco`
   - Database Password: (create a strong password - SAVE THIS!)
   - Region: Choose closest to you
4. Wait for project to create (2-3 minutes)
5. Go to Settings → Database → Connection String
6. Copy the "URI" connection string
7. Replace the DATABASE_URL in `.env.production` with your actual connection string

**Initialize Database Tables:**

1. In Supabase dashboard, go to SQL Editor
2. Click "New Query"
3. Paste and run this SQL:

```sql
CREATE TABLE IF NOT EXISTS calendar_notes (
    note_date TEXT PRIMARY KEY,
    note_text TEXT NOT NULL,
    note_type TEXT DEFAULT 'general',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cooperatives (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT,
    status TEXT,
    members TEXT,
    businessActivity TEXT,
    products TEXT,
    numberMembers TEXT,
    dateEstablished DATE,
    businessAddress TEXT,
    contactNumber TEXT,
    email TEXT,
    trainingGeneral TEXT,
    boardRows TEXT,
    staffRows TEXT,
    committeeRows TEXT,
    createdBy TEXT
);

CREATE TABLE IF NOT EXISTS announcements (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    date DATE,
    content TEXT,
    image TEXT,
    status TEXT DEFAULT 'Active',
    createdBy TEXT
);

CREATE TABLE IF NOT EXISTS about_content (
    id INTEGER PRIMARY KEY,
    description TEXT,
    vision TEXT,
    mission TEXT
);

INSERT INTO about_content (id, description, vision, mission) 
VALUES (1, '', '', '') 
ON CONFLICT (id) DO NOTHING;
```

### Step 2: Deploy to Vercel (3 minutes)

**Method A: Using Vercel Dashboard (EASIEST)**

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "Add New Project"
3. Import your repository (or upload folder)
4. Configure:
   - Framework Preset: "Other"
   - Root Directory: `./`
   - Build Command: (leave empty)
   - Output Directory: (leave empty)
5. Add Environment Variables:
   - `DATABASE_URL`: Your Supabase connection string
   - `JWT_SECRET`: `mcdo_sanfrancisco_secure_key_2024_production`
   - `NODE_ENV`: `production`
6. Click "Deploy"

**Method B: Using Git (RECOMMENDED)**

1. Push your code to GitHub/GitLab/Bitbucket
2. Go to Vercel → Add New Project
3. Import your repository
4. Follow the same configuration steps above

### Step 3: Test Deployment (2 minutes)

1. Wait for Vercel deployment to complete
2. Visit your Vercel URL (e.g., `https://mcdo-sanfrancisco.vercel.app`)
3. Test admin panel: `https://your-domain.vercel.app/admin.html`
4. Try creating a cooperative or announcement
5. Refresh page to verify data persistence

## 🔧 TROUBLESHOOTING

### Database Connection Error
- Make sure your DATABASE_URL is correct
- Check Supabase project status (should be "Active")
- Verify SSL is enabled in connection string

### Build Error
- Check Vercel deployment logs
- Ensure all dependencies are in package.json
- Verify Node.js version (Vercel supports 14+)

### API Not Working
- Check that api/ directory exists
- Verify routes/ directory has all route files
- Check Vercel function logs

## 📊 PROJECT STRUCTURE FOR VERCEL

```
mcdo-website/
├── api/
│   └── index.js          # Main Express app
├── lib/
│   └── db.js             # PostgreSQL connection
├── routes/
│   ├── notes.js          # Notes API
│   ├── about.js          # About API
│   ├── cooperatives.js   # Cooperatives API
│   └── announcements.js  # Announcements API
├── vercel.json           # Vercel config
├── .env.production       # Environment variables
├── index.html            # Frontend files
├── admin.html            # Admin panel
└── ... (other static files)
```

## 🚀 QUICK START COMMANDS

If you want to test locally before deploying:

```bash
# Install dependencies
npm install

# Set DATABASE_URL environment variable
set DATABASE_URL=your_supabase_connection_string

# Test with Vercel CLI (if SSL issues are resolved)
vercel dev
```

## 📝 NOTES

- **PostgreSQL is required** for Vercel (SQLite doesn't work on serverless)
- **Supabase is free** and easy to set up
- **Data persists** in cloud database (not local files)
- **Original server.js** still works for local development with SQLite
- **All features** work the same, just database is different

## ⚡ DEPLOYMENT CHECKLIST

- [ ] Supabase account created
- [ ] Supabase project created
- [ ] Database tables initialized
- [ ] DATABASE_URL updated in .env.production
- [ ] Vercel account created
- [ ] Project deployed to Vercel
- [ ] Environment variables configured in Vercel
- [ ] Deployment tested successfully
- [ ] Admin panel working
- [ ] Data persistence verified
