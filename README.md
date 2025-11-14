# KortexFlow: Your Personal AI Assistant, Built on Algorand

## The Problem: The Inbox is a Lie

We've all been there. You open your email, and suddenly, your inbox isn't a communication tool—it's a chaotic, overwhelming to-do list written by everyone else. You spend hours manually sifting through threads, trying to find that one critical deadline or meeting time, constantly living in fear of missing something important.

This is not productivity. This is digital anxiety.

## The KortexFlow Solution: Order from Chaos

KortexFlow is an intelligent workflow automation platform designed to end that anxiety. We bridge the gap between your scattered digital life and a clear, actionable plan.

KortexFlow automatically connects to your Gmail and Calendar, uses advanced Artificial Intelligence to understand the *intent* of your emails, and extracts every task, deadline, and event. It then presents them in a single, distraction-free dashboard.

It's not just a tool; it's your personal AI Chief of Staff.

## The Core Difference: True Ownership with Web3 Integrity

Most "smart" productivity apps store your most sensitive data on their private servers. We believe your personal organization should be owned by you, and only you.

KortexFlow is built on the **Algorand Blockchain** using **Smart Contracts**.

*   **Decentralized Data Ownership:** Your tasks and events are secured on the public, immutable ledger of Algorand, not on a private company's database.
*   **Verifiable Actions:** All user actions (like marking a task complete) are signed as transactions via the **Pera Wallet**. This ensures true user control and provides a verifiable, tamper-proof record of your productivity.
*   **Future-Proof Ecosystem:** We are building a foundation for a **token system** to reward users and unlock advanced features, creating a community-owned platform.

## Live Demo & Deployment

Experience KortexFlow immediately at our live deployment link:

**Live Demo:** [https://v0-decentralized-kortex-flow-app.vercel.app/](https://v0-decentralized-kortex-flow-app.vercel.app/)

## Key Features at a Glance

*   **AI-Powered Task Extraction:** Automatically identifies and structures tasks, deadlines, and meetings from email content.
*   **Unified Dashboard:** Merges email and calendar data into a single, clean view.
*   **Retro-Tech Aesthetic:** Features a minimalist, black-themed interface designed for maximum focus.
*   **Algorand Smart Contracts:** Ensures security, transparency, and data immutability.
*   **Pera Wallet Integration:** Provides seamless, secure Web3 authentication and transaction signing.

## Architecture Overview

KortexFlow merges Web2 efficiency with Web3 trust.

| Component | Technology | Purpose |
| :--- | :--- | :--- |
| Frontend | Next.js + Vite | The user interface, designed for a fast, retro-tech experience. |
| Backend | Supabase (Auth & DB) | Handles traditional user authentication and initial data storage. |
| Blockchain | Algorand (Smart Contracts) | Core logic for task verification, data immutability, and future token access. |
| AI Layer | Custom Logic & API Integration | The intelligence layer that processes email content into structured data. |
| Deployment | Vercel (Frontend) + Supabase (Backend) | Scalable and reliable deployment infrastructure. |

## Quick Start: Run KortexFlow Locally

### Prerequisites

*   Node.js ≥ 18
*   pnpm (npm install -g pnpm)
*   Git
*   Supabase account (for database and authentication)
*   VS Code (recommended)

### Run Locally

1.  **Clone repository**
    ```bash
    git clone https://github.com/devndesigner6/Kortex-Flow.git
    cd Kortex-Flow
    ```

2.  **Install dependencies**
    ```bash
    pnpm install
    ```

3.  **Configure environment variables**
    Create and edit a `.env.local` file with your credentials:
    ```
    NEXT_PUBLIC_SUPABASE_URL=<your_supabase_url>
    NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_anon_key>
    NEXT_PUBLIC_ALGORAND_NETWORK=testnet
    ```

4.  **Start dev server**
    ```bash
    pnpm dev
    ```
    **Access Locally:** The application will be running at [http://localhost:3000](http://localhost:3000).

### Useful Commands

| Command | Description |
| :--- | :--- |
| `pnpm install` | Install dependencies |
| `pnpm dev` | Start local server |
| `pnpm build` | Build for production |
| `pnpm start` | Run production build |

## Troubleshooting (Common Fixes)

| Issue | Fix |
| :--- | :--- |
| Port 3000 in use | `pnpm dev -- -p 3001` |
| Module not found | Delete `node_modules` and reinstall |
| Email verification fails | Recheck Supabase URL and redirect settings |
| Build fails on Vercel | Ensure all environment variables are set |

## Resources

*   [Next.js Docs](https://nextjs.org/docs)
*   [Vercel Docs](https://vercel.com/docs)
*   [Supabase Docs](https://supabase.com/docs)
*   [AlgoKit Docs](https://developer.algorand.org/docs/sdks/algokit/)
*   [Algorand TestNet Dispenser](https://dispenser.testnet.algorand.network/)

---
*KortexFlow is a project by the Block Genesis team.*

