# KortexFlow

**Where AI meets accountability**

Transform your digital chaos into verifiable workflows with blockchain transparency

[Launch App](https://kortexflow.vercel.app/) • [Explore Contracts](#smart-contracts-on-testnet) • [Get Support](mailto:kortexflowsync@gmail.com)

---

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Algorand](https://img.shields.io/badge/Algorand-TestNet-00D494?style=flat-square&logo=algorand)](https://developer.algorand.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Powered-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

</div>

---

## The Story Behind KortexFlow

We've all been there. Important emails buried under newsletters. Deadlines scattered across sticky notes and calendar alerts. Tasks that fall through the cracks because there's no single source of truth.

**The real problem?** It's not just about organization—it's about trust. When deadlines slip or tasks get forgotten, there's no accountability. No proof of what was supposed to happen.

KortexFlow changes that. We built an AI assistant that doesn't just organize your workflow—it records every action on the blockchain. Think of it as your digital notary, creating an immutable record of every task, deadline, and completed action.

This isn't another productivity app. This is productivity with proof.

---

## What Makes It Different

### The Core Experience

**Smart Email Analysis**
Connect your Gmail, and our AI immediately starts reading between the lines. It spots deadlines, extracts action items, and understands context. No manual entry. No tedious setup.

**Calendar Intelligence**  
Your meetings become actionable tasks automatically. Pre-meeting prep gets scheduled. Follow-ups get tracked. Everything flows naturally from your existing calendar.

**Blockchain Verification**  
Here's where it gets interesting. Every task completion, every deadline met—it's all recorded on Algorand's blockchain. Immutable proof that work happened. Perfect for accountability.

**Clean, Intuitive Interface**  
We kept it simple. Military green aesthetics, smooth animations, zero clutter. Just you and your priorities.

---

## Technical Foundation

We chose our stack carefully. Every decision was made with performance, security, and user experience in mind.

| Technology | Why We Chose It |
|------------|-----------------|
| **Next.js 15** | Server-side rendering for instant page loads, optimal SEO |
| **TypeScript** | Type safety means fewer bugs in production |
| **Supabase** | PostgreSQL with real-time subscriptions, zero DevOps hassle |
| **Algorand** | Fast transactions, low fees, environmental sustainability |
| **Vercel** | Edge functions for global low-latency access |

### Architecture Flow

\`\`\`mermaid
graph TD
    A[Your Browser] -->|OAuth Login| B[Next.js Frontend]
    B -->|Store Data| C[Supabase Database]
    B -->|Extract Tasks| D[AI Processing Engine]
    B -->|Record Completion| E[Algorand Blockchain]
    C -->|Real-time Sync| B
    E -->|Wallet Connection| F[Pera/Defly Wallet]
    
    style E fill:#00D494,stroke:#00B37D,color:#000
    style B fill:#000,stroke:#3ECF8E,color:#fff
    style C fill:#3ECF8E,stroke:#2DA87C,color:#000
\`\`\`

---

## Smart Contracts on TestNet

> **Important:** All blockchain operations run on Algorand TestNet. This means you can test everything with free test tokens before any real money gets involved.

### Where to Find the Code

The blockchain logic lives here in the repository:

\`\`\`
lib/algorand/
├── config.ts              → Network configuration & treasury address
├── wallet-client.ts       → Pera & Defly wallet integration
├── payment-handler.ts     → Transaction creation & signing
└── mock-payments.ts       → Local development mode
\`\`\`

### TestNet Deployment Details

| Component | Details |
|-----------|---------|
| **Network** | Algorand TestNet |
| **Treasury Wallet** | `HZ57J3K46JIJXILONBBZOHXGBKPXEN2VIYPCISHKRQ2UKWQXDKWNFB3P` |
| **API Endpoint** | `https://testnet-api.algorand.network` |
| **Block Explorer** | [testnet.algoexplorer.io](https://testnet.algoexplorer.io/) |
| **Transaction Cost** | 0.001 ALGO per AI task extraction |

### Try It Yourself

Want to see blockchain payments in action?

1. **Get test ALGO** → Visit [TestNet Dispenser](https://bank.testnet.algorand.network/) and grab free tokens
2. **Install a wallet** → Download [Pera Wallet](https://perawallet.app/) or [Defly Wallet](https://defly.app/)
3. **Connect to KortexFlow** → Link your wallet on the dashboard
4. **Extract a task** → Use the AI feature (costs 0.001 ALGO)
5. **Verify on-chain** → Check your transaction on [AlgoExplorer](https://testnet.algoexplorer.io/)

The entire payment flow is decentralized. No credit cards, no payment processors, just pure blockchain transactions.

---

## Getting Started Locally

### What You'll Need

- Node.js 18 or newer
- pnpm package manager
- A Supabase account (free tier works great)
- Algorand wallet for testing

### Installation Steps

\`\`\`bash
# Clone the repository
git clone https://github.com/devndesigner6/Kortex-Flow.git
cd Kortex-Flow

# Install dependencies
pnpm install

# Configure your environment
cp .env.example .env.local
\`\`\`

Now open `.env.local` and add your credentials:

\`\`\`bash
# Supabase credentials (get these from your dashboard)
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# Algorand network
NEXT_PUBLIC_ALGORAND_NETWORK=testnet

# Google OAuth (optional, for Gmail/Calendar sync)
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret

# App URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
\`\`\`

### Launch the App

\`\`\`bash
pnpm dev
\`\`\`

Open [localhost:3000](http://localhost:3000) and you're in.

---

## Project Structure

Here's how everything is organized:

\`\`\`
kortexflow/
│
├── app/                      → Next.js pages & routing
│   ├── api/                 → Backend API endpoints
│   ├── auth/                → Login, signup, OAuth callbacks
│   ├── dashboard/           → Main application interface
│   ├── about/               → About page with contact info
│   └── page.tsx             → Landing page
│
├── components/              → React components
│   ├── blockchain/         → Wallet & payment UI
│   ├── dashboard/          → Email, calendar, task components
│   └── ui/                 → Reusable design system
│
├── lib/                     → Core business logic
│   ├── algorand/           → 🔐 Blockchain integration
│   ├── supabase/           → Database utilities
│   └── types/              → TypeScript definitions
│
├── hooks/                   → Custom React hooks
├── public/                  → Static assets & images
└── scripts/                 → Database setup scripts
\`\`\`

---

## How It Works Behind the Scenes

### 1. Connect Your Digital Life

When you link Gmail and Calendar, we use OAuth 2.0—the same secure protocol banks use. We never see your password. We only access what you explicitly allow.

### 2. AI Extracts What Matters

Our natural language processor scans your emails looking for patterns:
- Date mentions → Deadlines
- Action verbs → Tasks
- Meeting subjects → Priorities

It learns your style over time, getting smarter with each email.

### 3. Everything Goes On-Chain

When you mark a task complete, we create an Algorand transaction. It includes:
- Task description (encrypted)
- Completion timestamp
- Your wallet signature

Once on the blockchain, it's permanent. No one can change history.

### 4. Your Dashboard Stays in Sync

Real-time subscriptions mean updates appear instantly. No refreshing. No delays. Just seamless workflow.

---

## Deployment Guide

### Deploy to Vercel (Recommended)

Vercel is the easiest way to get KortexFlow live:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/devndesigner6/Kortex-Flow)

**Manual deployment:**

\`\`\`bash
# Push your code to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# Then on Vercel:
# 1. Import your GitHub repo
# 2. Add environment variables (same as .env.local)
# 3. Click Deploy
\`\`\`

> Remember to update `NEXT_PUBLIC_APP_URL` to your Vercel domain in the environment variables.

---

## Common Issues & Solutions

<details>
<summary><strong>Email sync isn't working</strong></summary>

<br>

Check these in your Supabase dashboard:
- Authentication → URL Configuration → Add your redirect URLs
- Authentication → Email Templates → Ensure they're enabled
- Authentication → Providers → Google OAuth credentials are correct

</details>

<details>
<summary><strong>Wallet connection fails</strong></summary>

<br>

Try these steps:
1. Make sure you're on TestNet (check wallet settings)
2. Clear browser cache and reconnect
3. Ensure wallet extension is updated to latest version
4. Get test ALGO from the [dispenser](https://bank.testnet.algorand.network/)

</details>

<details>
<summary><strong>Build fails during deployment</strong></summary>

<br>

Usually an environment variable issue:
- Double-check all variables are set in Vercel dashboard
- Verify variable names match exactly (they're case-sensitive)
- Make sure there are no trailing spaces
- Redeploy after adding missing variables

</details>

<details>
<summary><strong>Port 3000 is already in use</strong></summary>

<br>

\`\`\`bash
# Run on a different port
pnpm dev -- -p 3001
\`\`\`

</details>

<details>
<summary><strong>Module not found errors</strong></summary>

<br>

\`\`\`bash
# Clean install
rm -rf node_modules .next
pnpm install
\`\`\`

</details>

---

## Useful Commands

| Command | What it does |
|---------|-------------|
| `pnpm dev` | Start development server on localhost:3000 |
| `pnpm build` | Create optimized production build |
| `pnpm start` | Run the production build locally |
| `pnpm lint` | Check code for errors and style issues |
| `pnpm type-check` | Validate TypeScript types |

---

## The Design Philosophy

KortexFlow embraces a **retro-tech aesthetic** inspired by early computer terminals and military command centers.

**Color Psychology**  
We chose military green because it represents:
- Trust and reliability
- Growth and progress  
- Technology and innovation

**Minimal Interface**  
Every pixel serves a purpose. No decorative bloat. Just clean, functional design that respects your attention.

**Smooth Animations**  
Transitions aren't just pretty—they provide context. When elements move, it tells you what's happening and why.

---

## What's Next

We're actively building:

- **Token Economy** → Earn tokens for completing tasks on time
- **Team Workspaces** → Collaborate with shared accountability
- **Mobile Apps** → Native iOS and Android experiences
- **API Access** → Let developers build on KortexFlow
- **Advanced Analytics** → Insights into your productivity patterns

---

## Resources & Links

| Resource | URL |
|----------|-----|
| **Live Application** | [kortexflow.vercel.app](https://kortexflow.vercel.app/) |
| **GitHub Repository** | [github.com/devndesigner6/Kortex-Flow](https://github.com/devndesigner6/Kortex-Flow) |
| **Algorand TestNet Dispenser** | [bank.testnet.algorand.network](https://bank.testnet.algorand.network/) |
| **AlgoExplorer (TestNet)** | [testnet.algoexplorer.io](https://testnet.algoexplorer.io/) |
| **Pera Wallet** | [perawallet.app](https://perawallet.app/) |
| **Defly Wallet** | [defly.app](https://defly.app/) |
| **Next.js Documentation** | [nextjs.org/docs](https://nextjs.org/docs) |
| **Supabase Documentation** | [supabase.com/docs](https://supabase.com/docs) |

---

## Support & Contact

Having trouble? Want to suggest a feature? Just want to say hi?

**Email us:** [kortexflowsync@gmail.com](mailto:kortexflowsync@gmail.com?subject=KortexFlow%20Support)

When reporting bugs, please include:
- Browser name and version
- Steps to reproduce the issue
- Screenshots if applicable
- Your wallet address (TestNet only, never share MainNet addresses)

---

## License

MIT License - Feel free to use this code for your own projects. See [LICENSE](LICENSE) for full details.

---

<div align="center">

## Why This Matters

Traditional productivity tools are black boxes. They tell you what to do, but there's no proof that work happened. No accountability. No trust.

**KortexFlow is different.**

Every task is verifiable. Every deadline is recorded. Every action leaves a permanent, transparent trail on the blockchain.

This isn't just better productivity software.  
**This is productivity you can prove.**

---

### Built with care for a more transparent future

**Questions?** [kortexflowsync@gmail.com](mailto:kortexflowsync@gmail.com)  
**Found a bug?** [Open an issue](https://github.com/devndesigner6/Kortex-Flow/issues)  
**Love it?** [Star the repo ⭐](https://github.com/devndesigner6/Kortex-Flow)

[Launch KortexFlow](https://kortexflow.vercel.app/) • [View on GitHub](https://github.com/devndesigner6/Kortex-Flow)

</div>

