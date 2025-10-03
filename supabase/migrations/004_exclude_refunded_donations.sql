-- Migration to exclude refunded donations from dashboard calculations
-- This ensures refunded donations are not shown in user dashboards

-- 1. Update the admin dashboard stats function to exclude refunded donations
CREATE OR REPLACE FUNCTION get_admin_dashboard_stats()
RETURNS TABLE (
    total_donations INTEGER,
    total_amount BIGINT,
    total_users INTEGER,
    completed_donations INTEGER,
    pending_donations INTEGER,
    failed_donations INTEGER,
    refunded_donations INTEGER,
    average_donation NUMERIC,
    system_status TEXT
) AS $$
BEGIN
    -- Check if materialized view is recent (within last 5 minutes)
    IF EXISTS (
        SELECT 1 FROM admin_dashboard_stats 
        WHERE last_updated > NOW() - INTERVAL '5 minutes'
    ) THEN
        -- Use materialized view for fast response
        RETURN QUERY
        SELECT 
            ads.total_completed_donations::INTEGER,
            ads.total_completed_amount::BIGINT,
            ads.total_users::INTEGER,
            ads.total_completed_donations::INTEGER,
            ads.pending_donations::INTEGER,
            ads.failed_donations::INTEGER,
            ads.refunded_donations::INTEGER,
            ads.average_donation_amount::NUMERIC,
            'healthy'::TEXT
        FROM admin_dashboard_stats ads
        ORDER BY ads.last_updated DESC
        LIMIT 1;
    ELSE
        -- Fallback to real-time calculation if view is stale (exclude refunded donations)
        RETURN QUERY
        SELECT 
            COUNT(CASE WHEN payment_status = 'completed' THEN 1 END)::INTEGER,
            COALESCE(SUM(CASE WHEN payment_status = 'completed' THEN amount ELSE 0 END), 0)::BIGINT,
            COUNT(DISTINCT user_id)::INTEGER,
            COUNT(CASE WHEN payment_status = 'completed' THEN 1 END)::INTEGER,
            COUNT(CASE WHEN payment_status = 'pending' THEN 1 END)::INTEGER,
            COUNT(CASE WHEN payment_status = 'failed' THEN 1 END)::INTEGER,
            COUNT(CASE WHEN payment_status = 'refunded' THEN 1 END)::INTEGER,
            CASE 
                WHEN COUNT(CASE WHEN payment_status = 'completed' THEN 1 END) > 0 
                THEN COALESCE(SUM(CASE WHEN payment_status = 'completed' THEN amount ELSE 0 END), 0) / COUNT(CASE WHEN payment_status = 'completed' THEN 1 END)
                ELSE 0 
            END::NUMERIC,
            'healthy'::TEXT
        FROM user_donations
        WHERE payment_status != 'refunded'; -- Exclude refunded donations from calculations
    END IF;
END;
$$ LANGUAGE plpgsql;

-- 2. Update the user dashboard stats function to exclude refunded donations
CREATE OR REPLACE FUNCTION get_user_dashboard_stats(p_user_id UUID)
RETURNS TABLE (
    total_amount BIGINT,
    total_count INTEGER,
    average_donation NUMERIC
) AS $$
BEGIN
    -- Check if materialized view is recent (within last 10 minutes)
    IF EXISTS (
        SELECT 1 FROM user_donation_stats 
        WHERE user_id = p_user_id 
        AND last_updated > NOW() - INTERVAL '10 minutes'
    ) THEN
        -- Use materialized view for fast response
        RETURN QUERY
        SELECT 
            uds.total_donated_amount::BIGINT,
            uds.completed_donations_count::INTEGER,
            uds.average_donation_amount::NUMERIC
        FROM user_donation_stats uds
        WHERE uds.user_id = p_user_id;
    ELSE
        -- Fallback to real-time calculation (exclude refunded donations)
        RETURN QUERY
        SELECT 
            COALESCE(SUM(amount), 0)::BIGINT,
            COUNT(*)::INTEGER,
            CASE 
                WHEN COUNT(*) > 0 THEN COALESCE(SUM(amount), 0) / COUNT(*)
                ELSE 0 
            END::NUMERIC
        FROM user_donations 
        WHERE user_id = p_user_id 
        AND payment_status = 'completed'
        AND payment_status != 'refunded'; -- Double-check: exclude refunded donations
    END IF;
END;
$$ LANGUAGE plpgsql;

