/**
 * Task Tokenization Service
 * Converts email/calendar tasks into ARC-3 compliant Algorand ASAs
 */

import algosdk from 'algosdk';
import { getAlgodClient } from './client';
import { uploadToIPFS } from './ipfs';
import { hashEmail, resolveAddress } from './identity';

export interface TaskData {
  title: string;
  description: string;
  assigneeEmail: string;
  creatorEmail: string;
  source: 'email' | 'calendar';
  externalId: string;
  dueDate: string;
  priority: 'H' | 'M' | 'L';
  labels: string[];
}

export interface TaskMetadata {
  name: string;
  description: string;
  image?: string;
  properties: {
    source: 'email' | 'calendar';
    external_id: string;
    assignee_hash: string;
    creator_hash: string;
    status: 'open' | 'in_progress' | 'done';
    due: string;
    priority: 'H' | 'M' | 'L';
    labels: string[];
    created_at: string;
  };
}

export interface TokenizedTask {
  transactions: algosdk.Transaction[];
  metadata: TaskMetadata;
  cid: string;
  assigneeAddress: string;
  creatorAddress: string;
}

/**
 * Main tokenization function
 * Creates an atomic group: [ASA Create, App Call, ASA Transfer]
 */
export async function tokenizeTask(taskData: TaskData): Promise<TokenizedTask> {
  const algodClient = getAlgodClient();

  // 1. Hash emails for privacy (never store raw emails on-chain)
  const assigneeHash = hashEmail(taskData.assigneeEmail);
  const creatorHash = hashEmail(taskData.creatorEmail);

  // 2. Resolve Algorand addresses from off-chain mapping
  const assigneeAddr = await resolveAddress(assigneeHash);
  const creatorAddr = await resolveAddress(creatorHash);

  // 3. Build ARC-3 compliant metadata
  const metadata: TaskMetadata = {
    name: `TASK: ${taskData.title}`,
    description: taskData.description,
    properties: {
      source: taskData.source,
      external_id: taskData.externalId,
      assignee_hash: assigneeHash,
      creator_hash: creatorHash,
      status: 'open',
      due: taskData.dueDate,
      priority: taskData.priority,
      labels: taskData.labels,
      created_at: new Date().toISOString(),
    },
  };

  // 4. Upload metadata to IPFS
  const cid = await uploadToIPFS(metadata);
  const ipfsUrl = `ipfs://${cid}`;

  // 5. Calculate metadata hash for ARC-3 compliance using crypto
  const crypto = await import('crypto');
  const metadataBuffer = Buffer.from(JSON.stringify(metadata));
  const metadataHashBuffer = crypto.createHash('sha256').update(metadataBuffer as any).digest();
  const metadataHash = new Uint8Array(metadataHashBuffer);

  // 6. Get suggested transaction parameters
  const suggestedParams = await algodClient.getTransactionParams().do();

  // 7. Transaction 1: Create ASA (1-unit task token)
  const asaCreateTxn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
    sender: creatorAddr,
    total: 1, // Only 1 token per task
    decimals: 0, // Non-divisible
    defaultFrozen: false,
    unitName: 'TFLOW',
    assetName: 'Kortex Task',
    assetURL: ipfsUrl,
    assetMetadataHash: metadataHash,
    manager: creatorAddr,
    reserve: creatorAddr,
    freeze: undefined,
    clawback: undefined,
    suggestedParams,
  });

  // 8. Transaction 2: App call to create_task
  const appId = parseInt(process.env.NEXT_PUBLIC_ALGORAND_APP_ID || '0');
  if (!appId) {
    throw new Error('NEXT_PUBLIC_ALGORAND_APP_ID not configured');
  }

  const appCallTxn = algosdk.makeApplicationNoOpTxnFromObject({
    sender: creatorAddr,
    suggestedParams,
    appIndex: appId,
    appArgs: [
      new Uint8Array(Buffer.from('create_task')),
      new Uint8Array(Buffer.from(cid)),
      new Uint8Array(Buffer.from(assigneeHash)),
    ],
  });

  // Note: ASA transfer will be done separately after asset ID is known
  // In production, this requires a two-step process:
  // 1. Create ASA and get asset ID
  // 2. Create atomic group with App call + ASA transfer

  const transactions = [asaCreateTxn, appCallTxn];

  // Assign group ID for atomic execution
  algosdk.assignGroupID(transactions);

  return {
    transactions,
    metadata,
    cid,
    assigneeAddress: assigneeAddr,
    creatorAddress: creatorAddr,
  };
}

/**
 * Create ASA transfer transaction after asset is created
 */
export async function createAssetTransfer(
  assetId: number,
  from: string,
  to: string,
  amount: number = 1
): Promise<algosdk.Transaction> {
  const algodClient = getAlgodClient();
  const suggestedParams = await algodClient.getTransactionParams().do();

  return algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    sender: from,
    receiver: to,
    assetIndex: assetId,
    amount,
    suggestedParams,
  });
}

/**
 * Create asset opt-in transaction
 * Required before receiving an ASA
 */
export async function createAssetOptIn(
  address: string,
  assetId: number
): Promise<algosdk.Transaction> {
  const algodClient = getAlgodClient();
  const suggestedParams = await algodClient.getTransactionParams().do();

  return algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    sender: address,
    receiver: address, // Self-transfer for opt-in
    assetIndex: assetId,
    amount: 0,
    suggestedParams,
  });
}

