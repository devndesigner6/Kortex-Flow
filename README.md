<div align="center">

# KortexFlow

**AI-Powered Workflow Automation**

[Launch App](https://kortexflow.vercel.app/) • [Support](mailto:kortexflowsync@gmail.com)

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Powered-FFCA28?style=flat-square&logo=firebase)](https://firebase.google.com/)

</div>

---

## Overview

KortexFlow transforms scattered emails and calendar events into organized, AI-extracted tasks.

**The Problem:** Important emails get buried, deadlines slip through cracks, and managing tasks is overwhelming.

**The Solution:** AI analyzes your Gmail and Calendar, extracts actionable tasks, and keeps everything organized in one place. Productivity simplified.

---

## Key Features

| Feature | What It Does |
|---------|-------------|
| **Smart Email Analysis** | AI extracts deadlines and action items from Gmail automatically |
| **Calendar Intelligence** | Converts meetings into tasks with prep work and follow-ups |
| **AI Task Extraction** | Automatically identifies and creates actionable tasks |
| **AI Response Drafting** | Generate intelligent email replies with AI assistance |
| **Real-Time Sync** | Instant updates across all devices via Firebase |

---

## Quick Start

### 1. Clone & Install

\`\`\`bash
git clone https://github.com/devndesigner6/Kortex-Flow.git
cd Kortex-Flow
pnpm install
\`\`\`

### 2. Configure Environment

\`\`\`bash
cp .env.example .env.local
\`\`\`

Add your credentials to `.env.local`:

\`\`\`bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
\`\`\`

### 3. Run Development Server

\`\`\`bash
pnpm dev
\`\`\`

Visit [localhost:3000](http://localhost:3000)

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 15** | React framework with server-side rendering |
| **TypeScript** | Type-safe development |
| **Firebase** | Firestore NoSQL database with real-time updates |
| **TailwindCSS** | Utility-first styling |
| **Google Gemini AI** | AI-powered task extraction and response generation |

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
<summary><strong>Email sync not working</strong></summary>

Check Firebase console:
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
| **Support Email** | [kortexflowsync@gmail.com](mailto:kortexflowsync@gmail.com) |

---

## Support

Questions or issues? Email us at [kortexflowsync@gmail.com](mailto:kortexflowsync@gmail.com?subject=KortexFlow%20Support)

When reporting bugs, include:
- Browser version
- Steps to reproduce
- Screenshots
- Error messages

---

## License

MIT License - See [LICENSE](LICENSE) for details

---

<div align="center">

### AI-Powered Productivity

Every task organized. Every deadline tracked. Every action simplified.

**[Launch KortexFlow →](https://kortexflow.vercel.app/)**

</div>