-- 3. Update the materialized view for admin dashboard stats to exclude refunded donations
DROP MATERIALIZED VIEW IF EXISTS admin_dashboard_stats;
CREATE MATERIALIZED VIEW admin_dashboard_stats AS
SELECT 
    -- Total completed donations count and amount (exclude refunded)
    COUNT(CASE WHEN payment_status = 'completed' THEN 1 END) as total_completed_donations,
    COALESCE(SUM(CASE WHEN payment_status = 'completed' THEN amount ELSE 0 END), 0) as total_completed_amount,
    
    -- Status counts (exclude refunded from main calculations)
    COUNT(CASE WHEN payment_status = 'pending' THEN 1 END) as pending_donations,
    COUNT(CASE WHEN payment_status = 'failed' THEN 1 END) as failed_donations,
    COUNT(CASE WHEN payment_status = 'refunded' THEN 1 END) as refunded_donations,
    
    -- User count (only count users with non-refunded donations)
    COUNT(DISTINCT CASE WHEN payment_status != 'refunded' THEN user_id END) as total_users,
    
    -- Average donation amount (exclude refunded)
    CASE 
        WHEN COUNT(CASE WHEN payment_status = 'completed' THEN 1 END) > 0 
        THEN COALESCE(SUM(CASE WHEN payment_status = 'completed' THEN amount ELSE 0 END), 0) / COUNT(CASE WHEN payment_status = 'completed' THEN 1 END)
        ELSE 0 
    END as average_donation_amount,
    
    -- Last updated timestamp
    NOW() as last_updated
FROM user_donations
WHERE payment_status != 'refunded'; -- Exclude refunded donations from the view

-- Recreate the unique index
CREATE UNIQUE INDEX idx_admin_dashboard_stats_unique ON admin_dashboard_stats (last_updated);

-- 4. Update the materialized view for user donation stats to exclude refunded donations
DROP MATERIALIZED VIEW IF EXISTS user_donation_stats;
CREATE MATERIALIZED VIEW user_donation_stats AS
SELECT 
    user_id,
    COUNT(CASE WHEN payment_status = 'completed' THEN 1 END) as completed_donations_count,
    COALESCE(SUM(CASE WHEN payment_status = 'completed' THEN amount ELSE 0 END), 0) as total_donated_amount,
    CASE 
        WHEN COUNT(CASE WHEN payment_status = 'completed' THEN 1 END) > 0 
        THEN COALESCE(SUM(CASE WHEN payment_status = 'completed' THEN amount ELSE 0 END), 0) / COUNT(CASE WHEN payment_status = 'completed' THEN 1 END)
        ELSE 0 
    END as average_donation_amount,
    MAX(created_at) as last_donation_date,
    NOW() as last_updated
FROM user_donations
WHERE payment_status != 'refunded' -- Exclude refunded donations from user stats
GROUP BY user_id;

-- Recreate the index
CREATE INDEX idx_user_donation_stats_user_id ON user_donation_stats (user_id);

-- 5. Update the recent donations summary to exclude refunded donations
DROP MATERIALIZED VIEW IF EXISTS recent_donations_summary;
CREATE MATERIALIZED VIEW recent_donations_summary AS
SELECT 
    ud.id,
    ud.amount,
    ud.created_at,
    ud.payment_status,
    ud.donation_type,
    CASE 
        WHEN ud.is_anonymous THEN 'Anonymous'
        ELSE COALESCE(u.name, 'Anonymous')
    END as donor_name,
    NOW() as last_updated
FROM user_donations ud
LEFT JOIN users u ON ud.user_id = u.id
WHERE ud.payment_status = 'completed'
AND ud.payment_status != 'refunded' -- Double-check: exclude refunded donations
ORDER BY ud.created_at DESC
LIMIT 50;

-- Recreate the index
CREATE INDEX idx_recent_donations_summary_created_at ON recent_donations_summary (created_at DESC);

-- 6. Refresh all materialized views
SELECT refresh_dashboard_views();

-- 7. Add comments for documentation
COMMENT ON FUNCTION get_admin_dashboard_stats() IS 'Optimized function to get admin dashboard statistics (excludes refunded donations)';
COMMENT ON FUNCTION get_user_dashboard_stats(UUID) IS 'Optimized function to get user dashboard statistics (excludes refunded donations)';
COMMENT ON MATERIALIZED VIEW admin_dashboard_stats IS 'Cached admin dashboard statistics excluding refunded donations';
COMMENT ON MATERIALIZED VIEW user_donation_stats IS 'Cached user donation statistics excluding refunded donations';
COMMENT ON MATERIALIZED VIEW recent_donations_summary IS 'Cached recent donations excluding refunded donations';
