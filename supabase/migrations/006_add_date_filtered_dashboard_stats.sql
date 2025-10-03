-- Migration to add date-filtered dashboard statistics
-- This allows filtering dashboard stats by date ranges

-- 1. Create new function for date-filtered admin dashboard stats
CREATE OR REPLACE FUNCTION get_admin_dashboard_stats_filtered(
    start_date TIMESTAMP DEFAULT NULL,
    end_date TIMESTAMP DEFAULT NULL
)
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
    -- If no dates provided, use the existing optimized function
    IF start_date IS NULL AND end_date IS NULL THEN
        RETURN QUERY SELECT * FROM get_admin_dashboard_stats();
        RETURN;
    END IF;
    
    -- Set default end_date to now if not provided
    IF end_date IS NULL THEN
        end_date := NOW();
    END IF;
    
    -- Set default start_date to 30 days ago if not provided
    IF start_date IS NULL THEN
        start_date := NOW() - INTERVAL '30 days';
    END IF;
    
    -- Calculate filtered stats directly from user_donations table
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
    WHERE created_at >= start_date 
    AND created_at <= end_date
    AND payment_status != 'refunded'; -- Exclude refunded donations
END;
$$ LANGUAGE plpgsql;

-- 2. Create function for date-filtered analytics data
CREATE OR REPLACE FUNCTION get_admin_analytics_filtered(
    start_date TIMESTAMP DEFAULT NULL,
    end_date TIMESTAMP DEFAULT NULL
)
RETURNS TABLE (
    monthly_trends JSONB,
    category_breakdown JSONB,
    top_donors JSONB
) AS $$
DECLARE
    start_date_filter TIMESTAMP;
    end_date_filter TIMESTAMP;
BEGIN
    -- Set default dates if not provided
    IF start_date IS NULL AND end_date IS NULL THEN
        start_date_filter := NOW() - INTERVAL '12 months';
        end_date_filter := NOW();
    ELSE
        start_date_filter := COALESCE(start_date, NOW() - INTERVAL '30 days');
        end_date_filter := COALESCE(end_date, NOW());
    END IF;
    
    -- Monthly trends (last 12 months or filtered range)
    RETURN QUERY
    SELECT 
        (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'month', to_char(date_trunc('month', created_at), 'YYYY-MM'),
                    'amount', SUM(amount),
                    'count', COUNT(*)
                )
            )
            FROM user_donations 
            WHERE payment_status = 'completed'
            AND payment_status != 'refunded'
            AND created_at >= start_date_filter
            AND created_at <= end_date_filter
            GROUP BY date_trunc('month', created_at)
            ORDER BY date_trunc('month', created_at)
        ) as monthly_trends,
        
        -- Category breakdown
        (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'category', donation_type,
                    'amount', SUM(amount),
                    'count', COUNT(*)
                )
            )
            FROM user_donations 
            WHERE payment_status = 'completed'
            AND payment_status != 'refunded'
            AND created_at >= start_date_filter
            AND created_at <= end_date_filter
            GROUP BY donation_type
            ORDER BY SUM(amount) DESC
        ) as category_breakdown,
        
        -- Top donors (last 30 days or filtered range)
        (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'name', CASE 
                        WHEN ud.is_anonymous THEN 'Anonymous'
                        ELSE COALESCE(u.name, 'Anonymous')
                    END,
                    'amount', SUM(ud.amount),
                    'count', COUNT(*)
                )
            )
            FROM user_donations ud
            LEFT JOIN users u ON ud.user_id = u.id
            WHERE ud.payment_status = 'completed'
            AND ud.payment_status != 'refunded'
            AND ud.created_at >= start_date_filter
            AND ud.created_at <= end_date_filter
            GROUP BY ud.user_id, ud.is_anonymous, u.name
            ORDER BY SUM(ud.amount) DESC
            LIMIT 10
        ) as top_donors;
END;
$$ LANGUAGE plpgsql;

-- 3. Create function for date-filtered recent donations
CREATE OR REPLACE FUNCTION get_recent_donations_filtered(
    start_date TIMESTAMP DEFAULT NULL,
    end_date TIMESTAMP DEFAULT NULL,
    limit_count INTEGER DEFAULT 20
)
RETURNS TABLE (
    donations JSONB
) AS $$
DECLARE
    start_date_filter TIMESTAMP;
    end_date_filter TIMESTAMP;
BEGIN
    -- Set default dates if not provided
    IF start_date IS NULL AND end_date IS NULL THEN
        start_date_filter := NOW() - INTERVAL '30 days';
        end_date_filter := NOW();
    ELSE
        start_date_filter := COALESCE(start_date, NOW() - INTERVAL '30 days');
        end_date_filter := COALESCE(end_date, NOW());
    END IF;
    
    RETURN QUERY
    SELECT 
        (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'id', ud.id,
                    'amount', ud.amount,
                    'created_at', ud.created_at,
                    'payment_status', ud.payment_status,
                    'donation_type', ud.donation_type,
                    'donor_name', CASE 
                        WHEN ud.is_anonymous THEN 'Anonymous'
                        ELSE COALESCE(u.name, 'Anonymous')
                    END,
                    'is_anonymous', ud.is_anonymous
                )
            )
            FROM user_donations ud
            LEFT JOIN users u ON ud.user_id = u.id
            WHERE ud.payment_status = 'completed'
            AND ud.payment_status != 'refunded'
            AND ud.created_at >= start_date_filter
            AND ud.created_at <= end_date_filter
            ORDER BY ud.created_at DESC
            LIMIT limit_count
        ) as donations;
END;
$$ LANGUAGE plpgsql;

-- 4. Add comments for documentation
COMMENT ON FUNCTION get_admin_dashboard_stats_filtered(TIMESTAMP, TIMESTAMP) IS 'Get admin dashboard statistics filtered by date range';
COMMENT ON FUNCTION get_admin_analytics_filtered(TIMESTAMP, TIMESTAMP) IS 'Get admin analytics data filtered by date range';
COMMENT ON FUNCTION get_recent_donations_filtered(TIMESTAMP, TIMESTAMP, INTEGER) IS 'Get recent donations filtered by date range';

-- 5. Create indexes to optimize date-filtered queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_donations_created_at_status 
ON user_donations (created_at DESC, payment_status) 
WHERE payment_status = 'completed';

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_donations_date_range 
ON user_donations (created_at, payment_status, amount) 
WHERE payment_status = 'completed';
