-- ===================================================
-- Algorand Task Tokenization Database Schema
-- ===================================================
-- Run this in Supabase SQL Editor

-- ===================================================
-- 1. ADDRESS MAPPINGS TABLE
-- Stores off-chain mapping: email_hash -> algorand_address
-- Enables "Sign-in with Algorand" flow
-- ===================================================

CREATE TABLE IF NOT EXISTS address_mappings (
  email_hash VARCHAR(64) PRIMARY KEY,
  algorand_address VARCHAR(58) NOT NULL UNIQUE,
  last_signed_in TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT valid_email_hash CHECK (length(email_hash) = 64),
  CONSTRAINT valid_algorand_address CHECK (length(algorand_address) = 58)
);

COMMENT ON TABLE address_mappings IS 'Maps SHA-256 email hashes to Algorand wallet addresses for privacy-preserving identity binding';
COMMENT ON COLUMN address_mappings.email_hash IS 'SHA-256 hash of lowercase(email) + per-tenant-salt';
COMMENT ON COLUMN address_mappings.algorand_address IS 'Base32-encoded Algorand wallet address (58 characters)';

CREATE INDEX IF NOT EXISTS idx_algorand_address ON address_mappings(algorand_address);
CREATE INDEX IF NOT EXISTS idx_last_signed_in ON address_mappings(last_signed_in DESC);

-- ===================================================
-- 2. TASK MAPPINGS TABLE
-- Off-chain index for blockchain tasks
-- Links external IDs (Gmail/Calendar) to on-chain assets
-- ===================================================

CREATE TABLE IF NOT EXISTS task_mappings (
  task_id BIGINT PRIMARY KEY,
  external_id VARCHAR(255) NOT NULL,
  source VARCHAR(20) NOT NULL CHECK (source IN ('email', 'calendar')),
  cid VARCHAR(100) NOT NULL,
  asset_id BIGINT,
  creator_email_hash VARCHAR(64),
  assignee_email_hash VARCHAR(64),
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'done')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE task_mappings IS 'Off-chain index for Algorand task tokens (ASAs) with external system references';
COMMENT ON COLUMN task_mappings.task_id IS 'Unique task identifier (matches asset ID for ASA-based tasks)';
COMMENT ON COLUMN task_mappings.external_id IS 'Gmail message ID or Microsoft Graph event ID';
COMMENT ON COLUMN task_mappings.source IS 'Origin system: email or calendar';
COMMENT ON COLUMN task_mappings.cid IS 'IPFS Content Identifier for ARC-3 metadata JSON';
COMMENT ON COLUMN task_mappings.asset_id IS 'Algorand ASA (asset) ID for this task token';

CREATE INDEX IF NOT EXISTS idx_external_id ON task_mappings(external_id);
CREATE INDEX IF NOT EXISTS idx_asset_id ON task_mappings(asset_id);
CREATE INDEX IF NOT EXISTS idx_cid ON task_mappings(cid);
CREATE INDEX IF NOT EXISTS idx_assignee_email_hash ON task_mappings(assignee_email_hash);
CREATE INDEX IF NOT EXISTS idx_status ON task_mappings(status);
CREATE INDEX IF NOT EXISTS idx_source ON task_mappings(source);

-- ===================================================
-- 3. TASK EVENTS TABLE
-- Audit log for task lifecycle events
-- ===================================================

