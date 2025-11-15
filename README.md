
# KortexFlow: AI-Driven Workflow Automation with Web3 Transparency

## Overview

KortexFlow is an intelligent workflow automation platform that revolutionizes personal productivity by integrating AI-driven task extraction with the security and openness of blockchain technology. It connects your Gmail, Calendar, and Algorand wallet to automate daily tasks, transforming scattered digital chaos into a single, actionable dashboard. By leveraging the Algorand blockchain, KortexFlow ensures transparent, secure, and verifiable task management, empowering users to maintain absolute control over their workflows and data.[1][2]

## Why KortexFlow?

Managing tasks within email and calendar apps often leads to lost deadlines and overlooked opportunities. KortexFlow solves this by:[2][1]

- Automatically extracting actionable items using AI from emails and events.
- Storing all actions securely on the Algorand public ledger—never on private servers.
- Providing incomparably transparent record-keeping, where every completed task is a signed blockchain transaction.
- Giving users true data ownership, achieved with Pera Wallet authentication.

KortexFlow is built for those who want productivity without sacrificing control or trust.

## Setup & Installation Instructions

### Prerequisites

- Node.js ≥ 18
- pnpm (install via `npm install -g pnpm`)
- Git
- Supabase account
- VS Code (optional, but recommended)

### Local Setup

```sh
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/kortexflow.git
cd kortexflow

# 2. Install dependencies
pnpm install

# 3. Set environment variables
# Edit .env.local with your credentials
NEXT_PUBLIC_SUPABASE_URL=<your_supabase_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_anon_key>
NEXT_PUBLIC_ALGORAND_NETWORK=testnet

# 4. Start the development server
pnpm dev
```
Visit [http://localhost:3000](http://localhost:3000) for local development.[1][2]

### Cloud Deployment (Vercel)

1. Push your project to GitHub.
2. Connect your repository in the Vercel dashboard.
3. Add environment variables in Vercel: Settings → Environment Variables.

## Links to Deployed Smart Contracts/Assets (Testnet)

- **Network:** Algorand TestNet
- **Explorer:** View contracts/assets using AlgoExplorer.
- **Source Path:** `KortexFlow Main → lib → algorand`
- All user actions encoded as signed transactions using Pera Wallet integration for maximum verifiability.[2][1]

## Architecture Overview

| Component   | Technology        | Purpose                                                   |
|-------------|-------------------|-----------------------------------------------------------|
| Frontend    | Next.js + Vite    | Fast UI, retro aesthetic, single dashboard                |
| Backend     | Supabase (Auth/DB)| User authentication, initial storage                      |
| Blockchain  | Algorand          | Task verification, data immutability, token system        |
| AI Layer    | Custom logic, API | Extracts and structures tasks from emails/events          |
| Deployment  | Vercel, Supabase  | Reliable cloud-based hosting                              |

- **Security:** All critical actions and state changes are logged on Algorand via smart contracts.
- **Automation:** AI-driven extraction keeps your dashboard current and actionable.
- **Tokenization:** Roadmap for community rewards and privileged access using tokens.[1][2]

## Deployed Frontend Link

- [KortexFlow on Vercel](https://v0-decentralized-kortex-flow-app.vercel.app/)[2][1]

## Troubleshooting & Commands

| Issue                       | Fix                                              |
|-----------------------------|--------------------------------------------------|
| Port 3000 in use            | `pnpm dev -- -p 3001`                            |
| Module not found            | Delete `node_modules` and reinstall              |
| Email verification fails    | Recheck Supabase URL and redirect settings       |
| Build fails on Vercel       | Ensure all environment variables are set         |

- **Useful Commands:**
  - `pnpm install` — Install dependencies
  - `pnpm dev` — Start local server
  - `pnpm build` — Build for production
  - `pnpm start` — Run production build

## Resources

- [Next.js Documentation](https://nextjs.org/)
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [AlgoKit Docs](https://github.com/algorandfoundation/algokit-cli)
- [Algorand TestNet Dispenser](https://bank.testnet.algorand.network/)

