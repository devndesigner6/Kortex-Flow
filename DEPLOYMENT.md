# Kortex Flow - Deployment Guide

## 🚀 Local Development (Running Now!)

Your app is currently running at:
- **Local**: http://localhost:3000
- **Network**: http://192.168.29.158:3000

### Environment Setup Required

Before full functionality, configure your `.env.local` file with:

1. **Supabase** (Database & Auth)
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon/public key
   - Get these from: https://supabase.com/dashboard

2. **Google OAuth** (Gmail & Calendar Integration)
   - `GOOGLE_CLIENT_ID` - From Google Cloud Console
   - `GOOGLE_CLIENT_SECRET` - From Google Cloud Console
   - Setup: https://console.cloud.google.com/apis/credentials

3. **Groq AI** (AI Features)
   - `GROQ_API_KEY` - For AI task extraction and reply generation
   - Get API key: https://console.groq.com/keys

### Database Setup

Run the SQL scripts in your Supabase dashboard:
```bash
scripts/001_create_schema.sql
scripts/002_add_gmail_tokens.sql (or 002_add_oauth_tokens.sql)
scripts/003_add_calendar_tokens.sql
```

---

## 🌐 Deploy to Vercel (Recommended)

### Option 1: Deploy via Vercel Dashboard (Easiest)

1. **Push to GitHub** (if not already)
   ```powershell
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/kortex-flow.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**
   In Vercel project settings → Environment Variables, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GROQ_API_KEY`

4. **Deploy**
   - Click "Deploy"
   - Your app will be live at `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

```powershell
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts, then add environment variables:
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_SECRET
vercel env add GROQ_API_KEY

# Redeploy with environment variables
vercel --prod
```

### Update OAuth Redirect URIs

After deployment, update your Google OAuth settings:
- Authorized redirect URIs: 
  - `https://your-project.vercel.app/api/gmail/callback`
  - `https://your-project.vercel.app/api/calendar/callback`

---

## 🐳 Deploy with Docker

### Create Dockerfile

```dockerfile
FROM node:20-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# Production
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
```

### Build and Run

```powershell
# Build image
docker build -t kortex-flow .

# Run container
docker run -p 3000:3000 --env-file .env.local kortex-flow
```

---

## ☁️ Deploy to Other Platforms

### Netlify

```powershell
# Install Netlify CLI
npm i -g netlify-cli

# Build
pnpm build

# Deploy
netlify deploy --prod
```

### Railway

1. Visit https://railway.app
2. "New Project" → "Deploy from GitHub"
3. Select your repository
4. Add environment variables
5. Railway auto-deploys

### AWS Amplify

1. Go to AWS Amplify Console
2. "New App" → "Host web app"
3. Connect GitHub repository
4. Build settings auto-detected
5. Add environment variables
6. Deploy

---

## 🔧 Production Build (Self-Hosted)

```powershell
# Build for production
pnpm build

# Start production server
pnpm start
```

The app will run on http://localhost:3000

---

## 📋 Pre-Deployment Checklist

- [ ] Environment variables configured
- [ ] Supabase database setup complete
- [ ] Google OAuth credentials created
- [ ] OAuth redirect URIs updated
- [ ] Groq API key obtained
- [ ] Database migrations run
- [ ] Test all features locally
- [ ] Update site URL in Supabase settings

---

## 🛠️ Troubleshooting

### Build Warnings
- TypeScript version warning: Consider upgrading to v5.1.0+
  ```powershell
  pnpm add -D typescript@latest
  ```

- ESLint config warning: Remove `eslint` key from `next.config.mjs`

### Environment Issues
- Missing variables will cause features to fail silently
- Check browser console for errors
- Verify Supabase connection in Network tab

### OAuth Issues
- Ensure redirect URIs match exactly (including http/https)
- Check Google Cloud Console for enabled APIs
- Verify scopes in OAuth consent screen

---

## 📊 Your Current Deployment Status

According to your README, the project is already deployed:
- **Live URL**: https://vercel.com/peddadahemanth6-gmailcoms-projects/v0-decentralized-kortex-flow-app
- **v0 Project**: https://v0.app/chat/projects/7t7MtVzDZRK

This deployment auto-syncs with v0.app changes.

---

## 🔗 Useful Links

- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Vercel Docs**: https://vercel.com/docs
- **Supabase Setup**: https://supabase.com/docs/guides/getting-started
- **Google OAuth**: https://developers.google.com/identity/protocols/oauth2
- **Groq API**: https://console.groq.com/docs
