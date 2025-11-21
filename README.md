<div align="center">

# KortexFlow

**AI-Powered Workflow Automation**

[Launch App](https://kortexflow-1098890500978.us-central1.run.app/) • [Support](mailto:kortexflowsync@gmail.com)

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Powered-FFCA28?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![Google Cloud](https://img.shields.io/badge/Google_Cloud-Deployed-4285F4?style=flat-square&logo=google-cloud)](https://cloud.google.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-Enabled-8E75B2?style=flat-square&logo=google)](https://ai.google.dev/)

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
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin (for server-side)
FIREBASE_ADMIN_PROJECT_ID=your_project_id
FIREBASE_ADMIN_CLIENT_EMAIL=your_service_account_email
FIREBASE_ADMIN_PRIVATE_KEY=your_private_key

# Google OAuth
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret

# Google Gemini AI
GOOGLE_AI_API_KEY=your_gemini_api_key

# App URL (for OAuth callbacks)
NEXT_PUBLIC_APP_URL=http://localhost:3000
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
| **Next.js 16** | React framework with Turbopack and App Router |
| **TypeScript 5** | Type-safe development |
| **Firebase** | Authentication and Firestore NoSQL database |
| **Google Cloud Run** | Containerized serverless deployment |
| **Google Gemini AI** | gemini-1.5-flash for task extraction and email analysis |
| **TailwindCSS 4** | Utility-first styling with @tailwindcss/postcss |
| **Gmail API** | Email sync and management |
| **Google Calendar API** | Event sync and task conversion |

---

## Deployment

### Deploy to Google Cloud Run

1. **Build Docker Image:**
\`\`\`bash
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/kortexflow
\`\`\`

2. **Deploy to Cloud Run:**
\`\`\`bash
gcloud run deploy kortexflow \
  --image gcr.io/YOUR_PROJECT_ID/kortexflow:latest \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --port 3000
\`\`\`

3. **Set Environment Variables:**
\`\`\`bash
gcloud run services update kortexflow --region us-central1 \
  --update-env-vars "NEXT_PUBLIC_FIREBASE_API_KEY=your_key,GOOGLE_CLIENT_ID=your_id,..."
\`\`\`

4. **Configure OAuth Redirect URIs:**
- Add `https://YOUR_CLOUD_RUN_URL/api/gmail/callback` to Google Cloud Console
- Add `https://YOUR_CLOUD_RUN_URL/api/calendar/callback` to Google Cloud Console

> **Live Deployment:** [kortexflow-1098890500978.us-central1.run.app](https://kortexflow-1098890500978.us-central1.run.app/)

---

## Troubleshooting

<details>
<summary><strong>Gmail OAuth not working</strong></summary>

Check Google Cloud Console:
- APIs & Services → Credentials → OAuth 2.0 Client IDs
- Add authorized redirect URIs: `https://YOUR_DOMAIN/api/gmail/callback`
- Ensure OAuth consent screen is published (In Production)
- Verify `NEXT_PUBLIC_APP_URL` environment variable is set correctly

</details>

<details>
<summary><strong>Firebase initialization errors</strong></summary>

- Ensure all Firebase environment variables are set in Cloud Run
- Check Firebase Admin private key is properly escaped
- Verify project ID matches across Firebase and environment variables
- Check Firestore database is created and rules are configured

</details>

<details>
<summary><strong>Cloud Run deployment fails</strong></summary>

- Verify Docker build completes successfully
- Check all required environment variables are set
- Ensure container registry permissions are correct
- Review Cloud Run logs: `gcloud run services logs read kortexflow --region us-central1`

</details>

---

## Roadmap

- [x] Google Cloud Run deployment
- [x] Firebase Authentication & Firestore
- [x] Google Gemini AI integration
- [x] Gmail & Calendar OAuth sync
- [ ] Advanced AI task prioritization
- [ ] Team workspaces with shared tasks
- [ ] Native mobile apps (iOS/Android)
- [ ] Slack/Microsoft Teams integration
- [ ] Advanced productivity analytics dashboard

---

## Resources

| Resource | Link |
|----------|------|
| **Live App** | [kortexflow-1098890500978.us-central1.run.app](https://kortexflow-1098890500978.us-central1.run.app/) |
| **GitHub** | [github.com/devndesigner6/Kortex-Flow](https://github.com/devndesigner6/Kortex-Flow) |
| **Support Email** | [kortexflowsync@gmail.com](mailto:kortexflowsync@gmail.com) |
| **Google Cloud Console** | [console.cloud.google.com](https://console.cloud.google.com/) |
| **Firebase Console** | [console.firebase.google.com](https://console.firebase.google.com/) |

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

**Powered by Google Cloud Run • Firebase • Gemini AI**

**[Launch KortexFlow →](https://kortexflow-1098890500978.us-central1.run.app/)**

</div>
