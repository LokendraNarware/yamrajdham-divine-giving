-- Add last_verified_at column to user_donations table for caching payment verification
-- This helps avoid repeated external API calls to Cashfree

ALTER TABLE user_donations 
ADD COLUMN last_verified_at TIMESTAMPTZ DEFAULT NULL;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_donations_last_verified_at 
ON user_donations(last_verified_at);

-- Add comment for documentation
COMMENT ON COLUMN user_donations.last_verified_at IS 'Timestamp of last payment verification to avoid repeated external API calls';
