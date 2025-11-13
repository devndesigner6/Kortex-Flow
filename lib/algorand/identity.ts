/**
 * Identity Binding Service
 * Manages off-chain mapping: email_hash -> algorand_address
 * Implements "Sign-in with Algorand" flow
 */

import algosdk from 'algosdk';
import crypto from 'crypto';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabase = createClientComponentClient();

/**
 * Hash email address for privacy
 * Uses SHA-256 with per-tenant salt
 * 
 * NEVER store raw emails on-chain!
 */
export function hashEmail(email: string): string {
  const salt = process.env.EMAIL_HASH_SALT || 'default-salt-change-me';
  const normalized = email.toLowerCase().trim();
  const hash = crypto
    .createHash('sha256')
    .update(normalized + salt)
    .digest('hex');

  return hash;
}

/**
 * Generate a random nonce for sign-in challenge
 */
export function generateNonce(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Verify signature from Pera Wallet sign-in
 * 
 * @param walletAddress The Algorand address that signed
 * @param nonce The challenge nonce
 * @param signature The signature bytes
 * @returns True if signature is valid
 */
export function verifySignature(
  walletAddress: string,
  nonce: string,
  signature: Uint8Array
): boolean {
  try {
    const message = new Uint8Array(Buffer.from(nonce, 'utf-8'));
    const isValid = algosdk.verifyBytes(message, signature, walletAddress);
    return isValid;
  } catch (error) {
    console.error('Signature verification failed:', error);
    return false;
  }
}

/**
 * Sign in with Algorand wallet (WalletConnect + Pera)
 * 
 * Flow:
 * 1. Generate nonce
 * 2. User signs nonce with wallet
 * 3. Verify signature server-side
 * 4. Create mapping: email_hash -> algorand_address
 * 
 * @param email User's email address
 * @param walletAddress Algorand wallet address
 * @param signature Signed nonce from wallet
 * @param nonce Original challenge nonce
 */
export async function signInWithAlgorand(
  email: string,
  walletAddress: string,
  signature: Uint8Array,
  nonce: string
): Promise<{ success: boolean; emailHash?: string; error?: string }> {
  // 1. Verify signature
  const isValid = verifySignature(walletAddress, nonce, signature);

  if (!isValid) {
    return { success: false, error: 'Invalid signature' };
  }

  // 2. Hash email for privacy
  const emailHash = hashEmail(email);

  // 3. Store mapping in database
  try {
    const { data, error } = await supabase.from('address_mappings').upsert(
      {
        email_hash: emailHash,
        algorand_address: walletAddress,
        last_signed_in: new Date().toISOString(),
      },
      {
        onConflict: 'email_hash',
      }
    );

    if (error) {
      console.error('Database error:', error);
      return { success: false, error: 'Failed to store mapping' };
    }

    console.log(`✅ Linked wallet ${walletAddress} to email hash ${emailHash}`);
    return { success: true, emailHash };
  } catch (error) {
    console.error('Sign-in error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Resolve Algorand address from email hash
 * 
 * @param emailHash SHA-256 hash of email
 * @returns Algorand address or throws error
 */
export async function resolveAddress(emailHash: string): Promise<string> {
  try {
    const { data, error } = await supabase
      .from('address_mappings')
      .select('algorand_address')
      .eq('email_hash', emailHash)
      .single();

    if (error || !data) {
      throw new Error(`No wallet linked for email hash: ${emailHash}`);
    }

    return data.algorand_address;
  } catch (error) {
    console.error('Address resolution failed:', error);
    throw new Error(
      `Failed to resolve address: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Resolve email hash from Algorand address (reverse lookup)
 * 
 * @param algorandAddress Algorand wallet address
 * @returns Email hash or null
 */
export async function resolveEmailHash(
  algorandAddress: string
): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('address_mappings')
      .select('email_hash')
      .eq('algorand_address', algorandAddress)
      .single();

    if (error || !data) {
      return null;
    }

    return data.email_hash;
  } catch (error) {
    console.error('Email hash resolution failed:', error);
    return null;
  }
}

/**
 * Check if email is already linked to a wallet
 * 
 * @param email User's email address
 * @returns Algorand address if linked, null otherwise
 */
export async function getLinkedWallet(email: string): Promise<string | null> {
  const emailHash = hashEmail(email);

  try {
    const { data, error } = await supabase
      .from('address_mappings')
      .select('algorand_address')
      .eq('email_hash', emailHash)
      .single();

    if (error || !data) {
      return null;
    }

    return data.algorand_address;
  } catch (error) {
    console.error('Wallet lookup failed:', error);
    return null;
  }
}

/**
 * Unlink wallet from email
 * 
 * @param email User's email address
 */
export async function unlinkWallet(email: string): Promise<boolean> {
  const emailHash = hashEmail(email);

  try {
    const { error } = await supabase
      .from('address_mappings')
      .delete()
      .eq('email_hash', emailHash);

    if (error) {
      console.error('Unlink failed:', error);
      return false;
    }

    console.log(`✅ Unlinked wallet for email hash ${emailHash}`);
    return true;
  } catch (error) {
    console.error('Unlink error:', error);
    return false;
  }
}

/**
 * Get all wallet mappings (admin only)
 */
export async function getAllMappings(): Promise<
  Array<{ email_hash: string; algorand_address: string; last_signed_in: string }>
> {
  try {
    const { data, error } = await supabase
      .from('address_mappings')
      .select('*')
      .order('last_signed_in', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch mappings:', error);
    return [];
  }
}

/**
 * Validate Algorand address format
 */
export function isValidAlgorandAddress(address: string): boolean {
  try {
    algosdk.decodeAddress(address);
    return true;
  } catch {
    return false;
  }
}

/**
 * Create the database table for address mappings
 * Run this SQL in Supabase SQL Editor:
 */
export const ADDRESS_MAPPINGS_SCHEMA = `
CREATE TABLE IF NOT EXISTS address_mappings (
  email_hash VARCHAR(64) PRIMARY KEY,
  algorand_address VARCHAR(58) NOT NULL UNIQUE,
  last_signed_in TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_algorand_address ON address_mappings(algorand_address);
`;
