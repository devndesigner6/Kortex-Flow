# Algorand Integration Guide

## 📦 Overview

The blockchain page now integrates comprehensive Algorand functionality including:

- **Multi-Wallet Support**: Pera Wallet & Defly Wallet
- **Identity Binding**: Email-to-wallet address mapping
- **Task Tokenization**: Convert tasks to Algorand ASAs (ARC-3 compliant)
- **Indexer Service**: Query blockchain tasks and transactions
- **IPFS Storage**: Decentralized metadata storage

## 🏗️ Architecture

```
lib/algorand/
├── client.ts              # Algod & Indexer client setup
├── wallet-context.tsx     # React context for wallet management
├── identity.ts            # Email hashing & wallet binding
├── task-tokenizer.ts      # Task → ASA conversion
├── indexer-service.ts     # Query blockchain data
└── ipfs.ts               # IPFS metadata storage
```

## 🔧 Setup Instructions

### 1. Database Setup

Run the SQL migration to create the address mappings table:

```bash
# In Supabase dashboard SQL editor
# Run: scripts/004_add_address_mappings.sql
```

### 2. Environment Variables

Add to your `.env.local`:

```env
# Algorand Network
NEXT_PUBLIC_ALGORAND_NETWORK=testnet  # or mainnet

# IPFS (optional - defaults to public gateway)
IPFS_PROVIDER=infura
INFURA_PROJECT_ID=your_project_id
INFURA_API_SECRET=your_api_secret

# Identity Binding Salt (REQUIRED - change for production!)
EMAIL_HASH_SALT=your_random_salt_here
```

### 3. Install Dependencies

Already installed:
- `algosdk` - Algorand SDK
- `@algorandfoundation/algokit-utils` - AlgoKit utilities
- `@perawallet/connect` - Pera Wallet integration
- `@blockshake/defly-connect` - Defly Wallet integration
- `ipfs-http-client` - IPFS integration

## 🎯 Features

### 1. Multi-Wallet Connection

Users can connect with either **Pera Wallet** or **Defly Wallet**:

```tsx
// Usage in blockchain page
const { connectWallet, isConnected, activeAccount } = useAlgorandWallet()

// Connect Pera
await connectWallet('pera')

// Connect Defly
await connectWallet('defly')
```

### 2. Identity Binding

Maps email addresses to Algorand addresses without storing raw emails:

```typescript
import { hashEmail, signInWithAlgorand } from '@/lib/algorand/identity'

// Hash email for privacy
const emailHash = hashEmail('user@example.com')

// Sign in with wallet
const result = await signInWithAlgorand(
  email,
  walletAddress,
  signature,
  nonce
)
```

**Security**: Emails are hashed with SHA-256 + salt before storage.

### 3. Task Tokenization

Convert tasks to on-chain ASAs (Algorand Standard Assets):

```typescript
import { tokenizeTask } from '@/lib/algorand/task-tokenizer'

const taskData = {
  title: 'Review PR',
  description: 'Review pull request #123',
  assigneeEmail: 'dev@example.com',
  creatorEmail: 'manager@example.com',
  source: 'email',
  externalId: 'gmail-msg-123',
  dueDate: '2025-12-31',
  priority: 'H',
  labels: ['urgent', 'dev']
}

// Creates ASA + uploads metadata to IPFS
const { transactions, cid, assetId } = await tokenizeTask(taskData)
```

**Features**:
- 1-unit non-divisible tokens (each task = 1 token)
- ARC-3 compliant metadata
- IPFS storage for task details
- Transferable between users

### 4. Query Blockchain Tasks

Fetch tasks owned by a wallet:

```typescript
import { getUserTasks } from '@/lib/algorand/indexer-service'

const tasks = await getUserTasks(walletAddress)

// Returns: BlockchainTask[]
tasks.forEach(task => {
  console.log(task.name)
  console.log(task.properties.status)  // open | in_progress | done
  console.log(task.properties.priority) // H | M | L
})
```

### 5. IPFS Integration

Store and retrieve task metadata:

```typescript
import { uploadToIPFS, fetchFromIPFS } from '@/lib/algorand/ipfs'

// Upload
const cid = await uploadToIPFS(metadata)

// Fetch
const metadata = await fetchFromIPFS(cid)
```

**Providers supported**:
- Infura (default)
- Local IPFS node
- Public gateways (fallback)

## 🌐 Blockchain Page Features

The updated blockchain dashboard now displays:

1. **Wallet Connection**
   - Connect Pera or Defly wallet
   - View wallet address & balance
   - Show connected provider
   - Display email hash for identity binding

2. **Blockchain Tasks**
   - List all task ASAs owned by wallet
   - Show asset ID, title, description
   - Display priority and status
   - Show due dates

