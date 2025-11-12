/**
 * Algorand Indexer Service
 * Query blockchain for user tasks and app state
 */

import { Indexer } from 'algosdk';
import { getIndexerClient } from './client';
import { fetchFromIPFS, fetchFromIPFSGateway } from './ipfs';
import { TaskMetadata } from './task-tokenizer';

export interface BlockchainTask extends TaskMetadata {
  assetId: number;
  owner: string;
  amount: number;
  isFrozen: boolean;
  createdAtRound: number;
}

/**
 * Get all tasks owned by a wallet address
 * Queries ASAs with unit-name = "TFLOW"
 */
export async function getUserTasks(
  walletAddress: string
): Promise<BlockchainTask[]> {
  const indexer = getIndexerClient();
  const tasks: BlockchainTask[] = [];

  try {
    // Query all assets owned by the address
    const accountInfo = await indexer.lookupAccountAssets(walletAddress).do();

    if (!accountInfo.assets || accountInfo.assets.length === 0) {
      return [];
    }

    // Filter for task tokens (TFLOW unit name)
    for (const asset of accountInfo.assets) {
      if (Number(asset.amount) !== 1) continue; // Tasks are 1-unit ASAs

      try {
        // Get asset details
        const assetInfo = await indexer.lookupAssetByID(asset.assetId).do();
        const params = assetInfo.asset.params;

        // Check if this is a Kortex task token
        if (params.unitName !== 'TFLOW') continue;

        // Fetch metadata from IPFS
        const ipfsUrl = params.url;
        if (!ipfsUrl) continue;

        const cid = ipfsUrl.replace('ipfs://', '');
        let metadata: TaskMetadata;

        try {
          metadata = await fetchFromIPFS(cid);
        } catch {
          // Fallback to HTTP gateway if IPFS node is unavailable
          metadata = await fetchFromIPFSGateway(cid);
        }

        tasks.push({
          ...metadata,
          assetId: Number(asset.assetId),
          owner: walletAddress,
          amount: Number(asset.amount),
          isFrozen: asset.isFrozen || false,
          createdAtRound: Number(assetInfo.asset.createdAtRound || 0),
        });
      } catch (error) {
        console.error(
          `Failed to fetch metadata for asset ${asset.assetId}:`,
          error
        );
        // Continue with other assets even if one fails
      }
    }

    return tasks;
  } catch (error) {
    console.error('Failed to fetch user tasks:', error);
    throw new Error(
      `Failed to fetch tasks: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Get task by asset ID
 */
export async function getTaskByAssetId(
  assetId: number
): Promise<BlockchainTask | null> {
  const indexer = getIndexerClient();

  try {
    const assetInfo = await indexer.lookupAssetByID(assetId).do();
    const params = assetInfo.asset.params;

    if (params.unitName !== 'TFLOW') {
      return null; // Not a task token
    }

    // Fetch metadata from IPFS
    const ipfsUrl = params.url;
    if (!ipfsUrl) return null;

    const cid = ipfsUrl.replace('ipfs://', '');
    let metadata: TaskMetadata;

    try {
      metadata = await fetchFromIPFS(cid);
    } catch {
      metadata = await fetchFromIPFSGateway(cid);
    }

    // Get current owner
    const balances = await indexer
      .lookupAssetBalances(assetId)
      .currencyGreaterThan(0)
      .do();

    const owner = balances.balances[0]?.address || '';

    return {
      ...metadata,
      assetId,
      owner,
      amount: 1,
      isFrozen: false,
      createdAtRound: Number(assetInfo.asset.createdAtRound || 0),
    };
  } catch (error) {
    console.error(`Failed to fetch task ${assetId}:`, error);
    return null;
  }
}

/**
 * Get tasks assigned to a specific email hash
 * Queries IPFS metadata to filter by assignee_hash
 */
export async function getTasksByAssigneeHash(
  assigneeHash: string
): Promise<BlockchainTask[]> {
  // This requires fetching all TFLOW assets and filtering by metadata
  // More efficient with an app state query if using App-only storage
  const indexer = getIndexerClient();

  try {
    // Search for all TFLOW assets
    const searchResults = await indexer
      .searchForAssets()
      .unit('TFLOW')
      .limit(1000)
      .do();

    const tasks: BlockchainTask[] = [];

    for (const asset of searchResults.assets) {
      try {
        const ipfsUrl = asset.params.url;
        if (!ipfsUrl) continue;

        const cid = ipfsUrl.replace('ipfs://', '');
        let metadata: TaskMetadata;

        try {
          metadata = await fetchFromIPFS(cid);
        } catch {
          metadata = await fetchFromIPFSGateway(cid);
        }

        // Filter by assignee hash
        if (metadata.properties.assignee_hash === assigneeHash) {
          // Get current owner
          const balances = await indexer
            .lookupAssetBalances(asset.index)
            .currencyGreaterThan(0)
            .do();

          const owner = balances.balances[0]?.address || '';

          tasks.push({
            ...metadata,
            assetId: Number(asset.index),
            owner,
            amount: 1,
            isFrozen: false,
            createdAtRound: Number(asset.createdAtRound || 0),
          });
        }
      } catch (error) {
        console.error(
          `Failed to process asset ${asset.index}:`,
          error
        );
      }
    }

    return tasks;
  } catch (error) {
    console.error('Failed to fetch tasks by assignee:', error);
    return [];
  }
}

/**
 * Get App box state (if using App-only storage)
 * Requires NEXT_PUBLIC_ALGORAND_APP_ID to be set
 */
export async function getAppBoxTasks(
  assigneeHash: string
): Promise<BlockchainTask[]> {
  const appId = parseInt(process.env.NEXT_PUBLIC_ALGORAND_APP_ID || '0');
  if (!appId) {
    throw new Error('NEXT_PUBLIC_ALGORAND_APP_ID not configured');
  }

  const indexer = getIndexerClient();

  try {
    // Query app boxes where key = assignee_hash
    // This is a simplified version - implement based on your app structure
    const appInfo = await indexer.lookupApplications(appId).do();

    // Parse box data - structure depends on your PyTeal implementation
    // Return tasks from box storage

    return []; // Implement based on your app schema
  } catch (error) {
    console.error('Failed to fetch app box tasks:', error);
    return [];
  }
}

/**
 * Get task ownership history (all transfers)
 */
export async function getTaskHistory(
  assetId: number
): Promise<
  Array<{
    sender: string;
    receiver: string;
    amount: number;
    round: number;
    timestamp: number;
    txId: string;
  }>
> {
  const indexer = getIndexerClient();

  try {
    const transactions = await indexer
      .searchForTransactions()
      .assetID(assetId)
      .txType('axfer') // Asset transfer
      .do();

    return transactions.transactions.map((txn: any) => ({
      sender: txn.sender,
      receiver: txn['asset-transfer-transaction'].receiver,
      amount: txn['asset-transfer-transaction'].amount,
      round: txn['confirmed-round'],
      timestamp: txn['round-time'],
      txId: txn.id,
    }));
  } catch (error) {
    console.error(`Failed to fetch task history for ${assetId}:`, error);
    return [];
  }
}

/**
 * Get all app calls for task lifecycle events
 */
export async function getTaskEvents(
  taskId: string
): Promise<
  Array<{
    type: 'create' | 'claim' | 'update_status' | 'reassign';
    sender: string;
    round: number;
    timestamp: number;
    txId: string;
    args?: any[];
  }>
> {
  const appId = parseInt(process.env.NEXT_PUBLIC_ALGORAND_APP_ID || '0');
  if (!appId) return [];

  const indexer = getIndexerClient();

  try {
    const transactions = await indexer
      .searchForTransactions()
      .applicationID(appId)
      .txType('appl') // App call
      .do();

    // Filter and parse app calls related to this task
    const events = transactions.transactions
      .filter((txn: any) => {
        // Check if task_id matches in app args
        const args = txn['application-transaction']['application-args'] || [];
        return args.some((arg: string) =>
          Buffer.from(arg, 'base64').toString().includes(taskId)
        );
      })
      .map((txn: any) => {
        const appArgs = txn['application-transaction']['application-args'] || [];
        const method = Buffer.from(appArgs[0], 'base64').toString();

        return {
          type: method as any,
          sender: txn.sender,
          round: txn['confirmed-round'],
          timestamp: txn['round-time'],
          txId: txn.id,
          args: appArgs.map((arg: string) =>
            Buffer.from(arg, 'base64').toString()
          ),
        };
      });

    return events;
  } catch (error) {
    console.error('Failed to fetch task events:', error);
    return [];
  }
}

/**
 * Get statistics for all tasks
 */
export async function getTaskStatistics(): Promise<{
  total: number;
  open: number;
  inProgress: number;
  done: number;
  bySource: { email: number; calendar: number };
  byPriority: { high: number; medium: number; low: number };
}> {
  const indexer = getIndexerClient();

  try {
    const searchResults = await indexer
      .searchForAssets()
      .unit('TFLOW')
      .limit(1000)
      .do();

    const stats = {
      total: 0,
      open: 0,
      inProgress: 0,
      done: 0,
      bySource: { email: 0, calendar: 0 },
      byPriority: { high: 0, medium: 0, low: 0 },
    };

    for (const asset of searchResults.assets) {
      try {
        const ipfsUrl = asset.params.url;
        if (!ipfsUrl) continue;

        const cid = ipfsUrl.replace('ipfs://', '');
        const metadata: TaskMetadata = await fetchFromIPFSGateway(cid);

        stats.total++;

        // Status
        switch (metadata.properties.status) {
          case 'open':
            stats.open++;
            break;
          case 'in_progress':
            stats.inProgress++;
            break;
          case 'done':
            stats.done++;
            break;
        }

        // Source
        if (metadata.properties.source === 'email') stats.bySource.email++;
        else stats.bySource.calendar++;

        // Priority
        switch (metadata.properties.priority) {
          case 'H':
            stats.byPriority.high++;
            break;
          case 'M':
            stats.byPriority.medium++;
            break;
          case 'L':
            stats.byPriority.low++;
            break;
        }
      } catch (error) {
        console.error(`Failed to process asset ${asset.index}`);
      }
    }

    return stats;
  } catch (error) {
    console.error('Failed to calculate statistics:', error);
    return {
      total: 0,
      open: 0,
      inProgress: 0,
      done: 0,
      bySource: { email: 0, calendar: 0 },
      byPriority: { high: 0, medium: 0, low: 0 },
    };
  }
}
