# Yamraj dham Temple Divine Giving - Database Schema

This document describes the comprehensive database schema for the Yamraj dham Temple Divine Giving platform, designed to support temple donations, prayer requests, and construction progress tracking.

## Overview

The database schema is built on PostgreSQL with Supabase and includes the following key features:
- **Donor Management**: Complete donor information with tax compliance
- **Donation Processing**: Multiple donation categories and payment tracking
- **Prayer Requests**: Different types of prayer services
- **Construction Progress**: Milestone tracking and progress visualization
- **Project Configuration**: Dynamic settings and configuration management

## Database Tables

### 1. Donors Table
Stores donor information for donations and prayer requests.

```sql
donors (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  mobile VARCHAR(15) NOT NULL,
  country VARCHAR(100) DEFAULT 'India',
  state VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  pin_code VARCHAR(10) NOT NULL,
  address TEXT NOT NULL,
  pan_no VARCHAR(10), -- Required for donations > ₹10,000
  preacher_name VARCHAR(255), -- ISKCON preacher reference
  is_anonymous BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
```

**Key Features:**
- Unique email constraint for donor identification
- PAN number support for tax compliance
- Anonymous donation support
- Complete address information for receipts

### 2. Donation Categories Table
Predefined donation categories with suggested amounts.

```sql
donation_categories (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  suggested_amount INTEGER,
  icon VARCHAR(50),
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE
)
```

**Default Categories:**
- Shree Krishna Seva (₹501)
- Temple Construction (₹1,001) - Most Popular
- Dharma Shala (₹2,501)
- Library & Education (₹5,001)
- Golden Kalash (₹11,001)
- Maha Donation (₹51,001)

### 3. Donations Table
Core donation transaction records.

```sql
donations (
  id UUID PRIMARY KEY,
  donor_id UUID REFERENCES donors(id),
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
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE
)
```

**Status Types:**
- `pending`: Payment initiated but not completed
- `completed`: Payment successful and donation recorded
- `failed`: Payment failed
- `refunded`: Donation refunded

### 4. Prayer Requests Table
Manages different types of prayer requests from devotees.

```sql
prayer_requests (
  id UUID PRIMARY KEY,
  donor_id UUID REFERENCES donors(id),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  prayer_type prayer_type DEFAULT 'general',
  prayer_text TEXT NOT NULL,
  amount INTEGER DEFAULT 0, -- 0 for free prayers
  status prayer_status DEFAULT 'submitted',
  is_anonymous BOOLEAN DEFAULT FALSE,
  special_instructions TEXT,
  scheduled_date DATE, -- For special prayers/havan
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE
)
```

**Prayer Types:**
- `general`: Free general blessing prayers
- `special`: ₹101 special prayers
- `havan`: ₹501 havan ceremonies
- `group`: ₹1,001 group prayer sessions

### 5. Construction Milestones Table
Tracks temple construction progress and milestones.

```sql
construction_milestones (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  target_date DATE,
  completion_date DATE,
  status milestone_status DEFAULT 'planned',
  progress_percentage INTEGER DEFAULT 0,
  estimated_cost INTEGER,
  actual_cost INTEGER,
  image_url VARCHAR(500),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
```

**Default Milestones:**
1. Foundation (Completed - 100%)
2. Structure (Completed - 100%)
3. Roof & Domes (In Progress - 65%)
4. Interior (Planned - 0%)
5. Final Touches (Planned - 0%)

### 6. Project Settings Table
Dynamic configuration for the application.

```sql
project_settings (
  id UUID PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  data_type VARCHAR(20) DEFAULT 'string',
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
```

**Key Settings:**
- `funding_goal`: Total funding target (₹50,00,000)
- `current_funding`: Current funding amount (₹32,50,000)
- `donor_count`: Total number of donors (1,247)
- `days_left`: Campaign days remaining (180)
- `pan_required_threshold`: PAN requirement threshold (₹10,000)

### 7. Prayer Schedule Table
Daily prayer timings and ceremonies.

```sql
prayer_schedule (
  id UUID PRIMARY KEY,
  prayer_name VARCHAR(255) NOT NULL,
  time TIME NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE
)
```

**Default Schedule:**
- Morning Aarti: 6:00 AM
- Special Prayers: 12:00 PM
- Evening Aarti: 7:00 PM
- Night Prayer: 9:00 PM

### 8. Recent Prayers Display Table
Public display of recent prayer requests (with privacy controls).

```sql
recent_prayers_display (
  id UUID PRIMARY KEY,
  prayer_text TEXT NOT NULL,
  donor_name VARCHAR(255) DEFAULT 'Anonymous',
  prayer_type prayer_type DEFAULT 'general',
  is_featured BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE
)
```

## Database Views

### 1. Donation Summary View
Aggregated donation statistics by category.

```sql
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
```

