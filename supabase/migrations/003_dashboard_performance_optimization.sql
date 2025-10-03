-- Database Performance Optimizations for Yamrajdham Temple Dashboard
-- These optimizations will significantly improve query performance for admin and user dashboards

-- 1. Create materialized view for admin dashboard statistics
-- This will cache frequently accessed aggregated data
CREATE MATERIALIZED VIEW admin_dashboard_stats AS
SELECT 
    -- Total completed donations count and amount
    COUNT(CASE WHEN payment_status = 'completed' THEN 1 END) as total_completed_donations,
    COALESCE(SUM(CASE WHEN payment_status = 'completed' THEN amount ELSE 0 END), 0) as total_completed_amount,
    
    -- Status counts
    COUNT(CASE WHEN payment_status = 'pending' THEN 1 END) as pending_donations,
    COUNT(CASE WHEN payment_status = 'failed' THEN 1 END) as failed_donations,
    COUNT(CASE WHEN payment_status = 'refunded' THEN 1 END) as refunded_donations,
    
    -- User count
    COUNT(DISTINCT user_id) as total_users,
    
    -- Average donation amount
    CASE 
        WHEN COUNT(CASE WHEN payment_status = 'completed' THEN 1 END) > 0 
        THEN COALESCE(SUM(CASE WHEN payment_status = 'completed' THEN amount ELSE 0 END), 0) / COUNT(CASE WHEN payment_status = 'completed' THEN 1 END)
        ELSE 0 
    END as average_donation_amount,
    
    -- Last updated timestamp
    NOW() as last_updated
FROM user_donations;

-- Create unique index on the materialized view
CREATE UNIQUE INDEX idx_admin_dashboard_stats_unique ON admin_dashboard_stats (last_updated);

-- 2. Create materialized view for user donation statistics
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
GROUP BY user_id;

-- Create index on user_id for fast lookups
CREATE INDEX idx_user_donation_stats_user_id ON user_donation_stats (user_id);

-- 3. Create materialized view for recent donations (for homepage display)
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
ORDER BY ud.created_at DESC
LIMIT 50;

-- Create index on created_at for sorting
CREATE INDEX idx_recent_donations_summary_created_at ON recent_donations_summary (created_at DESC);

-- 4. Create optimized indexes for frequently queried columns
-- These indexes will speed up common dashboard queries

-- Index for user donations by user_id and status (most common query)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_donations_user_status ON user_donations (user_id, payment_status);

-- Index for user donations by status and created_at (for admin dashboard)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_donations_status_created ON user_donations (payment_status, created_at DESC);

-- Index for user donations by amount (for analytics)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_donations_amount ON user_donations (amount) WHERE payment_status = 'completed';

-- Index for users by created_at (for admin user management)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_created_at ON users (created_at DESC);

-- 5. Create function to refresh materialized views
-- This function should be called periodically or after data changes
CREATE OR REPLACE FUNCTION refresh_dashboard_views()
RETURNS void AS $$
BEGIN
    -- Refresh admin dashboard stats
    REFRESH MATERIALIZED VIEW admin_dashboard_stats;
    
    -- Refresh user donation stats
    REFRESH MATERIALIZED VIEW user_donation_stats;
    
    -- Refresh recent donations summary
    REFRESH MATERIALIZED VIEW recent_donations_summary;
    
    -- Log the refresh
    INSERT INTO project_settings (key, value, description, data_type) 
    VALUES ('last_dashboard_refresh', NOW()::text, 'Last time dashboard views were refreshed', 'string')
    ON CONFLICT (key) DO UPDATE SET 
        value = NOW()::text,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- 6. Create trigger to automatically refresh views when donations are updated
-- This ensures data stays fresh when donations change
CREATE OR REPLACE FUNCTION trigger_refresh_dashboard_views()
RETURNS TRIGGER AS $$
BEGIN
    -- Only refresh if the payment status changed to completed
    IF (TG_OP = 'UPDATE' AND OLD.payment_status != NEW.payment_status AND NEW.payment_status = 'completed') 
       OR TG_OP = 'INSERT' THEN
        -- Use a background job or schedule this for better performance
        -- For now, we'll refresh immediately (consider using pg_cron for production)
        PERFORM refresh_dashboard_views();
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger on user_donations table
DROP TRIGGER IF EXISTS user_donations_refresh_views ON user_donations;
CREATE TRIGGER user_donations_refresh_views
    AFTER INSERT OR UPDATE ON user_donations
    FOR EACH ROW
    EXECUTE FUNCTION trigger_refresh_dashboard_views();

-- 7. Create optimized functions for dashboard queries
-- These functions will use the materialized views for better performance

-- Function to get admin dashboard stats
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
        -- Fallback to real-time calculation if view is stale
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
        FROM user_donations;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to get user dashboard stats
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
        -- Fallback to real-time calculation
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
        AND payment_status = 'completed';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- 8. Create a scheduled job to refresh views (requires pg_cron extension)
-- Uncomment these lines if you have pg_cron installed:
-- SELECT cron.schedule('refresh-dashboard-views', '*/5 * * * *', 'SELECT refresh_dashboard_views();');

-- 9. Add comments for documentation
COMMENT ON MATERIALIZED VIEW admin_dashboard_stats IS 'Cached admin dashboard statistics for fast loading';
COMMENT ON MATERIALIZED VIEW user_donation_stats IS 'Cached user donation statistics for fast dashboard loading';
COMMENT ON MATERIALIZED VIEW recent_donations_summary IS 'Cached recent donations for homepage display';
COMMENT ON FUNCTION refresh_dashboard_views() IS 'Refreshes all dashboard materialized views';
COMMENT ON FUNCTION get_admin_dashboard_stats() IS 'Optimized function to get admin dashboard statistics';
COMMENT ON FUNCTION get_user_dashboard_stats(UUID) IS 'Optimized function to get user dashboard statistics';

-- 10. Initial refresh of materialized views
SELECT refresh_dashboard_views();