CREATE TABLE IF NOT EXISTS task_events (
  id BIGSERIAL PRIMARY KEY,
  task_id BIGINT NOT NULL,
  event_type VARCHAR(20) NOT NULL CHECK (event_type IN ('create', 'claim', 'update_status', 'reassign', 'complete')),
  actor_address VARCHAR(58) NOT NULL,
  actor_email_hash VARCHAR(64),
  transaction_id VARCHAR(52),
  round_number BIGINT,
  old_value TEXT,
  new_value TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE task_events IS 'Audit log for task lifecycle events from blockchain';
COMMENT ON COLUMN task_events.transaction_id IS 'Algorand transaction ID (base32-encoded)';
COMMENT ON COLUMN task_events.round_number IS 'Algorand blockchain round number';

CREATE INDEX IF NOT EXISTS idx_task_events_task_id ON task_events(task_id);
CREATE INDEX IF NOT EXISTS idx_task_events_type ON task_events(event_type);
CREATE INDEX IF NOT EXISTS idx_task_events_actor ON task_events(actor_address);
CREATE INDEX IF NOT EXISTS idx_task_events_created_at ON task_events(created_at DESC);

-- ===================================================
-- 4. TRIGGER: Update task_mappings.updated_at
-- ===================================================

CREATE OR REPLACE FUNCTION update_task_mappings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER task_mappings_updated_at
BEFORE UPDATE ON task_mappings
FOR EACH ROW
EXECUTE FUNCTION update_task_mappings_updated_at();

-- ===================================================
-- 5. ROW LEVEL SECURITY (RLS)
-- Enable for multi-tenant security
-- ===================================================

-- Enable RLS on all tables
ALTER TABLE address_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_events ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own address mapping
CREATE POLICY address_mappings_select_policy ON address_mappings
FOR SELECT
USING (auth.uid()::text = ANY(
  SELECT user_id::text FROM profiles WHERE email_hash = address_mappings.email_hash
));

-- Policy: Users can insert their own address mapping
CREATE POLICY address_mappings_insert_policy ON address_mappings
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Policy: Users can update their own address mapping
CREATE POLICY address_mappings_update_policy ON address_mappings
FOR UPDATE
USING (auth.uid()::text = ANY(
  SELECT user_id::text FROM profiles WHERE email_hash = address_mappings.email_hash
));

-- Policy: Users can read tasks assigned to them
CREATE POLICY task_mappings_select_policy ON task_mappings
FOR SELECT
USING (
  assignee_email_hash IN (
    SELECT email_hash FROM address_mappings
    WHERE auth.uid()::text = ANY(
      SELECT user_id::text FROM profiles WHERE email_hash = address_mappings.email_hash
    )
  )
  OR creator_email_hash IN (
    SELECT email_hash FROM address_mappings
    WHERE auth.uid()::text = ANY(
      SELECT user_id::text FROM profiles WHERE email_hash = address_mappings.email_hash
    )
  )
);

-- Policy: Service role can insert tasks (from webhooks)
CREATE POLICY task_mappings_insert_policy ON task_mappings
FOR INSERT
WITH CHECK (true); -- Restrict to service_role in app logic

-- Policy: Users can read events for their tasks
CREATE POLICY task_events_select_policy ON task_events
FOR SELECT
USING (
  task_id IN (
    SELECT task_id FROM task_mappings
    WHERE assignee_email_hash IN (
      SELECT email_hash FROM address_mappings
      WHERE auth.uid()::text = ANY(
        SELECT user_id::text FROM profiles WHERE email_hash = address_mappings.email_hash
      )
    )
  )
);

-- ===================================================
-- 6. SAMPLE QUERIES (for testing)
-- ===================================================

-- Get user's linked wallet
-- SELECT algorand_address FROM address_mappings WHERE email_hash = 'user_email_hash';

-- Get all tasks assigned to a wallet
-- SELECT * FROM task_mappings WHERE assignee_email_hash = 'assignee_hash' ORDER BY created_at DESC;

-- Get task history (events)
-- SELECT * FROM task_events WHERE task_id = 12345 ORDER BY created_at DESC;

-- Count tasks by status
-- SELECT status, COUNT(*) FROM task_mappings GROUP BY status;

-- Recent task activity
-- SELECT t.task_id, t.external_id, t.source, e.event_type, e.created_at
-- FROM task_mappings t
-- JOIN task_events e ON t.task_id = e.task_id
-- ORDER BY e.created_at DESC
-- LIMIT 20;

-- ===================================================
-- 7. CLEANUP (if needed)
-- ===================================================

-- DROP TABLE IF EXISTS task_events CASCADE;
-- DROP TABLE IF EXISTS task_mappings CASCADE;
-- DROP TABLE IF EXISTS address_mappings CASCADE;
-- DROP FUNCTION IF EXISTS update_task_mappings_updated_at CASCADE;
