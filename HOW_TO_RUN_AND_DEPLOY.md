# 🚀 How to Run and Deploy KortexFlow

## 📋 Prerequisites Checklist

Before starting, make sure you have:
- ✅ Node.js installed (v18 or higher)
- ✅ pnpm installed (`npm install -g pnpm`)
- ✅ Git installed
- ✅ Supabase account (for database)
- ✅ Code editor (VS Code recommended)

---

## 🏃 PART 1: Running Locally (Development)

### Step 1: Open Terminal/Command Prompt

**Windows:**
- Press `Win + R`
- Type `cmd` or `powershell`
- Press Enter

**Mac/Linux:**
- Press `Cmd + Space` (Mac) or `Ctrl + Alt + T` (Linux)
- Type "Terminal"
- Press Enter

### Step 2: Navigate to Project Directory

```powershell
# Replace with your actual path
cd "C:\Users\prems\OneDrive\Documents\Kortex-Flow-main[1]\Kortex-Flow-main"
```

### Step 3: Install Dependencies

```powershell
pnpm install
```

**Expected Output:**
```
Packages: +370
Progress: resolved 370, reused 370, downloaded 0, added 370, done
```

**Wait time:** 30-60 seconds

### Step 4: Configure Environment Variables

1. **Open the `.env.local` file** in your project root
2. **Verify these values are set:**

```env
# Supabase (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://gdcxmafjxxixofgkhjgu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Site URLs
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Algorand (Optional)
NEXT_PUBLIC_ALGORAND_NETWORK=testnet
```

3. **Save the file**

### Step 5: Start Development Server

```powershell
pnpm dev
```

**Expected Output:**
```
▲ Next.js 16.0.0 (Turbopack)
- Local:        http://localhost:3000
- Network:      http://192.168.x.x:3000

✓ Ready in 2.5s
```

### Step 6: Open in Browser

**Option 1 - Automatic:**
The server should be running. Open your browser and go to:
```
http://localhost:3000
```

**Option 2 - From Terminal:**
```powershell
# Windows
start http://localhost:3000

# Mac
open http://localhost:3000

# Linux
xdg-open http://localhost:3000
```

### Step 7: Verify It's Working

You should see:
- ✅ Green cyberpunk-themed login page
- ✅ "KORTEXFLOW_LOGIN" title
- ✅ No error messages

---

## 🔧 Troubleshooting Local Run

### Problem: "Port 3000 is already in use"

**Solution:**
```powershell
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# Or use a different port
pnpm dev -- -p 3001
```

### Problem: "Module not found" errors

**Solution:**
```powershell
# Clean install
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

### Problem: Browser shows "Cannot connect" or "ERR_CONNECTION_REFUSED"

**Solution:**
1. Check if the terminal shows "✓ Ready"
2. Wait 5-10 seconds after "Ready" appears
3. Refresh the browser (F5)
4. Check firewall isn't blocking port 3000

### Problem: Blank page or loading forever

**Solution:**
```powershell
# Stop the server (Ctrl+C)
# Clear Next.js cache
rm -rf .next
# Restart
pnpm dev
```

---

## 🌐 PART 2: Deploying to Production (Vercel)

### Method A: Deploy via Vercel Dashboard (Easiest)

#### Step 1: Push Code to GitHub

```powershell
# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - KortexFlow with AlgoKit"

# Create repository on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push
git branch -M main
git push -u origin main
```

#### Step 2: Connect to Vercel

1. Go to https://vercel.com
2. Click "Sign Up" or "Log In"
3. Click "Import Project"
4. Select "Import Git Repository"
5. Choose your GitHub repository
6. Click "Import"

#### Step 3: Configure Environment Variables

In Vercel dashboard:
1. Go to "Settings" → "Environment Variables"
2. Add each variable:

```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://gdcxmafjxxixofgkhjgu.supabase.co

Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Name: NEXT_PUBLIC_SITE_URL
Value: https://your-app.vercel.app (update after first deploy)

Name: NEXT_PUBLIC_BASE_URL
Value: https://your-app.vercel.app (update after first deploy)

Name: NEXT_PUBLIC_ALGORAND_NETWORK
Value: testnet
```

3. Click "Save" for each

#### Step 4: Deploy

1. Click "Deploy"
2. Wait 2-3 minutes for build
3. You'll get a URL like: `https://kortex-flow-xyz.vercel.app`

#### Step 5: Update Environment Variables with Production URL

1. Go back to "Settings" → "Environment Variables"
2. Update:
   - `NEXT_PUBLIC_SITE_URL` → your Vercel URL
   - `NEXT_PUBLIC_BASE_URL` → your Vercel URL
3. Click "Redeploy" to apply changes

#### Step 6: Configure Supabase for Production

1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to "Settings" → "Auth" → "URL Configuration"
4. Set **Site URL**: `https://your-app.vercel.app`
5. Add **Redirect URLs**:
   ```
   https://your-app.vercel.app/auth/callback
   https://your-app.vercel.app/dashboard
   https://your-app.vercel.app/api/gmail/callback
   https://your-app.vercel.app/api/calendar/callback
   ```
