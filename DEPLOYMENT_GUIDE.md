# 🚀 KortexFlow Deployment Guide

## ✅ Local Development Running

Your application is currently running at:
- **Local**: http://localhost:3000
- **Network**: http://192.168.29.158:3000

---

## 🌐 Deploy to Vercel (Recommended)

### Prerequisites
- ✅ GitHub account
- ✅ Vercel account (free tier works)
- ✅ Supabase project configured

### Option 1: Deploy via Vercel Dashboard (Easiest)

1. **Push to GitHub** (if not already done):
   ```powershell
   git init
   git add .
   git commit -m "Initial commit - KortexFlow app with email verification"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy to Vercel**:
   - Go to https://vercel.com/new
   - Click "Import Git Repository"
   - Select your KortexFlow repository
   - Vercel will auto-detect Next.js settings ✅

3. **Add Environment Variables** in Vercel:
   - Go to Project Settings → Environment Variables
   - Add the following:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://gdcxmafjxxixofgkhjgu.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkY3htYWZqeHhpeG9mZ2toamd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzMDg4NzksImV4cCI6MjA3Njg4NDg3OX0.BQCvwhlC7t-5vY-mTXHHoFaMDKu5mcC7_vZgptp5FZI
   NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
   NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
   ```
   
   **Note**: Replace `https://your-app.vercel.app` with your actual Vercel domain after first deployment.

4. **Click "Deploy"** 🚀

5. **Update Supabase After First Deploy**:
   - Get your Vercel URL (e.g., `https://kortex-flow-xyz.vercel.app`)
   - Go to Supabase Dashboard → Auth → URL Configuration
   - Update Site URL: `https://kortex-flow-xyz.vercel.app`
   - Add Redirect URLs:
     - `https://kortex-flow-xyz.vercel.app/auth/callback`
     - `https://kortex-flow-xyz.vercel.app/dashboard`
     - `https://kortex-flow-xyz.vercel.app/api/gmail/callback`
     - `https://kortex-flow-xyz.vercel.app/api/calendar/callback`

---

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```powershell
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```powershell
   vercel login
   ```

3. **Deploy**:
   ```powershell
   Set-Location -LiteralPath 'c:\Users\prems\OneDrive\Documents\Kortex-Flow-main[1]\Kortex-Flow-main'
   vercel
   ```

4. **Follow the prompts**:
   - Set up and deploy? Yes
   - Which scope? Select your account
   - Link to existing project? No
   - Project name? kortex-flow (or your choice)
   - Directory? ./ (current directory)
   - Override settings? No

5. **Add environment variables**:
   ```powershell
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   vercel env add NEXT_PUBLIC_SITE_URL
   ```

6. **Deploy to production**:
   ```powershell
   vercel --prod
   ```

---

## 📦 Build Locally (Test Before Deploy)

To test the production build locally:

```powershell
# Navigate to project
Set-Location -LiteralPath 'c:\Users\prems\OneDrive\Documents\Kortex-Flow-main[1]\Kortex-Flow-main'

# Build the project
pnpm build

# Start production server
pnpm start
```

The production build will be available at http://localhost:3000

---

## 🔐 Post-Deployment Checklist

### 1. Update Supabase Settings
- [ ] Update Site URL in Supabase Auth settings
- [ ] Add all production redirect URLs
- [ ] Update email templates to use production URL
- [ ] Test email verification in production

### 2. Configure OAuth (for Gmail & Calendar)
- [ ] Update Google OAuth redirect URIs in Google Cloud Console
- [ ] Add production URLs to authorized redirect URIs
- [ ] Update environment variables with OAuth credentials

### 3. Database Setup
Run these SQL scripts in Supabase SQL Editor:
- [ ] `scripts/001_create_schema.sql` (creates tables and RLS policies)
- [ ] `scripts/002_add_gmail_tokens.sql` (if exists)
- [ ] `scripts/003_add_calendar_tokens.sql` (if exists)

### 4. Test Production Features
- [ ] User signup with email verification
- [ ] User login
- [ ] Password reset
- [ ] Gmail connection (if configured)
- [ ] Calendar sync (if configured)
- [ ] Dashboard access
- [ ] Task creation and management

---

## 🎯 Environment Variables Reference

### Required for All Environments:
```env
NEXT_PUBLIC_SUPABASE_URL=https://gdcxmafjxxixofgkhjgu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_SITE_URL=your_site_url_here
NEXT_PUBLIC_BASE_URL=your_site_url_here
```

### Optional (for OAuth features):
```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

---

## 🐛 Troubleshooting Deployment

### Build Fails
- Check all environment variables are set correctly
- Review build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`

### Email Verification Not Working
- Verify Supabase Site URL matches your deployment URL
- Check redirect URLs include `/auth/callback`
- Review email template configuration

### 404 on Routes
- Ensure all files are committed to Git
- Check `middleware.ts` configuration
- Verify route files exist in correct locations

---

## 📊 Monitoring & Analytics

Your app includes Vercel Analytics. After deployment:
1. Go to Vercel Dashboard → Your Project → Analytics
2. View real-time traffic and performance metrics
3. Monitor API routes and page load times

---

## 🔄 Continuous Deployment

Once connected to GitHub, Vercel will automatically:
- ✅ Deploy every push to `main` branch
- ✅ Create preview deployments for pull requests
- ✅ Run build checks before deploying
- ✅ Provide deployment previews with unique URLs

---

## 📝 Quick Deploy Commands

```powershell
# Navigate to project
Set-Location -LiteralPath 'c:\Users\prems\OneDrive\Documents\Kortex-Flow-main[1]\Kortex-Flow-main'

# Run development server
pnpm dev

# Build for production
pnpm build

# Test production build locally
pnpm start

# Deploy to Vercel (using CLI)
vercel --prod
```

---

## 🎉 Your App is Ready!

Current status:
- ✅ Development server running
- ✅ Email verification fixed
- ✅ Supabase configured
- ✅ All dependencies installed
- ✅ Ready for deployment

Next steps:
1. Test all features locally at http://localhost:3000
2. Push to GitHub if you haven't already
3. Deploy to Vercel
4. Update Supabase with production URLs
5. Test email verification in production

---

## 📚 Additional Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Supabase Auth**: https://supabase.com/docs/guides/auth
- **Your Supabase Dashboard**: https://supabase.com/dashboard/project/gdcxmafjxxixofgkhjgu

---

## 💡 Tips for Production

1. **Security**: Never commit `.env.local` to Git (already in `.gitignore`)
2. **Performance**: Vercel automatically optimizes your Next.js app
3. **Scaling**: Vercel handles auto-scaling based on traffic
4. **Custom Domain**: You can add a custom domain in Vercel settings
5. **SSL**: Vercel provides free SSL certificates automatically

---

Need help? Check Vercel's support or Supabase documentation! 🚀
