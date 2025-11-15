# KortexFlow: Smart Automation Meets Real Transparency

KortexFlow is your smart assistant for taming digital chaos. It connects Gmail, Calendar, and your Algorand wallet, automatically sorting out tasks and deadlines. You get a clean, easy dashboard—no more missed to-dos, no more hunting for important info buried in email threads. Everything is powered by AI for daily task extraction and all actions are locked with Algorand blockchain so you can *actually* trust what you see.[1][2]

**Why use KortexFlow?**  
Most tools make you trust them with your data. KortexFlow puts you in control. When it grabs your next calendar event or marks a task complete, that proof is stored transparently on a public blockchain. You, and only you, own your history—via your Pera Wallet.

***

## Quick Setup

- Make sure you have Node.js (version 18 or above), pnpm, Git, a Supabase account, and ideally VS Code.
- Clone the repo:
  ```
  git clone https://github.com/YOUR_USERNAME/kortexflow.git
  cd kortexflow
  ```
- Install all the dependencies with:
  ```
  pnpm install
  ```
- Set up your local secrets by editing `.env.local` with:
  ```
  NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
  NEXT_PUBLIC_ALGORAND_NETWORK=testnet
  ```
- Start the local server:
  ```
  pnpm dev
  ```
  Then just visit [http://localhost:3000](http://localhost:3000/) to try it out.[2][1]

**Deploying publicly?**  
Push your code to GitHub, hook it up on Vercel, and drop in your environment variables through their dashboard.

***

## Blockchain Transparency

Every action—from creating to ticking off a task—becomes a permanent, verifiable blockchain record (using Algorand TestNet, visible on AlgoExplorer). All interactions are real blockchain transactions, signed through Pera Wallet. The project code for Algorand integration is inside `lib/algorand` in the main folder.[1][2]

***

## Tech Under The Hood

- **Frontend**: Next.js and Vite (for a fast, clean interface)
- **Backend**: Supabase (auth, data)
- **Blockchain**: Algorand (real immutable records)
- **AI Layer**: Custom logic that pulls real tasks from messy emails
- **Deployment**: Vercel (frontend), Supabase (backend)[2][1]

***

## See It Live

Want to experience it right away? Visit the latest version:  
https://v0-decentralized-kortex-flow-app.vercel.app/[1][2]

***

## Troubleshooting

- If port 3000 is in use, run: `pnpm dev -- -p 3001`
- If you hit a missing module, delete `node_modules` then run `pnpm install` again.
- If Supabase login isn’t working, double-check your `.env.local` values.
- If Vercel builds fail, make sure your secrets are all set.

***

**KortexFlow is powered by the Block Genesis team. Real productivity, real trust, AI and blockchain finally working for you—not the other way around.**[2][1]


