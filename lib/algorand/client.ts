import algosdk from 'algosdk'
import { AlgorandClient, Config } from '@algorandfoundation/algokit-utils'

// Network configuration
export const ALGORAND_NETWORK = process.env.NEXT_PUBLIC_ALGORAND_NETWORK || 'testnet'

// Algorand node configuration
const getAlgodConfig = () => {
    if (ALGORAND_NETWORK === 'mainnet') {
        return {
            server: process.env.NEXT_PUBLIC_ALGOD_SERVER || 'https://mainnet-api.algonode.cloud',
            port: '',
            token: '',
        }
    } else if (ALGORAND_NETWORK === 'testnet') {
        return {
            server: process.env.NEXT_PUBLIC_ALGOD_SERVER || 'https://testnet-api.algonode.cloud',
            port: '',
            token: '',
        }
    } else {
        // LocalNet / Sandbox
        return {
            server: process.env.NEXT_PUBLIC_ALGOD_SERVER || 'http://localhost',
            port: process.env.NEXT_PUBLIC_ALGOD_PORT || '4001',
            token: process.env.NEXT_PUBLIC_ALGOD_TOKEN || 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        }
    }
}

const getIndexerConfig = () => {
    if (ALGORAND_NETWORK === 'mainnet') {
        return {
            server: process.env.NEXT_PUBLIC_INDEXER_SERVER || 'https://mainnet-idx.algonode.cloud',
            port: '',
            token: '',
        }
    } else if (ALGORAND_NETWORK === 'testnet') {
        return {
            server: process.env.NEXT_PUBLIC_INDEXER_SERVER || 'https://testnet-idx.algonode.cloud',
            port: '',
            token: '',
        }
    } else {
        return {
            server: process.env.NEXT_PUBLIC_INDEXER_SERVER || 'http://localhost',
            port: process.env.NEXT_PUBLIC_INDEXER_PORT || '8980',
            token: process.env.NEXT_PUBLIC_INDEXER_TOKEN || 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        }
    }
}

// Initialize Algod client
export const getAlgodClient = () => {
    const config = getAlgodConfig()
    return new algosdk.Algodv2(config.token, config.server, config.port)
}

// Initialize Indexer client
export const getIndexerClient = () => {
    const config = getIndexerConfig()
    return new algosdk.Indexer(config.token, config.server, config.port)
}

// Initialize AlgoKit client
export const getAlgorandClient = () => {
    const algodConfig = getAlgodConfig()
    const indexerConfig = getIndexerConfig()

    return AlgorandClient.fromClients({
        algod: new algosdk.Algodv2(algodConfig.token, algodConfig.server, algodConfig.port),
        indexer: new algosdk.Indexer(indexerConfig.token, indexerConfig.server, indexerConfig.port),
    })
}

// Utility functions
export const formatAlgoAmount = (microAlgos: number | bigint): string => {
    return (Number(microAlgos) / 1_000_000).toFixed(6)
}

export const algoToMicroAlgos = (algos: number): number => {
    return Math.round(algos * 1_000_000)
}

export const isValidAddress = (address: string): boolean => {
    return algosdk.isValidAddress(address)
}

export const generateAccount = () => {
    return algosdk.generateAccount()
}

// Export algosdk for direct use
export { algosdk }