/**
 * Complete tokenization flow with opt-in and transfer
 */
export async function tokenizeTaskComplete(
  taskData: TaskData,
  signCallback: (txns: algosdk.Transaction[]) => Promise<Uint8Array[]>
): Promise<{
  assetId: number;
  taskId: string;
  cid: string;
}> {
  // Step 1: Create ASA and register in app
  const { transactions, cid, assigneeAddress, creatorAddress } =
    await tokenizeTask(taskData);

  // Sign and send initial transactions
  const signedTxns = await signCallback(transactions);
  const algodClient = getAlgodClient();

  const response = await algodClient.sendRawTransaction(signedTxns).do();
  const txid = response.txid || (response as any).txId;
  const result = await algosdk.waitForConfirmation(algodClient, txid, 4);

  // Extract asset ID from transaction result
  const assetId = Number((result as any)['asset-index'] || result.assetIndex || 0);

  if (!assetId) {
    throw new Error('Asset creation failed');
  }

  // Step 2: Assignee opts into asset
  const optInTxn = await createAssetOptIn(assigneeAddress, assetId);
  const signedOptIn = await signCallback([optInTxn]);
  const optInResponse = await algodClient.sendRawTransaction(signedOptIn).do();
  const optInTxid = optInResponse.txid || (optInResponse as any).txId;
  await algosdk.waitForConfirmation(algodClient, optInTxid, 4);

  // Step 3: Transfer asset to assignee
  const transferTxn = await createAssetTransfer(
    assetId,
    creatorAddress,
    assigneeAddress
  );
  const signedTransfer = await signCallback([transferTxn]);
  const transferResponse = await algodClient.sendRawTransaction(signedTransfer).do();
  const transferTxid = transferResponse.txid || (transferResponse as any).txId;
  await algosdk.waitForConfirmation(algodClient, transferTxid, 4);

  return {
    assetId,
    taskId: `${assetId}`, // Use asset ID as task ID for simplicity
    cid,
  };
}

/**
 * Parse email content to extract task data
 */
export function parseEmailForTask(emailData: any): Partial<TaskData> {
  // Extract task information from email
  // This is a simplified version - implement your own parsing logic
  return {
    title: emailData.subject || 'Untitled Task',
    description: emailData.snippet || '',
    assigneeEmail: extractAssignee(emailData.body),
    creatorEmail: emailData.from,
    source: 'email',
    externalId: emailData.id,
    dueDate: extractDueDate(emailData.body) || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    priority: extractPriority(emailData.body) || 'M',
    labels: extractLabels(emailData.labelIds) || [],
  };
}

/**
 * Parse calendar event to extract task data
 */
export function parseEventForTask(eventData: any): Partial<TaskData> {
  return {
    title: eventData.summary || 'Untitled Task',
    description: eventData.description || '',
    assigneeEmail: extractEventAssignee(eventData.attendees),
    creatorEmail: eventData.organizer?.email,
    source: 'calendar',
    externalId: eventData.id,
    dueDate: eventData.start?.dateTime || new Date().toISOString(),
    priority: extractEventPriority(eventData.categories) || 'M',
    labels: eventData.categories || [],
  };
}

// Helper functions
function extractAssignee(body: string): string {
  // Look for patterns like "assign to: email@example.com" or "@email@example.com"
  const assigneeMatch = body?.match(/assign(?:ed)?\s+to:?\s+([\w.-]+@[\w.-]+\.\w+)/i);
  if (assigneeMatch) return assigneeMatch[1];

  const mentionMatch = body?.match(/@([\w.-]+@[\w.-]+\.\w+)/);
  if (mentionMatch) return mentionMatch[1];

  return ''; // Will need to be set manually
}

function extractDueDate(body: string): string | null {
  // Look for patterns like "due: 2025-11-15" or "deadline: Nov 15"
  const dateMatch = body?.match(/(?:due|deadline):?\s*(\d{4}-\d{2}-\d{2})/i);
  if (dateMatch) return new Date(dateMatch[1]).toISOString();

  return null;
}

function extractPriority(body: string): 'H' | 'M' | 'L' | null {
  if (body?.match(/\b(high|urgent|critical)\s+priority/i)) return 'H';
  if (body?.match(/\blow\s+priority/i)) return 'L';
  return 'M';
}

function extractLabels(labelIds?: string[]): string[] {
  if (!labelIds) return [];
  // Filter to only KortexFlow labels
  return labelIds
    .filter(label => label.startsWith('KortexFlow/'))
    .map(label => label.replace('KortexFlow/', ''));
}

function extractEventAssignee(attendees?: any[]): string {
  if (!attendees || attendees.length === 0) return '';
  // Return first non-organizer attendee
  const assignee = attendees.find(a => !a.organizer);
  return assignee?.email || attendees[0]?.email || '';
}

function extractEventPriority(categories?: string[]): 'H' | 'M' | 'L' | null {
  if (!categories) return null;
  if (categories.some(c => c.toLowerCase().includes('high'))) return 'H';
  if (categories.some(c => c.toLowerCase().includes('low'))) return 'L';
  return 'M';
}
