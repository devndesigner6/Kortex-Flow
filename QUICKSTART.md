# 🚀 Kortex Flow - Quick Start Guide

## ✅ What's Done

1. ✅ **Dependencies installed** - All npm packages including:
   - `@perawallet/connect` - Pera Wallet integration
   - `@blockshake/defly-connect` - Defly Wallet integration
   - `@algorandfoundation/algokit-utils` - Algorand utilities
   - `ipfs-http-client` - IPFS integration
   - `algosdk` - Algorand SDK

2. ✅ **Smart Contracts folder** - Complete Algorand integration:
   - Wallet connection (Pera + Defly)
   - Task tokenization (ARC-3 ASAs)
   - IPFS metadata storage
   - Identity binding (email ↔ wallet)
   - Indexer queries

3. ✅ **Environment template** - `.env.local` created with placeholders

4. ✅ **Dev server running** - Available at: http://localhost:3001

## ⚠️ Required: Add Your Credentials

The server is running but needs your Supabase credentials to work properly.

### Step 1: Get Supabase Credentials

1. Go to: https://supabase.com/dashboard
2. Create a new project (or use existing)
3. Go to: **Settings → API**
4. Copy these values:

```
Project URL: https://xxxxx.supabase.co
Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx...
```

### Step 2: Update `.env.local`

Open: `.env.local` and replace:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

### Step 3: Generate Email Hash Salt

Run this command to generate a secure random salt:

**PowerShell:**
```powershell
[System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

Copy the output and update `.env.local`:
```env
EMAIL_HASH_SALT=your-generated-salt-here
```

### Step 4: Restart Dev Server

After updating `.env.local`:
```bash
# Press Ctrl+C in terminal, then run:
pnpm dev
```

## 🎯 Quick Test (Once Configured)

### 1. View Main Dashboard
```
http://localhost:3001/dashboard
```

### 2. Connect Pera Wallet
```
http://localhost:3001/blockchain
```

- Click "Connect Pera Wallet"
- Approve in Pera Wallet mobile app or browser extension
- See your wallet address and ALGO balance

### 3. Test Smart Contract Features

The app includes:
- ✅ Wallet connection (Pera + Defly)
- ✅ Task tokenization (convert emails/events to NFTs)
- ✅ IPFS metadata storage
- ✅ Privacy-preserving identity (email hashing)
- ✅ Blockchain queries (indexer)

## 📂 Smart Contracts Overview

```
Smart_Contracts/algorand/
├── wallet-context.tsx     → React context for wallet connection
├── client.ts              → Algorand client setup (TestNet)
├── task-tokenizer.ts      → Convert tasks to ARC-3 ASAs
├── ipfs.ts                → Upload/download metadata
├── identity.ts            → Email ↔ wallet mapping
└── indexer-service.ts     → Query blockchain for tasks
```

## 🔧 Optional Configurations

### Google OAuth (Gmail/Calendar)
1. Go to: https://console.cloud.google.com/apis/credentials
2. Create OAuth 2.0 Client ID
3. Add redirect URIs:
   - `http://localhost:3001/api/gmail/callback`
   - `http://localhost:3001/api/calendar/callback`
4. Update `.env.local`:
   ```env
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   ```

### IPFS (Infura)
1. Go to: https://infura.io/product/ipfs
2. Create project
3. Update `.env.local`:
   ```env
   IPFS_PROVIDER=infura
   INFURA_PROJECT_ID=your-project-id
   INFURA_API_SECRET=your-secret
   ```

### AI Task Extraction (Groq)
1. Go to: https://console.groq.com/keys
2. Create API key
3. Update `.env.local`:
   ```env
   GROQ_API_KEY=your-groq-key
   ```

## 📖 Full Documentation

See `Smart_Contracts/SETUP.md` for detailed setup instructions and examples.

## ✨ Features Ready to Use

### 1. Blockchain Dashboard
- Connect Pera or Defly wallet
- View ALGO balance
- See smart contract status
- Track transactions

### 2. Task Tokenization
- Convert emails to ARC-3 NFTs
- Store metadata on IPFS
- Transfer tasks as assets
- Query tasks via indexer

### 3. Identity Privacy
- Hash emails (never store raw emails on-chain)
- Link email hash ↔ wallet address
- Sign-in with Algorand flow

### 4. Gmail/Calendar Integration
- OAuth authentication
- Sync emails and events
- AI-powered task extraction
- Automatic blockchain updates

## 🐛 Troubleshooting

### "Invalid supabaseUrl"
→ Update `.env.local` with your actual Supabase credentials

### "Cannot find module"
→ Run `pnpm install` (already done ✅)

### Wallet won't connect
→ Make sure Pera Wallet is on TestNet
→ Get free TestNet ALGO: https://bank.testnet.algorand.network/

### IPFS errors
→ App will fallback to public gateways (slower but works)
→ Or configure Infura IPFS for better performance

## 🎉 You're Almost There!

**Just 3 steps:**
1. Add Supabase credentials to `.env.local`
2. Generate and add EMAIL_HASH_SALT
3. Restart: `pnpm dev`

Then visit: http://localhost:3001/blockchain to connect your wallet! 🚀