### 2. Funding Progress View
Overall funding campaign statistics.

```sql
CREATE VIEW funding_progress AS
SELECT 
    (SELECT value::integer FROM project_settings WHERE key = 'funding_goal') as total_goal,
    (SELECT value::integer FROM project_settings WHERE key = 'current_funding') as current_amount,
    COUNT(DISTINCT donor_id) as total_donors,
    COUNT(*) as total_donations,
    AVG(amount) as average_donation
FROM donations 
WHERE status = 'completed';
```

### 3. Recent Donations View
Latest completed donations for display.

```sql
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
```

## Database Functions

### 1. get_total_donations()
Returns the total amount of completed donations.

```sql
CREATE OR REPLACE FUNCTION get_total_donations()
RETURNS INTEGER AS $$
BEGIN
    RETURN COALESCE((SELECT SUM(amount) FROM donations WHERE status = 'completed'), 0);
END;
$$ LANGUAGE plpgsql;
```

### 2. get_total_donors()
Returns the total number of unique donors.

```sql
CREATE OR REPLACE FUNCTION get_total_donors()
RETURNS INTEGER AS $$
BEGIN
    RETURN COALESCE((SELECT COUNT(DISTINCT donor_id) FROM donations WHERE status = 'completed'), 0);
END;
$$ LANGUAGE plpgsql;
```

### 3. update_funding_progress()
Updates project settings with current funding statistics.

```sql
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
```

## Security & Access Control

### Row Level Security (RLS)
The schema implements Row Level Security for data protection:

- **Public Read Access**: Donation categories, milestones, settings, prayer schedule, and recent prayers display
- **Public Insert Access**: Donors, donations, and prayer requests (for forms)
- **Authenticated Access**: Users can read their own donor records and related data

### Privacy Features
- Anonymous donation support
- Donor information protection
- PAN number handling for tax compliance
- Secure payment processing integration

## Performance Optimizations

### Indexes
```sql
-- Donor indexes
CREATE INDEX idx_donors_email ON donors(email);
CREATE INDEX idx_donors_mobile ON donors(mobile);

-- Donation indexes
CREATE INDEX idx_donations_donor_id ON donations(donor_id);
CREATE INDEX idx_donations_status ON donations(status);
CREATE INDEX idx_donations_created_at ON donations(created_at);

-- Prayer request indexes
CREATE INDEX idx_prayer_requests_donor_id ON prayer_requests(donor_id);
CREATE INDEX idx_prayer_requests_status ON prayer_requests(status);
CREATE INDEX idx_prayer_requests_created_at ON prayer_requests(created_at);

-- Milestone indexes
CREATE INDEX idx_milestones_status ON construction_milestones(status);
CREATE INDEX idx_milestones_sort_order ON construction_milestones(sort_order);
```

### Triggers
- **Auto-update timestamps**: `updated_at` fields automatically updated
- **Funding progress tracking**: Automatic updates when donations complete
- **Data consistency**: Validation triggers for business rules

## Business Rules & Constraints

### Donation Rules
1. Minimum donation amount: ₹1
2. PAN number required for donations > ₹10,000
3. Tax-deductible receipts provided for all donations
4. Anonymous donations supported

### Prayer Request Rules
1. Free general prayers available
2. Paid special prayers with different pricing tiers
3. Scheduling support for special ceremonies
4. Privacy protection for sensitive requests

### Construction Milestone Rules
1. Progress percentage: 0-100%
2. Status transitions: planned → in_progress → completed
3. Cost tracking for budget management
4. Image support for progress visualization

## Integration Points

### Payment Gateway Integration
- Payment ID tracking for transaction reconciliation
- Multiple payment methods supported
- Status management for payment lifecycle

### Tax Compliance
- 80G certificate support
- PAN number validation
- Receipt generation
- Donation reporting

### Communication
- Email notifications for donations
- Prayer request confirmations
- Progress update notifications
- Receipt delivery

## Usage Examples

### Creating a Donation
```typescript
const donation: DonationInsert = {
  donor_id: donorId,
  category_id: categoryId,
  amount: 1001,
  donation_type: 'category',
  payment_method: 'upi',
  message: 'For temple construction',
  tax_deductible: true
};
```

### Submitting a Prayer Request
```typescript
const prayerRequest: PrayerRequestInsert = {
  name: 'John Doe',
  email: 'john@example.com',
  prayer_type: 'special',
  prayer_text: 'For good health and prosperity',
  amount: 101,
  is_anonymous: false
};
```

### Updating Construction Progress
```typescript
const milestoneUpdate: ConstructionMilestoneUpdate = {
  status: 'in_progress',
  progress_percentage: 75,
  completion_date: '2024-12-31'
};
```

This comprehensive schema provides a robust foundation for the Yamraj dham Temple Divine Giving platform, supporting all current features while maintaining flexibility for future enhancements.
