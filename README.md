<div align="center">

# 🔄 KortexFlow

### AI-Powered Workflow Automation Meets Web3 Transparency

[Live Demo](https://kortexflow.vercel.app/) • [Documentation](#-documentation) • [Smart Contracts](#-blockchain--smart-contracts) • [Report Bug](mailto:kortexflowsync@gmail.com)

</div>

---

## 🎯 The Problem

Modern productivity is broken. Your inbox is chaos—deadlines buried in threads, tasks scattered across apps, and no clear way to track what actually gets done.

**The cost?** Lost time. Missed opportunities. Zero accountability.

## 💡 The Solution

**KortexFlow** transforms your digital chaos into verifiable action. An AI assistant that connects Gmail, Calendar, and Algorand blockchain to automate workflows with full transparency.

> **Key Difference:** Every task, deadline, and action is recorded on-chain. No hiding. No forgetting. Complete accountability.

---

## ✨ Core Features

<table>
<tr>
<td width="33%" valign="top">

### 🤖 AI Intelligence
- Smart task extraction from emails
- Automatic deadline detection
- Context-aware categorization
- Natural language processing

</td>
<td width="33%" valign="top">

### 🔗 Blockchain Trust
- On-chain workflow verification
- Immutable task records
- Pera Wallet integration
- Transparent audit trail

</td>
<td width="33%" valign="top">

### ⚡ Seamless Integration
- Gmail auto-sync
- Google Calendar connection
- Real-time updates
- Zero-config setup

</td>
</tr>
</table>

---

## 🏗️ Technical Architecture

\`\`\`mermaid
graph LR
    A[User] --> B[Next.js Frontend]
    B --> C[Supabase Backend]
    B --> D[AI Processing]
    B --> E[Algorand Blockchain]
    C --> F[PostgreSQL]
    E --> G[Pera Wallet]
    D --> H[Task Extraction]
    style E fill:#00D494
    style B fill:#000000
    style C fill:#3ECF8E
\`\`\`

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 15 + TypeScript | Responsive UI with server-side rendering |
| **Backend** | Supabase | Authentication, database, real-time subscriptions |
| **Blockchain** | Algorand TestNet | Transparent workflow verification & payments |
| **AI Engine** | Custom NLP | Email parsing, task extraction, automation |
| **Deployment** | Vercel | Edge functions, global CDN |

---

## 🔐 Blockchain & Smart Contracts

> [!IMPORTANT]
> All blockchain operations run on **Algorand TestNet** for transparency and safety.

### 📍 Contract Locations

\`\`\`bash
lib/
└── algorand/
    ├── config.ts           # Network configuration
    ├── wallet-client.ts    # Pera/Defly wallet integration
    ├── payment-handler.ts  # Transaction management
    └── mock-payments.ts    # Development testing
\`\`\`

### 🌐 TestNet Deployment

| Component | Network | Explorer Link |
|-----------|---------|---------------|
| **Payment System** | Algorand TestNet | [View on AlgoExplorer](https://testnet.algoexplorer.io/) |
| **Treasury Wallet** | TestNet Address | `HZ57J3K46JIJXILONBBZOHXGBKPXEN2VIYPCISHKRQ2UKWQXDKWNFB3P` |
| **Network** | TestNet | [AlgoNode API](https://testnet-api.algorand.network) |

### 💰 Test the Payment Flow

1. Get free TestNet ALGO from [TestNet Dispenser](https://bank.testnet.algorand.network/)
2. Connect your Pera or Defly wallet
3. Try AI Task Extraction (costs 0.001 ALGO)
4. Verify transaction on [AlgoExplorer](https://testnet.algoexplorer.io/)

> [!TIP]
> All payments are processed via smart contracts—no centralized payment processor required!

---

## 🚀 Quick Start

### Prerequisites

\`\`\`bash
Node.js ≥ 18
pnpm (npm install -g pnpm)
Git
Supabase account
Algorand wallet (Pera or Defly)
\`\`\`

### Installation

\`\`\`bash
# 1. Clone the repository
git clone https://github.com/devndesigner6/Kortex-Flow.git
cd Kortex-Flow

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your keys
\`\`\`

### Environment Configuration

\`\`\`bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Algorand Configuration
NEXT_PUBLIC_ALGORAND_NETWORK=testnet

# OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
\`\`\`

### Run Development Server

\`\`\`bash
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 📦 Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/devndesigner6/Kortex-Flow)

**Manual Deployment:**

\`\`\`bash
# 1. Push to GitHub
git add .
git commit -m "Initial commit"
git push origin main

# 2. Import on Vercel Dashboard
# 3. Add environment variables
# 4. Deploy!
\`\`\`

> [!NOTE]
> Remember to add all environment variables in Vercel Settings → Environment Variables

---

## 🛠️ Development Commands

| Command | Description |
|---------|-------------|
| `pnpm install` | Install all dependencies |
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Run production build |
| `pnpm lint` | Run ESLint |
| `pnpm type-check` | Check TypeScript types |

---

## 🐛 Troubleshooting

<details>
<summary><b>Port 3000 already in use</b></summary>

\`\`\`bash
pnpm dev -- -p 3001
\`\`\`
</details>

<details>
<summary><b>Module not found errors</b></summary>

\`\`\`bash
rm -rf node_modules .next
pnpm install
\`\`\`
</details>

<details>
<summary><b>Email verification fails</b></summary>

Check Supabase dashboard:
- Verify redirect URLs are configured
- Check email templates are enabled
- Ensure SMTP settings are correct
</details>

<details>
<summary><b>Wallet connection issues</b></summary>

- Ensure you're on TestNet
- Check wallet extension is installed
- Clear browser cache and reconnect
- Get test ALGO from dispenser
</details>

<details>
<summary><b>Build fails on Vercel</b></summary>

Ensure all environment variables are set:
- Check Vercel Settings → Environment Variables
- Verify variable names match exactly
- Redeploy after adding variables
</details>

---

## 📊 Project Structure

\`\`\`
kortexflow/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard page
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── blockchain/        # Wallet & payment components
│   ├── dashboard/         # Dashboard components
│   └── ui/                # Reusable UI components
├── lib/                   # Core utilities
│   ├── algorand/          # 🔐 Blockchain integration
│   ├── supabase/          # Database client
│   └── types/             # TypeScript types
├── hooks/                 # Custom React hooks
├── public/                # Static assets
└── scripts/               # Database migration scripts
\`\`\`

---

## 🔬 How It Works

### 1. **Connect Your Accounts**
Link Gmail and Google Calendar with one click. KortexFlow securely accesses your data via OAuth.

### 2. **AI Extracts Intelligence**
Advanced NLP scans emails for tasks, deadlines, and meeting context—automatically categorizing by priority.

### 3. **Blockchain Verification**
Every completed task is recorded on Algorand's blockchain. Immutable. Verifiable. Transparent.

### 4. **Smart Dashboard**
Clean, minimal interface shows what matters most. No clutter. No distractions.

---

## 🎨 Design Philosophy

KortexFlow embraces a **retro-tech aesthetic** with:

- **Military Green Theme** - Professional yet modern
- **Minimalist Interface** - Focus on what matters
- **Smooth Animations** - Elegant transitions
- **Dark Mode First** - Easy on the eyes

---

## 🔮 Roadmap

- [x] Gmail integration
- [x] Calendar sync
- [x] Algorand wallet connection
- [x] AI task extraction
- [x] Payment system
- [ ] Token-based feature access
- [ ] Multi-language support
- [ ] Mobile apps (iOS/Android)
- [ ] API for third-party integrations
- [ ] Advanced analytics dashboard

---

## 📚 Resources & Documentation

| Resource | Link |
|----------|------|
| **Live Demo** | [kortexflow.vercel.app](https://kortexflow.vercel.app/) |
| **Next.js Docs** | [nextjs.org/docs](https://nextjs.org/docs) |
| **Algorand Developer** | [developer.algorand.org](https://developer.algorand.org/) |
| **Supabase Docs** | [supabase.com/docs](https://supabase.com/docs) |
| **TestNet Dispenser** | [bank.testnet.algorand.network](https://bank.testnet.algorand.network/) |
| **Pera Wallet** | [perawallet.app](https://perawallet.app/) |

---

## 🤝 Support & Contact

Need help? Have questions? We're here for you.

📧 **Email:** [kortexflowsync@gmail.com](mailto:kortexflowsync@gmail.com?subject=KortexFlow%20Support)

> [!TIP]
> For bug reports, please include:
> - Browser and version
> - Steps to reproduce
> - Screenshots if applicable
> - Wallet address (TestNet only)

---

## ⚖️ License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🌟 Why KortexFlow?

Traditional productivity tools hide what they do. KortexFlow puts everything on the blockchain—every task, every deadline, every action is transparent and verifiable.

**This isn't just automation. This is accountability.**

- ✅ **Trust by default** - Blockchain verification
- ✅ **AI-powered efficiency** - Smart task extraction
- ✅ **Full transparency** - Public audit trail
- ✅ **User sovereignty** - You control your data

---

<div align="center">

### Built with 💚 for a more transparent digital future

**KortexFlow** - Where productivity meets accountability

[Get Started](https://kortexflow.vercel.app/) • [View on GitHub](https://github.com/devndesigner6/Kortex-Flow) • [Contact Us](mailto:kortexflowsync@gmail.com)

</div>
