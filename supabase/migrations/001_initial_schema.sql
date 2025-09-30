-- Yamrajdham Temple Divine Giving - Database Schema
-- Clean 3-table structure for temple donation management

-- 1. USERS TABLE - Temple devotees and donors
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  mobile VARCHAR(20) UNIQUE NOT NULL,
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  pin_code VARCHAR(10),
  country VARCHAR(100) DEFAULT 'India',
  pan_no VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. ADMIN TABLE - Temple administrators
CREATE TABLE admin (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  mobile VARCHAR(20) UNIQUE NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. USER_DONATIONS TABLE - All donation records
CREATE TABLE user_donations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  amount INTEGER NOT NULL,
  donation_type VARCHAR(50) DEFAULT 'general',
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_id VARCHAR(255),
  payment_gateway VARCHAR(50),
  receipt_number VARCHAR(100),
  is_anonymous BOOLEAN DEFAULT false,
  dedication_message TEXT,
  preacher_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_mobile ON users(mobile);
CREATE INDEX idx_admin_email ON admin(email);
CREATE INDEX idx_admin_mobile ON admin(mobile);
CREATE INDEX idx_user_donations_user_id ON user_donations(user_id);
CREATE INDEX idx_user_donations_payment_status ON user_donations(payment_status);
CREATE INDEX idx_user_donations_created_at ON user_donations(created_at);

-- Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_donations ENABLE ROW LEVEL SECURITY;

-- Public access policies
CREATE POLICY "Allow public read access to users" ON users FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access to users" ON users FOR UPDATE USING (true);

CREATE POLICY "Allow public read access to admin" ON admin FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to admin" ON admin FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access to admin" ON admin FOR UPDATE USING (true);

CREATE POLICY "Allow public read access to user_donations" ON user_donations FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to user_donations" ON user_donations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access to user_donations" ON user_donations FOR UPDATE USING (true);

-- Auto-update timestamps function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Auto-update triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admin_updated_at BEFORE UPDATE ON admin FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_donations_updated_at BEFORE UPDATE ON user_donations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
