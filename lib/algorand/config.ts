export const ALGORAND_CONFIG = {
  network: "testnet",
  nodeServer: "https://testnet-api.algonode.cloud",
  nodePort: "",
  nodeToken: "",
  indexerServer: "https://testnet-idx.algonode.cloud",
  indexerPort: "",
  indexerToken: "",
}

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
