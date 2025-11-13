export type AlgorandNetwork = "testnet" | "mainnet"

export const NETWORK_CONFIGS = {
  testnet: {
    network: "testnet" as const,
    nodeServer: "https://testnet-api.algonode.cloud",
    nodePort: "",
    nodeToken: "",
    indexerServer: "https://testnet-idx.algonode.cloud",
    indexerPort: "",
    indexerToken: "",
    explorerUrl: "https://testnet.explorer.perawallet.app/tx",
  },
  mainnet: {
    network: "mainnet" as const,
    nodeServer: "https://mainnet-api.algonode.cloud",
    nodePort: "",
    nodeToken: "",
    indexerServer: "https://mainnet-idx.algonode.cloud",
    indexerPort: "",
    indexerToken: "",
    explorerUrl: "https://explorer.perawallet.app/tx",
  },
} as const

export const ALGORAND_CONFIG = NETWORK_CONFIGS.testnet

export const getNetworkConfig = (network: AlgorandNetwork) => {
  return NETWORK_CONFIGS[network]
}

// For demo: These are placeholder addresses. In production, replace with actual treasury wallets
export const TREASURY_WALLET = {
  testnet:
    process.env.NEXT_PUBLIC_TREASURY_WALLET_TESTNET || "HZ57J3K46JIJXILONBBZOHX6BKPXEM2VIYPCISHKRQ2UKNQXDKMNFB3P", // Example TestNet address
  mainnet: process.env.NEXT_PUBLIC_TREASURY_WALLET_MAINNET || "TREASURY_MAINNET_ADDRESS_HERE",
}

// Payment pricing in microAlgos (1 ALGO = 1,000,000 microAlgos)
export const FEATURE_PRICES = {
  aiTaskExtraction: 1000, // 0.001 ALGO
  aiResponseDrafting: 1000, // 0.001 ALGO
} as const

export const SUPPORTED_WALLETS = [
  {
    id: "pera",
    name: "PERA WALLET",
    description: "Simply the best Algorand wallet",
  },
  {
    id: "defly",
    name: "DEFLY WALLET",
    description: "Advanced Algorand wallet",
  },
] as const
