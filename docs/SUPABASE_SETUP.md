# Yamraj dham Temple Divine Giving - Supabase Setup

## Database Setup Instructions

### 1. Create the Donations Table

You need to run the SQL migration in your Supabase dashboard to create the donations table.

1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/dxdfgaymlhcqxjsuwhoi
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase/migrations/001_create_donations_table.sql`
4. Run the SQL script

### 2. Verify the Setup

After running the migration, you should have:
- A `donations` table with all necessary columns
- Row Level Security (RLS) enabled
- Proper indexes for performance
- Policies allowing public read/insert/update access

### 3. Test the Application

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/donate` to test the donation form
3. Navigate to `/admin/donations` to view all donations

### 4. Database Schema

The donations table includes:
- **id**: UUID primary key
- **amount**: Donation amount in rupees
- **name**: Donor's full name
- **email**: Donor's email address
- **mobile**: Donor's mobile number
- **country**: Country (defaults to India)
- **state**: State/Province
- **city**: City
- **pin_code**: Postal code
- **pan_no**: PAN number (required for donations > ₹10,000)
- **preacher**: ISKCON preacher name (optional)
- **address**: Complete address
- **message**: Special message/dedication (optional)
- **payment_status**: pending/completed/failed
- **payment_id**: Payment gateway transaction ID
- **created_at**: Timestamp when record was created
- **updated_at**: Timestamp when record was last updated

### 5. Security Notes

- The table has Row Level Security enabled
- Public policies allow read, insert, and update operations
- For production, consider implementing more restrictive policies
- Consider adding authentication for admin access to donation management

### 6. Next Steps

- Integrate with a payment gateway (Razorpay, Stripe, etc.)
- Add email notifications for successful donations
- Implement admin authentication
- Add donation analytics and reporting features
