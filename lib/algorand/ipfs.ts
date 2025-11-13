/**
 * IPFS Service
 * Upload and retrieve task metadata using IPFS
 */

import type { IPFSHTTPClient } from 'ipfs-http-client';
import { create } from 'ipfs-http-client';

let ipfsClient: IPFSHTTPClient | null = null;

/**
 * Initialize IPFS client
 * Supports multiple providers: Infura, Pinata, Web3.Storage, local node
 */
function getIPFSClient(): IPFSHTTPClient {
  if (ipfsClient) return ipfsClient;

  const provider = process.env.IPFS_PROVIDER || 'infura';

  switch (provider) {
    case 'infura':
      const headers: any = {};
      if (process.env.INFURA_API_KEY && process.env.INFURA_PROJECT_ID && process.env.INFURA_API_SECRET) {
        headers.authorization = `Basic ${Buffer.from(
          `${process.env.INFURA_PROJECT_ID}:${process.env.INFURA_API_SECRET}`
        ).toString('base64')}`;
      }
      ipfsClient = create({
        host: 'ipfs.infura.io',
        port: 5001,
        protocol: 'https',
        headers,
      });
      break;

    case 'pinata':
      // Pinata uses a different API - implement if needed
      throw new Error('Pinata provider not yet implemented. Use Infura or local.');

    case 'web3storage':
      // Web3.Storage uses a different SDK - implement if needed
      throw new Error('Web3.Storage provider not yet implemented. Use Infura or local.');

    case 'local':
      ipfsClient = create({
        host: process.env.IPFS_HOST || 'localhost',
        port: parseInt(process.env.IPFS_PORT || '5001'),
        protocol: process.env.IPFS_PROTOCOL || 'http',
      });
      break;

    default:
      // Default to Infura public gateway
      ipfsClient = create({
        host: 'ipfs.infura.io',
        port: 5001,
        protocol: 'https',
      });
  }

  return ipfsClient;
}

/**
 * Upload JSON metadata to IPFS
 * @param metadata Task metadata object
 * @returns IPFS CID (Content Identifier)
 */
export async function uploadToIPFS(metadata: any): Promise<string> {
  try {
    const client = getIPFSClient();
    const buffer = Buffer.from(JSON.stringify(metadata, null, 2));

    const result = await client.add(buffer, {
      pin: true, // Pin to prevent garbage collection
      cidVersion: 1, // Use CIDv1 for better compatibility
    });

    console.log(`✅ Uploaded to IPFS: ${result.cid.toString()}`);
    return result.cid.toString();
  } catch (error) {
    console.error('❌ IPFS upload failed:', error);
    throw new Error(`IPFS upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Fetch JSON metadata from IPFS
 * @param cid IPFS Content Identifier
 * @returns Parsed JSON object
 */
export async function fetchFromIPFS(cid: string): Promise<any> {
  try {
    const client = getIPFSClient();
    const chunks: Uint8Array[] = [];

    for await (const chunk of client.cat(cid)) {
      chunks.push(chunk);
    }

    const data = Buffer.concat(chunks).toString('utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`❌ IPFS fetch failed for CID ${cid}:`, error);
    throw new Error(`IPFS fetch failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Fetch metadata from IPFS via HTTP gateway (fallback)
 * Useful when IPFS node is not available
 */
export async function fetchFromIPFSGateway(cid: string): Promise<any> {
  const gateways = [
    `https://ipfs.io/ipfs/${cid}`,
    `https://gateway.pinata.cloud/ipfs/${cid}`,
    `https://cloudflare-ipfs.com/ipfs/${cid}`,
    `https://dweb.link/ipfs/${cid}`,
  ];

  for (const gateway of gateways) {
    try {
      const response = await fetch(gateway, {
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn(`Gateway ${gateway} failed, trying next...`);
    }
  }

  throw new Error(`All IPFS gateways failed for CID: ${cid}`);
}

/**
 * Pin existing CID to prevent garbage collection
 */
export async function pinCID(cid: string): Promise<void> {
  try {
    const client = getIPFSClient();
    await client.pin.add(cid);
    console.log(`✅ Pinned CID: ${cid}`);
  } catch (error) {
    console.error(`❌ Pin failed for CID ${cid}:`, error);
    throw new Error(`Pin failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Unpin CID to allow garbage collection
 */
export async function unpinCID(cid: string): Promise<void> {
  try {
    const client = getIPFSClient();
    await client.pin.rm(cid);
    console.log(`✅ Unpinned CID: ${cid}`);
  } catch (error) {
    console.error(`❌ Unpin failed for CID ${cid}:`, error);
    throw new Error(`Unpin failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get IPFS gateway URL for a CID
 */
export function getIPFSUrl(cid: string): string {
  const gateway = process.env.IPFS_GATEWAY || 'https://ipfs.io';
  return `${gateway}/ipfs/${cid}`;
}

/**
 * Convert ipfs:// URI to HTTP gateway URL
 */
export function ipfsToHttp(ipfsUri: string): string {
  if (!ipfsUri.startsWith('ipfs://')) {
    return ipfsUri;
  }

  const cid = ipfsUri.replace('ipfs://', '');
  return getIPFSUrl(cid);
}

/**
 * Check if IPFS service is available
 */
export async function checkIPFSConnection(): Promise<boolean> {
  try {
    const client = getIPFSClient();
    const version = await client.version();
    console.log(`✅ Connected to IPFS: ${version.version}`);
    return true;
  } catch (error) {
    console.error('❌ IPFS connection failed:', error);
    return false;
  }
}
