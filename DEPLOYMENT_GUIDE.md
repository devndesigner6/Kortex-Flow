# 🚀 Kortex Flow - Deployment Guide

## ✅ Local Development (Currently Running)

Your application is running at:
- **Local**: http://localhost:3000
- **Network**: http://192.168.29.158:3000

### Available Pages:
- `/` - Landing page
- `/dashboard` - Main dashboard
- `/blockchain` - Blockchain dashboard
- `/algorand` - Algorand tools (Terminal UI)
- `/tasks` - Task management
- `/ai-tasks` - AI task extraction
- `/ai-replies` - AI email replies

---

## 🌐 Deploy to Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications.

### Step 1: Prepare for Deployment

1. **Create a GitHub repository** (if not already done):
```powershell
git init
git add .
git commit -m "Initial commit - Kortex Flow with Algorand integration"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/kortex-flow.git
git push -u origin main
```

2. **Ensure environment variables are ready**:
Create a `.env.production` file or note down these values:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://gdcxmafjxxixofgkhjgu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkY3htYWZqeHhpeG9mZ2toamd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5MzE0MzEsImV4cCI6MjA2MzUwNzQzMX0.oHn4d40VGKjTy9U8LWw1RKxc5TQrV-xWjxJ8eZcSBBs

# Algorand
NEXT_PUBLIC_ALGORAND_NETWORK=testnet
EMAIL_HASH_SALT=your-production-salt-here

# Google OAuth (if configured)
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=https://your-domain.vercel.app/api/gmail/callback

# OpenAI (if using AI features)
OPENAI_API_KEY=your-openai-key
```

### Step 2: Deploy to Vercel

#### Option A: Via Vercel Dashboard (Easiest)

1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `pnpm build`
   - **Output Directory**: `.next`
6. Add environment variables from above
7. Click "Deploy"

#### Option B: Via Vercel CLI

```powershell
# Install Vercel CLI
pnpm add -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: kortex-flow
# - Directory: ./
# - Override settings? No

# Production deployment
vercel --prod
```

### Step 3: Configure Domain (Optional)

1. In Vercel dashboard, go to Project Settings > Domains
2. Add your custom domain
3. Update DNS records as instructed

---

## 🐳 Deploy with Docker

### Create Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Install pnpm
RUN npm install -g pnpm

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

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
pnpm add -g netlify-cli

# Deploy
netlify deploy

# Production
netlify deploy --prod
```

**Build settings:**
- Build command: `pnpm build`
- Publish directory: `.next`

### Railway

1. Go to [railway.app](https://railway.app)
2. Create new project from GitHub repo
3. Add environment variables
4. Deploy automatically on push

### DigitalOcean App Platform

1. Connect GitHub repository
2. Configure:
   - Build command: `pnpm install && pnpm build`
   - Run command: `pnpm start`
3. Add environment variables
4. Deploy

---

## 📊 Database Setup (Supabase)

Before full deployment, run the database migrations:

### Step 1: Run SQL Migrations

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to SQL Editor
4. Run these scripts in order:

```sql
-- From scripts/001_create_schema.sql
-- Run the entire schema creation script

-- From scripts/004_algorand_task_tokenization.sql
-- Run the Algorand integration tables
```

### Step 2: Verify Tables

Check that these tables exist:
- `users`
- `tasks`
- `emails`
- `calendar_events`
- `address_mappings`
- `task_mappings`
- `task_events`

---

## 🔐 Security Checklist

Before deploying to production:

- [ ] Change `EMAIL_HASH_SALT` to a secure random value
- [ ] Verify all API keys are in environment variables (not hardcoded)
- [ ] Enable Row Level Security (RLS) on all Supabase tables
- [ ] Set up proper CORS policies
- [ ] Review and limit API rate limits
- [ ] Enable HTTPS only (automatic on Vercel)
- [ ] Set secure cookie policies
- [ ] Review wallet connection security

---

## 🧪 Pre-Deployment Testing

```powershell
# Build locally to check for errors
pnpm build

# Test production build
pnpm start

# Run type checking
pnpm run type-check

# Run linting (if configured)
pnpm run lint
```

---

## 📈 Post-Deployment

### Monitor Your Application

1. **Vercel Analytics** (if using Vercel)
   - Automatic performance monitoring
   - Real user metrics

2. **Supabase Monitoring**
   - Database performance
   - API usage
   - Authentication logs

3. **Wallet Integration Testing**
   - Test Pera Wallet connection
   - Test Defly Wallet connection
   - Verify blockchain transactions

### Update Environment for Production

For mainnet deployment:
```env
NEXT_PUBLIC_ALGORAND_NETWORK=mainnet
```

---

## 🔄 Continuous Deployment

### GitHub Actions (Vercel)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 🐛 Troubleshooting

### Build Errors

**Error: TypeScript version warning**
```powershell
pnpm add -D typescript@5.1.0
```

**Error: Module not found**
```powershell
rm -rf node_modules .next
pnpm install
pnpm build
```

### Runtime Errors

**Supabase connection issues**
- Verify environment variables are set
- Check Supabase project is active
- Verify API keys are correct

**Wallet connection fails**
- Ensure HTTPS is enabled (required for wallet connections)
- Check browser console for errors
- Verify Algorand network is accessible

---

## 📞 Support

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **Algorand Docs**: https://developer.algorand.org

---

## ✅ Deployment Status

- [x] Local development server running
- [x] Algorand integration complete
- [x] Terminal UI implemented
- [x] Wallet connections (Pera & Defly)
- [ ] Database migrations run
- [ ] GitHub repository created
- [ ] Deployed to Vercel
- [ ] Custom domain configured
- [ ] Production testing complete

**Next Step**: Push code to GitHub and deploy to Vercel!
