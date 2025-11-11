# 🔷 AlgoKit Integration Guide - KortexFlow

## ✅ AlgoKit Successfully Integrated!

Your KortexFlow application now has full Algorand blockchain integration using AlgoKit.

---

## 📦 Installed Packages

The following packages have been added to your project:

- **@algorandfoundation/algokit-utils** - Core AlgoKit utilities
- **algosdk** - Official Algorand SDK
- **@perawallet/connect** - Pera Wallet integration
- **@blockshake/defly-connect** - Defly Wallet integration  
- **@walletconnect/modal** - WalletConnect support

---

## 🗂️ New Files Created

### 1. **`lib/algorand/client.ts`**
Core Algorand client configuration:
- Algod client initialization
- Indexer client initialization
- AlgoKit client wrapper
- Utility functions (format amounts, validate addresses, etc.)
- Support for MainNet, TestNet, and LocalNet

### 2. **`lib/algorand/wallet-context.tsx`**
React context for wallet management:
- Pera Wallet integration
- Defly Wallet integration
- Multi-account support
- Transaction signing
- Persistent connection state

### 3. **`components/dashboard/algorand-wallet-connect.tsx`**
Wallet connection component:
- Connect to Pera or Defly wallet
- Display connected accounts
- Copy address functionality
- Disconnect wallet option

### 4. **`app/algorand/page.tsx`**
Full-featured Algorand dashboard:
- Wallet connection interface
- Account balance display
- Send ALGO payments
- Network information
- Transaction status

---

## 🌐 Environment Variables

Added to `.env.local`:

```env
# Algorand Configuration
NEXT_PUBLIC_ALGORAND_NETWORK=testnet

# Optional: Custom node URLs (defaults to AlgoNode)
# NEXT_PUBLIC_ALGOD_SERVER=https://testnet-api.algonode.cloud
# NEXT_PUBLIC_INDEXER_SERVER=https://testnet-idx.algonode.cloud
```

### Network Options:
- **testnet** - Algorand TestNet (default, recommended for development)
- **mainnet** - Algorand MainNet (production)
- **localnet** - Local Algorand Sandbox

---

## 🚀 Features Available

### 1. **Wallet Connection**
- ✅ Connect Pera Wallet
- ✅ Connect Defly Wallet
- ✅ Multi-account support
- ✅ Persistent sessions
- ✅ Secure wallet integration

### 2. **Account Management**
- ✅ View account balance
- ✅ Display account address
- ✅ Copy address to clipboard
- ✅ Refresh balance
- ✅ Multiple account switching

### 3. **Transactions**
- ✅ Send ALGO payments
- ✅ Transaction preparation
- ✅ Wallet signing integration
- ✅ Transaction status tracking
- ✅ Error handling

### 4. **Network Integration**
- ✅ AlgoNode API (no API key needed)
- ✅ Algod client
- ✅ Indexer client
- ✅ Network switching support

---

## 📱 How to Use

### Access the Algorand Dashboard

1. **From Main Dashboard:**
   - Login to your account
   - Go to http://localhost:3000/dashboard
   - Click on the "ALGORAND_BLOCKCHAIN" card

2. **Direct Access:**
   - Navigate to http://localhost:3000/algorand

### Connect Your Wallet

1. **Install a Wallet:**
   - **Pera Wallet**: Download from https://perawallet.app
   - **Defly Wallet**: Download from https://defly.app

2. **Connect:**
   - Click "CONNECT_PERA_WALLET" or "CONNECT_DEFLY_WALLET"
   - Approve connection in your wallet app
   - Your address will be displayed

3. **Get TestNet ALGO:**
   - Go to https://bank.testnet.algorand.network
   - Enter your address
   - Click "Dispense" to get free TestNet ALGO
   - Refresh balance in the app

### Send a Payment

1. **Enter recipient address** (58-character Algorand address)
2. **Enter amount** in ALGO (e.g., 1.5)
3. **Click "SEND_TRANSACTION"**
4. **Approve in your wallet**
5. **Transaction confirmed!**

---

## 🛠️ Developer Guide

### Using the Algorand Client

```typescript
import { getAlgodClient, getIndexerClient, getAlgorandClient } from '@/lib/algorand/client'

// Get Algod client
const algodClient = getAlgodClient()
const accountInfo = await algodClient.accountInformation(address).do()

// Get Indexer client
const indexerClient = getIndexerClient()
const transactions = await indexerClient.searchForTransactions()
  .address(address)
  .limit(10)
  .do()

// Get AlgoKit client (recommended)
const algorand = getAlgorandClient()
```

### Using the Wallet Context