6. Click "Save"

---

### Method B: Deploy via Vercel CLI

#### Step 1: Install Vercel CLI

```powershell
npm install -g vercel
```

#### Step 2: Login to Vercel

```powershell
vercel login
```

Follow the prompts to authenticate.

#### Step 3: Deploy

```powershell
# Navigate to project
cd "C:\Users\prems\OneDrive\Documents\Kortex-Flow-main[1]\Kortex-Flow-main"

# Deploy to production
vercel --prod
```

#### Step 4: Add Environment Variables via CLI

```powershell
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Paste your value when prompted

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Paste your value when prompted

# Repeat for all environment variables
```

#### Step 5: Redeploy

```powershell
vercel --prod
```

---

## 📊 PART 3: Database Setup (Supabase)

### Step 1: Run Database Scripts

1. Go to https://supabase.com/dashboard/project/gdcxmafjxxixofgkhjgu/editor
2. Click "SQL Editor"
3. Copy and paste from `scripts/001_create_schema.sql`
4. Click "Run"
5. Repeat for other scripts if they exist

### Step 2: Enable Email Authentication

1. Go to "Authentication" → "Providers"
2. Enable "Email" provider
3. Enable "Confirm email"
4. Click "Save"

### Step 3: Configure Email Templates

1. Go to "Authentication" → "Email Templates"
2. Select "Confirm signup"
3. Update the confirmation URL to:
   ```
   {{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=email
   ```
4. Click "Save"

---

## ✅ PART 4: Testing Your Deployment

### Test Checklist:

1. **Homepage**
   - [ ] Loads without errors
   - [ ] Redirects to login

2. **Sign Up**
   - [ ] Form submits successfully
   - [ ] Receives verification email
   - [ ] Email link works

3. **Login**
   - [ ] Can log in after verification
   - [ ] Redirects to dashboard

4. **Dashboard**
   - [ ] All cards visible
   - [ ] No console errors
   - [ ] Algorand card present

5. **Algorand Page**
   - [ ] Page loads
   - [ ] Wallet connection works (with Pera/Defly installed)

---

## 📝 Quick Command Reference

### Development Commands

```powershell
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# Start production server locally
pnpm start

# Run linter
pnpm lint
```

### Useful URLs

```
Local Development:     http://localhost:3000
Dashboard:            http://localhost:3000/dashboard
Algorand:             http://localhost:3000/algorand
Supabase Dashboard:   https://supabase.com/dashboard/project/gdcxmafjxxixofgkhjgu
Vercel Dashboard:     https://vercel.com/dashboard
```

### Port Management (Windows)

```powershell
# Find what's using port 3000
netstat -ano | findstr :3000

# Kill process by PID
taskkill /PID <PID_NUMBER> /F
```

---

## 🎯 Common Issues & Solutions

### Issue: "EADDRINUSE: address already in use"
**Solution:** Another process is using port 3000
```powershell
taskkill /F /IM node.exe
pnpm dev
```

### Issue: Build fails on Vercel
**Solution:** Check environment variables are set correctly in Vercel dashboard

### Issue: Email verification not working
**Solution:** 
1. Check Supabase Auth settings
2. Verify Site URL matches your domain
3. Check spam folder for emails

### Issue: Algorand page shows 404
**Solution:** Make sure you're logged in first - the page requires authentication

### Issue: "Module not found" after deployment
**Solution:** Make sure all dependencies are in `package.json`, not `devDependencies`

---

## 🚀 Success Indicators

### Development (Local):
✅ Terminal shows: `✓ Ready in X.Xs`
✅ Browser loads: Login page with green theme
✅ No errors in browser console (F12)

### Production (Vercel):
✅ Build completes: "Build Completed"
✅ Site loads: No 404 or 500 errors
✅ Can sign up and login
✅ All features work

---

## 📚 Additional Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **AlgoKit Docs**: https://developer.algorand.org/docs/get-started/algokit/
- **Pera Wallet**: https://perawallet.app
- **TestNet Dispenser**: https://bank.testnet.algorand.network

---

## 💡 Pro Tips

1. **Always test locally first** before deploying
2. **Use environment variables** for all secrets (never commit them)
3. **Check browser console** (F12) for errors
4. **Monitor Vercel logs** for deployment issues
5. **Keep `.env.local` backed up** securely
6. **Use Git branches** for new features
7. **Test email verification** in production after deployment

---

## 🎊 You're Ready!

Your KortexFlow application is now:
- ✅ Running locally for development
- ✅ Configured for production deployment
- ✅ Integrated with Supabase
- ✅ Ready for Algorand blockchain features
- ✅ Set up with authentication
- ✅ Deployable to Vercel

**Need help?** Check the troubleshooting section or the additional documentation files in your project!

Happy coding! 🚀
