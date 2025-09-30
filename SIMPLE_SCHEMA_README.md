# Yamraj dham Temple Divine Giving - Simplified Database Schema

## Database Structure

Your Supabase database now has a clean, simple 3-table structure:

### 1. **users** Table
Stores information about temple devotees and donors:
- `id` - Unique identifier (UUID)
- `email` - Email address (unique)
- `name` - Full name
- `mobile` - Mobile number (unique)
- `address` - Complete address
- `city` - City
- `state` - State/Province
- `pin_code` - Postal code
- `country` - Country (defaults to India)
- `pan_no` - PAN number (for donations > ₹10,000)
- `created_at` - Timestamp when user was created
- `updated_at` - Timestamp when user was last updated

### 2. **admin** Table
Stores information about temple administrators:
- `id` - Unique identifier (UUID)
- `email` - Email address (unique)
- `name` - Full name
- `mobile` - Mobile number (unique)
- `role` - Admin role (admin, super_admin)
- `is_active` - Whether admin is active
- `created_at` - Timestamp when admin was created
- `updated_at` - Timestamp when admin was last updated

### 3. **user_donations** Table
Stores all donation records:
- `id` - Unique identifier (UUID)
- `user_id` - Reference to users table (can be null for anonymous donations)
- `amount` - Donation amount in rupees
- `donation_type` - Type of donation (general, construction, maintenance, festival)
- `payment_status` - Payment status (pending, completed, failed, refunded)
- `payment_id` - Payment gateway transaction ID
- `payment_gateway` - Payment gateway used (razorpay, stripe, etc.)
- `receipt_number` - Receipt number
- `is_anonymous` - Whether donation is anonymous
- `dedication_message` - Special message or dedication
- `preacher_name` - ISKCON preacher who interacted with donor
- `created_at` - Timestamp when donation was created
- `updated_at` - Timestamp when donation was last updated

## Key Features

✅ **Simple Structure** - Only 3 tables for easy management
✅ **User Management** - Automatic user creation during donation
✅ **Donation Tracking** - Complete donation history with payment status
✅ **Admin Management** - Separate admin table for temple administrators
✅ **Anonymous Donations** - Support for anonymous donations
✅ **Payment Integration** - Ready for payment gateway integration
✅ **Row Level Security** - Secure database access
✅ **Automatic Timestamps** - Created/updated timestamps
✅ **Proper Indexing** - Optimized for performance

## How It Works

1. **Donation Process**:
   - User fills donation form
   - System checks if user exists by email
   - If not, creates new user record
   - Creates donation record linked to user
   - Payment status updated when payment completes

2. **Admin Management**:
   - Admins can view all donations
   - Update payment status
   - Manage user information
   - Track donation analytics

## Next Steps

- Integrate with payment gateway (Razorpay, Stripe)
- Add email notifications
- Implement admin authentication
- Add donation analytics dashboard
- Set up automated receipt generation

The database is now ready for production use with a clean, maintainable structure!
