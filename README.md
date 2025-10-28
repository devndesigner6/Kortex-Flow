🚀 KortexFlow – Your AI-Powered Productivity Command Center

KortexFlow reimagines personal productivity.
Your inbox shouldn’t be your to-do list — yet today, that’s exactly what happens. Emails hide tasks. Meeting invites drown in noise. Deadlines slip.

KortexFlow is your intelligent command center that:
 ->Connects to Gmail & Google Calendar
 ->Understands emails using AI
 ->Detects tasks, deadlines & meetings automatically
 ->Converts chaos into an actionable personal workflow

No more digging through emails - KortexFlow tells you:

“Here’s what you need to do - and when.”

✨ Core Features
Feature	Status	Description
AI Task Extraction	✅	Detects action items & deadlines from emails
Calendar Sync	✅	Auto-adds meetings with reminders
Smart Dashboard	✅	Clear daily list of priorities
Secure Account Authentication	✅	OAuth-based Gmail/Calendar access
Blockchain-Backed Data Integrity	🚧 (WIP)	Algorand ASA + immutable activity ledger
🧠 Why Blockchain?

Every task completed and commitment made becomes a verified, tamper-proof record.

Integrity of productivity history

Proof-of-completion for collaborative workflows

Token-based reward ecosystems (future phase)

Built on Algorand for:
⚡ Speed | ♻️ Sustainability | 🔒 Security

🛠 Tech Stack
Frontend

React.js (Vite)

ShadCN + TailwindCSS UI

Lucide Icons

Backend

Node.js / Express (API handling)

Gmail API + Google Calendar API

AI Layer

LLM-powered email parsing + task extraction

Blockchain Layer (Algorand)

AlgoKit for local dev + deployment

Algorand Standard Assets (ASA) for reward tokens

Pera Wallet / WalletConnect for authentication

⚙️ AlgoKit Setup (Blockchain Dev)

Ensure you have:
✅ Python 3.10+
✅ Docker installed
✅ AlgoKit installed:

pipx install algokit


Initialize Blockchain Workspace:

algokit init


Start Local Algorand Network (sandbox):

algokit localnet start


Deploy Smart Contracts / ASA:

algokit project deploy


Fund accounts & test wallet integration using:

algokit generate account

▶️ Run the Frontend Locally

Clone the repository:

git clone https://github.com/devndesigner6/Kortex-Flow.git
cd Kortex-Flow


Install dependencies:

npm install


Create .env with Gmail/Calendar API Keys:

VITE_GOOGLE_CLIENT_ID=your_client_id
VITE_GOOGLE_API_KEY=your_api_key


Run the app:

npm run dev


Open in browser:

http://localhost:5173

🔐 Security & Privacy

OAuth for Google data permissions

Local blockchain ledger for accountability

No data stored without explicit user consent

Your inbox. Your tasks. Your control.