```typescript
'use client'

import { useAlgorandWallet } from '@/lib/algorand/wallet-context'

function MyComponent() {
  const { 
    accounts, 
    activeAccount, 
    isConnected, 
    connectWallet, 
    disconnectWallet,
    signTransaction 
  } = useAlgorandWallet()

  const handleConnect = async () => {
    await connectWallet('pera')
  }

  return (
    <div>
      {isConnected ? (
        <p>Connected: {activeAccount}</p>
      ) : (
        <button onClick={handleConnect}>Connect</button>
      )}
    </div>
  )
}
```

### Utility Functions

```typescript
import { 
  formatAlgoAmount, 
  algoToMicroAlgos, 
  isValidAddress,
  generateAccount 
} from '@/lib/algorand/client'

// Format amount for display
const formatted = formatAlgoAmount(1500000) // "1.500000"

// Convert ALGO to microALGO
const microAlgos = algoToMicroAlgos(1.5) // 1500000

// Validate Algorand address
const valid = isValidAddress('ABC...XYZ') // true/false

// Generate new account (for testing)
const account = generateAccount()
console.log(account.addr) // New address
```

---

## 🔧 Advanced Configuration

### Using a Custom Algorand Node

Update `.env.local`:

```env
NEXT_PUBLIC_ALGOD_SERVER=https://your-node-url.com
NEXT_PUBLIC_ALGOD_PORT=443
NEXT_PUBLIC_ALGOD_TOKEN=your-api-token

NEXT_PUBLIC_INDEXER_SERVER=https://your-indexer-url.com
NEXT_PUBLIC_INDEXER_PORT=443
NEXT_PUBLIC_INDEXER_TOKEN=your-api-token
```

### Using Algorand Sandbox (LocalNet)

1. **Install and start Algorand Sandbox:**
   ```bash
   git clone https://github.com/algorandfoundation/sandbox.git
   cd sandbox
   ./sandbox up
   ```

2. **Update `.env.local`:**
   ```env
   NEXT_PUBLIC_ALGORAND_NETWORK=localnet
   NEXT_PUBLIC_ALGOD_SERVER=http://localhost
   NEXT_PUBLIC_ALGOD_PORT=4001
   NEXT_PUBLIC_ALGOD_TOKEN=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
   ```

---

## 🎯 Next Steps - Build on Algorand

### Potential Features to Add:

1. **Asset Management**
   - Create and manage Algorand Standard Assets (ASAs)
   - Token transfers
   - Asset opt-in functionality

2. **Smart Contracts**
   - Deploy and interact with smart contracts
   - Use AlgoKit to build contracts in Python
   - Application calls and state management

3. **NFTs**
   - Mint NFTs on Algorand
   - Display NFT collections
   - NFT marketplace integration

4. **DeFi Integration**
   - Swap tokens using DEX aggregators
   - Liquidity pool interactions
   - Yield farming

5. **Task Verification on Blockchain**
   - Store task hashes on-chain
   - Verify task completion
   - Immutable audit trail

---

## 📚 Resources

- **AlgoKit Docs**: https://developer.algorand.org/docs/get-started/algokit/
- **Algorand Developer Portal**: https://developer.algorand.org
- **AlgoSDK Documentation**: https://algorand.github.io/js-algorand-sdk/
- **Pera Wallet Docs**: https://docs.perawallet.app
- **Defly Wallet**: https://defly.app
- **TestNet Dispenser**: https://bank.testnet.algorand.network
- **AlgoExplorer (TestNet)**: https://testnet.algoexplorer.io

---

## 🐛 Troubleshooting

### Wallet Not Connecting
- Make sure you have Pera or Defly wallet installed
- Check that you're on the correct network (TestNet/MainNet)
- Try refreshing the page and reconnecting

### Balance Not Showing
- Ensure your wallet is connected
- Verify you're on the correct network
- Click "REFRESH_BALANCE" button
- Check if you have TestNet ALGO (use the dispenser)

### Transaction Failing
- Check you have sufficient balance (including fees)
- Verify the recipient address is valid
- Ensure your wallet app is open and connected
- Check network connectivity

---

## ✨ Features Summary

Your KortexFlow app now includes:

✅ **Full Algorand Integration**
✅ **Wallet Connection (Pera & Defly)**
✅ **Account Balance Display**
✅ **Send ALGO Payments**
✅ **Network Support (MainNet/TestNet/LocalNet)**
✅ **AlgoKit Utils Integration**
✅ **Transaction Signing**
✅ **Multi-account Support**
✅ **Persistent Wallet Sessions**
✅ **Cyberpunk-themed Blockchain UI**

---

## 🎊 Ready to Build on Algorand!

Your application is now fully integrated with the Algorand blockchain. Start building decentralized features, manage digital assets, and explore the world of Web3!

**Test it now**: http://localhost:3000/algorand

Happy building! 🚀🔷
