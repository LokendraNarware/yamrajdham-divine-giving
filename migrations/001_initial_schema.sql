-- Migration: 001_initial_schema.sql
-- Description: Initial database schema for Yamrajdham Temple Divine Giving platform
-- Created: 2024-12-28

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
DO $$ BEGIN
    CREATE TYPE donation_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_method AS ENUM ('upi', 'card', 'netbanking', 'wallet', 'other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE prayer_type AS ENUM ('general', 'special', 'havan', 'group');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE prayer_status AS ENUM ('submitted', 'in_progress', 'completed', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE milestone_status AS ENUM ('planned', 'in_progress', 'completed', 'delayed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE data_type AS ENUM ('string', 'number', 'boolean', 'json');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Donors table
CREATE TABLE IF NOT EXISTS donors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    mobile VARCHAR(15) NOT NULL,
    country VARCHAR(100) DEFAULT 'India',
    state VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    pin_code VARCHAR(10) NOT NULL,
    address TEXT NOT NULL,
    pan_no VARCHAR(10),
    preacher_name VARCHAR(255),
    is_anonymous BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Donation categories table
CREATE TABLE IF NOT EXISTS donation_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    suggested_amount INTEGER,
    icon VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default donation categories (only if not exist)
INSERT INTO donation_categories (name, description, suggested_amount, icon, sort_order) 
SELECT * FROM (VALUES
    ('Shree Krishna Seva', 'Support daily worship and offerings', 501, 'flower', 1),
    ('Temple Construction', 'Help build the main temple structure', 1001, 'building', 2),
    ('Dharma Shala', 'Contribute to devotee accommodation', 2501, 'users', 3),
    ('Library & Education', 'Support spiritual learning center', 5001, 'book-open', 4),
    ('Golden Kalash', 'Sponsor temple dome decoration', 11001, 'crown', 5),
    ('Maha Donation', 'Major contribution for overall development', 51001, 'heart', 6)
) AS v(name, description, suggested_amount, icon, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM donation_categories WHERE name = v.name);

-- Donations table
CREATE TABLE IF NOT EXISTS donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    donor_id UUID REFERENCES donors(id) ON DELETE SET NULL,
    category_id UUID REFERENCES donation_categories(id),
    amount INTEGER NOT NULL CHECK (amount > 0),
    custom_amount INTEGER,
    donation_type VARCHAR(100),
    status donation_status DEFAULT 'pending',
    payment_method payment_method,
    payment_id VARCHAR(255),
    message TEXT,
    is_anonymous BOOLEAN DEFAULT FALSE,
    receipt_number VARCHAR(50),
    tax_deductible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Prayer requests table
CREATE TABLE IF NOT EXISTS prayer_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    donor_id UUID REFERENCES donors(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    prayer_type prayer_type DEFAULT 'general',
    prayer_text TEXT NOT NULL,
    amount INTEGER DEFAULT 0,
    status prayer_status DEFAULT 'submitted',
    is_anonymous BOOLEAN DEFAULT FALSE,
    special_instructions TEXT,
    scheduled_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Construction milestones table
CREATE TABLE IF NOT EXISTS construction_milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    target_date DATE,
    completion_date DATE,
    status milestone_status DEFAULT 'planned',
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    estimated_cost INTEGER,
    actual_cost INTEGER,
    image_url VARCHAR(500),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default construction milestones (only if not exist)
INSERT INTO construction_milestones (name, description, target_date, status, progress_percentage, sort_order)
SELECT * FROM (VALUES
    ('Foundation', 'Temple foundation and base structure', '2024-01-31', 'completed', 100, 1),
    ('Structure', 'Main temple structure and walls', '2024-06-30', 'completed', 100, 2),
    ('Roof & Domes', 'Traditional domes and roof construction', '2024-12-31', 'in_progress', 65, 3),
    ('Interior', 'Interior decoration and sanctum setup', '2025-06-30', 'planned', 0, 4),
    ('Final Touches', 'Landscaping and final decorations', '2025-09-30', 'planned', 0, 5)
) AS v(name, description, target_date, status, progress_percentage, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM construction_milestones WHERE name = v.name);

-- Project settings table
CREATE TABLE IF NOT EXISTS project_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    data_type data_type DEFAULT 'string',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default project settings (only if not exist)
INSERT INTO project_settings (key, value, description, data_type)
SELECT * FROM (VALUES
    ('funding_goal', '5000000', 'Total funding goal in rupees', 'number'),
    ('current_funding', '3250000', 'Current funding amount in rupees', 'number'),
    ('donor_count', '1247', 'Total number of donors', 'number'),
    ('days_left', '180', 'Days remaining for funding campaign', 'number'),
    ('temple_name', 'Yamrajdham Temple', 'Name of the temple being constructed', 'string'),
    ('contact_phone', '+91 98765 43210', 'Temple contact phone number', 'string'),
    ('contact_email', 'info@yamrajdham.org', 'Temple contact email', 'string'),
    ('temple_address', 'Temple Grounds, Sacred City', 'Temple location address', 'string'),
    ('pan_required_threshold', '10000', 'PAN required for donations above this amount', 'number'),
    ('tax_exemption_available', 'true', 'Whether tax exemption is available', 'boolean')
) AS v(key, value, description, data_type)
WHERE NOT EXISTS (SELECT 1 FROM project_settings WHERE key = v.key);

-- Prayer schedule table
CREATE TABLE IF NOT EXISTS prayer_schedule (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prayer_name VARCHAR(255) NOT NULL,
    time TIME NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default prayer schedule (only if not exist)
INSERT INTO prayer_schedule (prayer_name, time, description, sort_order)
SELECT * FROM (VALUES
    ('Morning Aarti', '06:00:00', 'Daily morning worship ceremony', 1),
    ('Special Prayers', '12:00:00', 'Midday special prayer session', 2),
    ('Evening Aarti', '19:00:00', 'Daily evening worship ceremony', 3),
    ('Night Prayer', '21:00:00', 'Evening prayer and meditation', 4)
) AS v(prayer_name, time, description, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM prayer_schedule WHERE prayer_name = v.prayer_name);

-- Recent prayers display table
CREATE TABLE IF NOT EXISTS recent_prayers_display (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prayer_text TEXT NOT NULL,
    donor_name VARCHAR(255) DEFAULT 'Anonymous',
    prayer_type prayer_type DEFAULT 'general',
    is_featured BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample recent prayers (only if not exist)
INSERT INTO recent_prayers_display (prayer_text, donor_name, prayer_type, display_order)
SELECT * FROM (VALUES
    ('For good health and prosperity of family', 'Anonymous', 'general', 1),
    ('Success in new business venture', 'Devotee from Mumbai', 'special', 2),
    ('Safe journey and return of son', 'Mother from Delhi', 'general', 3),
    ('Peace and happiness for all', 'Ram Kumar', 'general', 4),
    ('Recovery from illness', 'Sunita Devi', 'special', 5)
) AS v(prayer_text, donor_name, prayer_type, display_order)
WHERE NOT EXISTS (SELECT 1 FROM recent_prayers_display WHERE prayer_text = v.prayer_text);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_donors_email ON donors(email);
CREATE INDEX IF NOT EXISTS idx_donors_mobile ON donors(mobile);
CREATE INDEX IF NOT EXISTS idx_donations_donor_id ON donations(donor_id);
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON donations(created_at);
CREATE INDEX IF NOT EXISTS idx_prayer_requests_donor_id ON prayer_requests(donor_id);
CREATE INDEX IF NOT EXISTS idx_prayer_requests_status ON prayer_requests(status);
CREATE INDEX IF NOT EXISTS idx_prayer_requests_created_at ON prayer_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_milestones_status ON construction_milestones(status);
CREATE INDEX IF NOT EXISTS idx_milestones_sort_order ON construction_milestones(sort_order);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_donors_updated_at ON donors;
CREATE TRIGGER update_donors_updated_at BEFORE UPDATE ON donors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_donations_updated_at ON donations;
CREATE TRIGGER update_donations_updated_at BEFORE UPDATE ON donations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_prayer_requests_updated_at ON prayer_requests;
CREATE TRIGGER update_prayer_requests_updated_at BEFORE UPDATE ON prayer_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_milestones_updated_at ON construction_milestones;
CREATE TRIGGER update_milestones_updated_at BEFORE UPDATE ON construction_milestones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_settings_updated_at ON project_settings;
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON project_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_requests ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Donation categories are publicly readable" ON donation_categories;
DROP POLICY IF EXISTS "Construction milestones are publicly readable" ON construction_milestones;
DROP POLICY IF EXISTS "Project settings are publicly readable" ON project_settings;
DROP POLICY IF EXISTS "Prayer schedule is publicly readable" ON prayer_schedule;
DROP POLICY IF EXISTS "Recent prayers display is publicly readable" ON recent_prayers_display;
DROP POLICY IF EXISTS "Anyone can create donor records" ON donors;
DROP POLICY IF EXISTS "Anyone can create donation records" ON donations;
DROP POLICY IF EXISTS "Anyone can create prayer requests" ON prayer_requests;
DROP POLICY IF EXISTS "Donors can read their own records" ON donors;
DROP POLICY IF EXISTS "Donors can read their own donations" ON donations;
DROP POLICY IF EXISTS "Donors can read their own prayer requests" ON prayer_requests;

-- Allow public read access to donation categories
CREATE POLICY "Donation categories are publicly readable" ON donation_categories FOR SELECT USING (true);

-- Allow public read access to construction milestones
CREATE POLICY "Construction milestones are publicly readable" ON construction_milestones FOR SELECT USING (true);

-- Allow public read access to project settings
CREATE POLICY "Project settings are publicly readable" ON project_settings FOR SELECT USING (true);

-- Allow public read access to prayer schedule
CREATE POLICY "Prayer schedule is publicly readable" ON prayer_schedule FOR SELECT USING (true);

-- Allow public read access to recent prayers display
CREATE POLICY "Recent prayers display is publicly readable" ON recent_prayers_display FOR SELECT USING (true);

-- Allow public insert for donors (donation form)
CREATE POLICY "Anyone can create donor records" ON donors FOR INSERT WITH CHECK (true);

-- Allow public insert for donations
CREATE POLICY "Anyone can create donation records" ON donations FOR INSERT WITH CHECK (true);

-- Allow public insert for prayer requests
CREATE POLICY "Anyone can create prayer requests" ON prayer_requests FOR INSERT WITH CHECK (true);

-- Allow donors to read their own records (simplified for now)
CREATE POLICY "Donors can read their own records" ON donors FOR SELECT USING (true);

-- Allow donors to read their own donations (simplified for now)
CREATE POLICY "Donors can read their own donations" ON donations FOR SELECT USING (true);

-- Allow donors to read their own prayer requests (simplified for now)
CREATE POLICY "Donors can read their own prayer requests" ON prayer_requests FOR SELECT USING (true);

-- Create views for common queries
DROP VIEW IF EXISTS donation_summary;
CREATE VIEW donation_summary AS
SELECT 
    dc.name as category_name,
    COUNT(d.id) as total_donations,
    SUM(d.amount) as total_amount,
    AVG(d.amount) as average_amount,
    MAX(d.amount) as max_amount,
    MIN(d.amount) as min_amount
FROM donation_categories dc
LEFT JOIN donations d ON dc.id = d.category_id AND d.status = 'completed'
GROUP BY dc.id, dc.name, dc.sort_order
ORDER BY dc.sort_order;

DROP VIEW IF EXISTS funding_progress;
CREATE VIEW funding_progress AS
SELECT 
    (SELECT value::integer FROM project_settings WHERE key = 'funding_goal') as total_goal,
    (SELECT value::integer FROM project_settings WHERE key = 'current_funding') as current_amount,
    COUNT(DISTINCT donor_id) as total_donors,
    COUNT(*) as total_donations,
    AVG(amount) as average_donation
FROM donations 
WHERE status = 'completed';

DROP VIEW IF EXISTS recent_donations;
CREATE VIEW recent_donations AS
SELECT 
    d.id,
    d.amount,
    d.created_at,
    CASE 
        WHEN d.is_anonymous OR donor.is_anonymous THEN 'Anonymous'
        ELSE donor.name
    END as donor_name,
    dc.name as category_name,
    d.message
FROM donations d
LEFT JOIN donors donor ON d.donor_id = donor.id
LEFT JOIN donation_categories dc ON d.category_id = dc.id
WHERE d.status = 'completed'
ORDER BY d.created_at DESC
LIMIT 10;

-- Create functions for common operations
CREATE OR REPLACE FUNCTION get_total_donations()
RETURNS INTEGER AS $$
BEGIN
    RETURN COALESCE((SELECT SUM(amount) FROM donations WHERE status = 'completed'), 0);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_total_donors()
RETURNS INTEGER AS $$
BEGIN
    RETURN COALESCE((SELECT COUNT(DISTINCT donor_id) FROM donations WHERE status = 'completed'), 0);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_funding_progress()
RETURNS VOID AS $$
DECLARE
    total_funding INTEGER;
    total_donors INTEGER;
BEGIN
    SELECT get_total_donations() INTO total_funding;
    SELECT get_total_donors() INTO total_donors;
    
    UPDATE project_settings SET value = total_funding::text WHERE key = 'current_funding';
    UPDATE project_settings SET value = total_donors::text WHERE key = 'donor_count';
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to update funding progress when donations are completed
CREATE OR REPLACE FUNCTION trigger_update_funding_progress()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        PERFORM update_funding_progress();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS donations_update_funding_progress ON donations;
CREATE TRIGGER donations_update_funding_progress
    AFTER UPDATE ON donations
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_funding_progress();
