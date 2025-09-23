-- Yamrajdham Temple Divine Giving Database Schema
-- This schema supports temple donations, prayer requests, and construction progress tracking

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE donation_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE payment_method AS ENUM ('upi', 'card', 'netbanking', 'wallet', 'other');
CREATE TYPE prayer_type AS ENUM ('general', 'special', 'havan', 'group');
CREATE TYPE prayer_status AS ENUM ('submitted', 'in_progress', 'completed', 'rejected');
CREATE TYPE milestone_status AS ENUM ('planned', 'in_progress', 'completed', 'delayed');

-- Donors table - stores donor information
CREATE TABLE donors (
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
CREATE TABLE donation_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    suggested_amount INTEGER,
    icon VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default donation categories
INSERT INTO donation_categories (name, description, suggested_amount, icon, sort_order) VALUES
('Shree Krishna Seva', 'Support daily worship and offerings', 501, 'flower', 1),
('Temple Construction', 'Help build the main temple structure', 1001, 'building', 2),
('Dharma Shala', 'Contribute to devotee accommodation', 2501, 'users', 3),
('Library & Education', 'Support spiritual learning center', 5001, 'book-open', 4),
('Golden Kalash', 'Sponsor temple dome decoration', 11001, 'crown', 5),
('Maha Donation', 'Major contribution for overall development', 51001, 'heart', 6);

-- Donations table
CREATE TABLE donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    donor_id UUID REFERENCES donors(id) ON DELETE SET NULL,
    category_id UUID REFERENCES donation_categories(id),
    amount INTEGER NOT NULL CHECK (amount > 0),
    custom_amount INTEGER,
    donation_type VARCHAR(100), -- 'quick', 'category', 'custom'
    status donation_status DEFAULT 'pending',
    payment_method payment_method,
    payment_id VARCHAR(255), -- Payment gateway transaction ID
    message TEXT,
    is_anonymous BOOLEAN DEFAULT FALSE,
    receipt_number VARCHAR(50),
    tax_deductible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Prayer requests table
CREATE TABLE prayer_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    donor_id UUID REFERENCES donors(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    prayer_type prayer_type DEFAULT 'general',
    prayer_text TEXT NOT NULL,
    amount INTEGER DEFAULT 0, -- 0 for free prayers
    status prayer_status DEFAULT 'submitted',
    is_anonymous BOOLEAN DEFAULT FALSE,
    special_instructions TEXT,
    scheduled_date DATE, -- For special prayers/havan
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Construction milestones table
CREATE TABLE construction_milestones (
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

-- Insert default construction milestones
INSERT INTO construction_milestones (name, description, target_date, status, progress_percentage, sort_order) VALUES
('Foundation', 'Temple foundation and base structure', '2024-01-31', 'completed', 100, 1),
('Structure', 'Main temple structure and walls', '2024-06-30', 'completed', 100, 2),
('Roof & Domes', 'Traditional domes and roof construction', '2024-12-31', 'in_progress', 65, 3),
('Interior', 'Interior decoration and sanctum setup', '2025-06-30', 'planned', 0, 4),
('Final Touches', 'Landscaping and final decorations', '2025-09-30', 'planned', 0, 5);

-- Project settings table for dynamic configuration
CREATE TABLE project_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    data_type VARCHAR(20) DEFAULT 'string', -- 'string', 'number', 'boolean', 'json'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default project settings
INSERT INTO project_settings (key, value, description, data_type) VALUES
('funding_goal', '5000000', 'Total funding goal in rupees', 'number'),
('current_funding', '3250000', 'Current funding amount in rupees', 'number'),
('donor_count', '1247', 'Total number of donors', 'number'),
('days_left', '180', 'Days remaining for funding campaign', 'number'),
('temple_name', 'Yamrajdham Temple', 'Name of the temple being constructed', 'string'),
('contact_phone', '+91 98765 43210', 'Temple contact phone number', 'string'),
('contact_email', 'info@yamrajdham.org', 'Temple contact email', 'string'),
('temple_address', 'Temple Grounds, Sacred City', 'Temple location address', 'string'),
('pan_required_threshold', '10000', 'PAN required for donations above this amount', 'number'),
('tax_exemption_available', 'true', 'Whether tax exemption is available', 'boolean');

-- Prayer schedule table
CREATE TABLE prayer_schedule (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prayer_name VARCHAR(255) NOT NULL,
    time TIME NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default prayer schedule
INSERT INTO prayer_schedule (prayer_name, time, description, sort_order) VALUES
('Morning Aarti', '06:00:00', 'Daily morning worship ceremony', 1),
('Special Prayers', '12:00:00', 'Midday special prayer session', 2),
('Evening Aarti', '19:00:00', 'Daily evening worship ceremony', 3),
('Night Prayer', '21:00:00', 'Evening prayer and meditation', 4);

-- Recent prayers display table (for public display)
CREATE TABLE recent_prayers_display (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prayer_text TEXT NOT NULL,
    donor_name VARCHAR(255) DEFAULT 'Anonymous',
    prayer_type prayer_type DEFAULT 'general',
    is_featured BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample recent prayers
INSERT INTO recent_prayers_display (prayer_text, donor_name, prayer_type, display_order) VALUES
('For good health and prosperity of family', 'Anonymous', 'general', 1),
('Success in new business venture', 'Devotee from Mumbai', 'special', 2),
('Safe journey and return of son', 'Mother from Delhi', 'general', 3),
('Peace and happiness for all', 'Ram Kumar', 'general', 4),
('Recovery from illness', 'Sunita Devi', 'special', 5);

-- Create indexes for better performance
CREATE INDEX idx_donors_email ON donors(email);
CREATE INDEX idx_donors_mobile ON donors(mobile);
CREATE INDEX idx_donations_donor_id ON donations(donor_id);
CREATE INDEX idx_donations_status ON donations(status);
CREATE INDEX idx_donations_created_at ON donations(created_at);
CREATE INDEX idx_prayer_requests_donor_id ON prayer_requests(donor_id);
CREATE INDEX idx_prayer_requests_status ON prayer_requests(status);
CREATE INDEX idx_prayer_requests_created_at ON prayer_requests(created_at);
CREATE INDEX idx_milestones_status ON construction_milestones(status);
CREATE INDEX idx_milestones_sort_order ON construction_milestones(sort_order);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_donors_updated_at BEFORE UPDATE ON donors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_donations_updated_at BEFORE UPDATE ON donations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_prayer_requests_updated_at BEFORE UPDATE ON prayer_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_milestones_updated_at BEFORE UPDATE ON construction_milestones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON project_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_requests ENABLE ROW LEVEL SECURITY;

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

-- Allow donors to read their own records
CREATE POLICY "Donors can read their own records" ON donors FOR SELECT USING (auth.uid()::text = id::text OR email = auth.jwt() ->> 'email');

-- Allow donors to read their own donations
CREATE POLICY "Donors can read their own donations" ON donations FOR SELECT USING (auth.uid()::text = donor_id::text OR EXISTS (SELECT 1 FROM donors WHERE donors.id = donations.donor_id AND donors.email = auth.jwt() ->> 'email'));

-- Allow donors to read their own prayer requests
CREATE POLICY "Donors can read their own prayer requests" ON prayer_requests FOR SELECT USING (auth.uid()::text = donor_id::text OR EXISTS (SELECT 1 FROM donors WHERE donors.id = prayer_requests.donor_id AND donors.email = auth.jwt() ->> 'email'));

-- Create views for common queries
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

CREATE VIEW funding_progress AS
SELECT 
    (SELECT value::integer FROM project_settings WHERE key = 'funding_goal') as total_goal,
    (SELECT value::integer FROM project_settings WHERE key = 'current_funding') as current_amount,
    COUNT(DISTINCT donor_id) as total_donors,
    COUNT(*) as total_donations,
    AVG(amount) as average_donation
FROM donations 
WHERE status = 'completed';

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

CREATE TRIGGER donations_update_funding_progress
    AFTER UPDATE ON donations
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_funding_progress();
