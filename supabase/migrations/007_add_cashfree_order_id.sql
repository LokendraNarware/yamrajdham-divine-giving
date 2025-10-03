-- Add cashfree_order_id field to user_donations table for webhook lookup
-- This migration adds a field to store Cashfree's order ID for proper webhook processing

ALTER TABLE user_donations 
ADD COLUMN cashfree_order_id VARCHAR(255);

-- Add index for efficient webhook lookups
CREATE INDEX IF NOT EXISTS idx_user_donations_cashfree_order_id 
ON user_donations(cashfree_order_id);

-- Add comment for documentation
COMMENT ON COLUMN user_donations.cashfree_order_id IS 'Cashfree order ID for webhook processing and payment tracking';
