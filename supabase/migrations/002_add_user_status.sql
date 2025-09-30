-- Add status field to users table
ALTER TABLE users ADD COLUMN status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'pending'));

-- Add index for status field
CREATE INDEX idx_users_status ON users(status);

-- Update existing users to have active status
UPDATE users SET status = 'active' WHERE status IS NULL;