3. **Recent Transactions**
   - Last 10 transactions from connected wallet
   - Transaction ID, type, and round

4. **Smart Contract Status**
   - Contract functions and version
   - PyTeal information

5. **Oracle Service Status**
   - Oracle responsibilities
   - Deployment status

6. **Box Storage System**
   - User-specific box storage
   - Storage capacity info

## 📝 Usage Examples

### Example 1: Connect Wallet

```typescript
'use client'
import { useAlgorandWallet } from '@/lib/algorand/wallet-context'

export function MyComponent() {
  const { connectWallet, isConnected, activeAccount, balance } = useAlgorandWallet()

  return (
    <div>
      {!isConnected ? (
        <button onClick={() => connectWallet('pera')}>
          Connect Pera Wallet
        </button>
      ) : (
        <div>
          <p>Address: {activeAccount}</p>
          <p>Balance: {balance} ALGO</p>
        </div>
      )}
    </div>
  )
}
```

### Example 2: Create Task Token

```typescript
import { tokenizeTask } from '@/lib/algorand/task-tokenizer'
import { getAlgodClient } from '@/lib/algorand/client'

async function createTaskToken(walletAddress: string) {
  const taskData = {
    title: 'Complete report',
    description: 'Finish Q4 financial report',
    assigneeEmail: 'john@example.com',
    creatorEmail: 'jane@example.com',
    source: 'email' as const,
    externalId: 'task-123',
    dueDate: '2025-12-31T23:59:59Z',
    priority: 'H' as const,
    labels: ['finance', 'quarterly']
  }

  // Tokenize
  const { transactions, cid } = await tokenizeTask(taskData)

  // Sign and send (requires wallet integration)
  const signedTxns = await signTransactions(transactions)
  
  const algodClient = getAlgodClient()
  const { txId } = await algodClient.sendRawTransaction(signedTxns).do()
  
  console.log(`Task token created! TX: ${txId}, IPFS: ${cid}`)
}
```

### Example 3: Query User Tasks

```typescript
import { getUserTasks } from '@/lib/algorand/indexer-service'

async function showMyTasks(walletAddress: string) {
  const tasks = await getUserTasks(walletAddress)
  
  console.log(`Found ${tasks.length} tasks`)
  
  tasks.forEach(task => {
    console.log(`
      Asset ID: ${task.assetId}
      Title: ${task.name}
      Status: ${task.properties.status}
      Priority: ${task.properties.priority}
      Due: ${task.properties.due}
    `)
  })
}
```

## 🔐 Security Considerations

1. **Email Privacy**: Emails are hashed before storage (never stored raw)
2. **Salt Management**: Change `EMAIL_HASH_SALT` in production
3. **RLS Policies**: Adjust Supabase policies based on your auth
4. **Transaction Signing**: Always done client-side via wallet
5. **IPFS Data**: Task metadata is public once uploaded

## 🚀 Deployment Checklist

- [ ] Run `004_add_address_mappings.sql` in Supabase
- [ ] Set `EMAIL_HASH_SALT` to random string
- [ ] Configure IPFS provider (Infura recommended)
- [ ] Test wallet connections on testnet
- [ ] Verify indexer queries work
- [ ] Update RLS policies for production
- [ ] Set `NEXT_PUBLIC_ALGORAND_NETWORK=mainnet` when ready

## 🐛 Troubleshooting

### Wallet won't connect
- Ensure Pera/Defly wallet is installed
- Check browser console for errors
- Try testnet first before mainnet

### IPFS upload fails
- Check Infura credentials
- Verify network connectivity
- Try public gateway as fallback

### Tasks not showing
- Wait for indexer to sync (can take 1-2 minutes)
- Check if wallet owns any TFLOW assets
- Verify network (testnet vs mainnet)

### Signature verification fails
- Ensure nonce is fresh (< 5 minutes old)
- Check wallet address matches signature
- Verify message format

## 📚 Resources

- [Algorand Developer Docs](https://developer.algorand.org/)
- [AlgoKit Utils](https://github.com/algorandfoundation/algokit-utils-ts)
- [Pera Wallet Docs](https://docs.perawallet.app/)
- [Defly Wallet](https://defly.app/)
- [ARC-3 NFT Standard](https://arc.algorand.foundation/ARCs/arc-0003)
- [IPFS Docs](https://docs.ipfs.tech/)

## 🆘 Support

For issues or questions:
1. Check console logs for errors
2. Verify environment variables
3. Test on Algorand testnet first
4. Review the utility files in `lib/algorand/`

---

**Integration Complete!** 🎉

The blockchain page now has full Algorand integration with wallet management, task tokenization, identity binding, and IPFS storage.
