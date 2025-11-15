<div align="center">

# KortexFlow

**AI-Powered Workflow with Blockchain Accountability**

[Launch App](https://kortexflow.vercel.app/) • [TestNet Contracts](#blockchain-deployment) • [Support](mailto:kortexflowsync@gmail.com)

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Algorand](https://img.shields.io/badge/Algorand-TestNet-00D494?style=flat-square&logo=algorand)](https://developer.algorand.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Powered-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)

</div>

---

## Overview

KortexFlow transforms scattered emails and calendar events into organized, AI-extracted tasks—with every action recorded on the blockchain for accountability.

**The Problem:** Important emails get buried, deadlines slip through cracks, and there's no proof work happened.

**The Solution:** AI analyzes your Gmail and Calendar, extracts actionable tasks, and records every completion on Algorand's blockchain. Productivity you can prove.

---

## Key Features

| Feature | What It Does |
|---------|-------------|
| **Smart Email Analysis** | AI extracts deadlines and action items from Gmail automatically |
| **Calendar Intelligence** | Converts meetings into tasks with prep work and follow-ups |
| **Blockchain Verification** | Records task completions on Algorand for immutable proof |
| **Real-Time Sync** | Instant updates across all devices via Supabase |
| **Wallet Integration** | Pera & Defly wallet support for decentralized payments |

---

## Quick Start

Clone the repository:

git clone https://github.com/YOUR_USERNAME/kortexflow.git
cd kortexflow

Install dependencies:
pnpm install

Open .env.local and fill in:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_ALGORAND_NETWORK=testnet

Start the local server:
pnpm dev

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret

# Algorand
NEXT_PUBLIC_ALGORAND_NETWORK=testnet
\`\`\`

### 3. Run Development Server

\`\`\`bash
pnpm dev
\`\`\`

Visit [localhost:3000](http://localhost:3000)

---

## Blockchain Deployment

> **Network:** Algorand TestNet (free test tokens available)

### TestNet Contract Details

| Component | Value |
|-----------|-------|
| **Treasury Wallet** | `HZ57J3K46JIJXILONBBZOHXGBKPXEN2VIYPCISHKRQ2UKWQXDKWNFB3P` |
| **Network API** | `https://testnet-api.algorand.network` |
| **Explorer** | [testnet.algoexplorer.io](https://testnet.algoexplorer.io/) |
| **Transaction Fee** | 0.001 ALGO per AI task extraction |

### Contract Code Location

\`\`\`
lib/algorand/
├── config.ts              → Treasury address & network config
├── wallet-client.ts       → Pera/Defly integration
└── payment-handler.ts     → Transaction signing logic
\`\`\`

### Try It Out

1. Get free ALGO from [TestNet Dispenser](https://bank.testnet.algorand.network/)
2. Install [Pera Wallet](https://perawallet.app/) or [Defly Wallet](https://defly.app/)
3. Connect wallet on [KortexFlow Dashboard](https://kortexflow.vercel.app/dashboard)
4. Extract a task (costs 0.001 ALGO)
5. Verify transaction on [AlgoExplorer](https://testnet.algoexplorer.io/)

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 15** | React framework with server-side rendering |
| **TypeScript** | Type-safe development |
| **Supabase** | PostgreSQL database with real-time subscriptions |
| **Algorand** | Blockchain for verifiable task completion |
| **TailwindCSS** | Utility-first styling |
| **Pera/Defly** | Algorand wallet integration |

---
---

## Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/devndesigner6/Kortex-Flow)

Or manually:

\`\`\`bash
git push origin main
# Then import to Vercel and add environment variables
\`\`\`

> Update `NEXT_PUBLIC_APP_URL` to your Vercel domain

---

## Troubleshooting

<details>
<summary><strong>Wallet connection fails</strong></summary>

- Ensure wallet is set to TestNet
- Get test ALGO from [dispenser](https://bank.testnet.algorand.network/)
- Update wallet extension to latest version

</details>

<details>
<summary><strong>Email sync not working</strong></summary>

Check Supabase dashboard:
- Authentication → URL Configuration (add redirect URLs)
- Authentication → Providers (verify Google OAuth)

</details>

<details>
<summary><strong>Build fails on deployment</strong></summary>

- Verify all environment variables are set
- Check for typos (case-sensitive)
- Redeploy after adding missing variables

</details>

---

## Roadmap

- [ ] Token economy for task completion rewards
- [ ] Team workspaces with shared accountability
- [ ] Native mobile apps (iOS/Android)
- [ ] Public API for third-party integrations
- [ ] Advanced productivity analytics

---

## Resources

| Resource | Link |
|----------|------|
| **Live App** | [kortexflow.vercel.app](https://kortexflow.vercel.app/) |
| **GitHub** | [github.com/devndesigner6/Kortex-Flow](https://github.com/devndesigner6/Kortex-Flow) |
| **TestNet Faucet** | [bank.testnet.algorand.network](https://bank.testnet.algorand.network/) |
| **Block Explorer** | [testnet.algoexplorer.io](https://testnet.algoexplorer.io/) |
| **Support Email** | [kortexflowsync@gmail.com](mailto:kortexflowsync@gmail.com) |

---

## Support

Questions or issues? Email us at [kortexflowsync@gmail.com](mailto:kortexflowsync@gmail.com?subject=KortexFlow%20Support)

When reporting bugs, include:
- Browser version
- Steps to reproduce
- Screenshots
- TestNet wallet address (never share MainNet)

---

<div align="center">

### Productivity with Proof

Every task verified. Every deadline recorded. Every action on-chain.

**[Launch KortexFlow →](https://kortexflow.vercel.app/)**

</div>
