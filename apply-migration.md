# How to Apply the Database Migration

## Option 1: Using Supabase Dashboard (Recommended)

1. **Open Supabase Dashboard**
   - Go to [supabase.com](https://supabase.com)
   - Navigate to your project: `bkvzmgydluxpzcjyfxue`

2. **Access SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the Migration**
   - Copy the contents of `migrations/001_initial_schema.sql`
   - Paste it into the SQL Editor
   - Click "Run" to execute the migration

4. **Verify the Migration**
   - Check the "Table Editor" to see the new tables
   - Verify that the following tables were created:
     - `donors`
     - `donation_categories`
     - `donations`
     - `prayer_requests`
     - `construction_milestones`
     - `project_settings`
     - `prayer_schedule`
     - `recent_prayers_display`

## Option 2: Using Supabase CLI

1. **Install Supabase CLI** (if not already installed)
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**
   ```bash
   supabase login
   ```

3. **Link to your project**
   ```bash
   supabase link --project-ref bkvzmgydluxpzcjyfxue
   ```

4. **Apply the migration**
   ```bash
   supabase db push
   ```

## Option 3: Direct SQL Execution

If you have direct access to your PostgreSQL database:

1. **Connect to your database**
   - Use any PostgreSQL client (pgAdmin, DBeaver, etc.)
   - Connect using your database credentials

2. **Execute the migration**
   - Copy the contents of `migrations/001_initial_schema.sql`
   - Execute the SQL script

## Post-Migration Steps

### 1. Update TypeScript Types

After applying the migration, update your `src/integrations/supabase/types.ts` file:

```bash
# Generate new types (if using Supabase CLI)
supabase gen types typescript --project-id bkvzmgydluxpzcjyfxue > src/integrations/supabase/types.ts
```

Or manually replace the content with the types from `database-types.ts`.

### 2. Test the Schema

You can test the schema by running some queries in the SQL Editor:

```sql
-- Check if tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check donation categories
SELECT * FROM donation_categories;

-- Check project settings
SELECT * FROM project_settings;

-- Check construction milestones
SELECT * FROM construction_milestones;
```

### 3. Verify Views and Functions

```sql
-- Test the funding progress view
SELECT * FROM funding_progress;

-- Test the donation summary view
SELECT * FROM donation_summary;

-- Test the functions
SELECT get_total_donations();
SELECT get_total_donors();
```

## Troubleshooting

### Common Issues

1. **Permission Errors**
   - Make sure you're using the correct project ID
   - Ensure you have admin access to the project

2. **Type Already Exists**
   - The migration uses `IF NOT EXISTS` and `DO $$ BEGIN ... END $$` blocks
   - This should handle existing types gracefully

3. **Policy Conflicts**
   - The migration drops existing policies before creating new ones
   - If you have custom policies, you may need to adjust them

4. **Data Conflicts**
   - The migration uses `WHERE NOT EXISTS` for inserts
   - This prevents duplicate data insertion

### Rollback (if needed)

If you need to rollback the migration:

```sql
-- Drop all tables (CAUTION: This will delete all data!)
DROP TABLE IF EXISTS recent_prayers_display CASCADE;
DROP TABLE IF EXISTS prayer_schedule CASCADE;
DROP TABLE IF EXISTS project_settings CASCADE;
DROP TABLE IF EXISTS construction_milestones CASCADE;
DROP TABLE IF EXISTS prayer_requests CASCADE;
DROP TABLE IF EXISTS donations CASCADE;
DROP TABLE IF EXISTS donation_categories CASCADE;
DROP TABLE IF EXISTS donors CASCADE;

-- Drop custom types
DROP TYPE IF EXISTS data_type CASCADE;
DROP TYPE IF EXISTS milestone_status CASCADE;
DROP TYPE IF EXISTS prayer_status CASCADE;
DROP TYPE IF EXISTS prayer_type CASCADE;
DROP TYPE IF EXISTS payment_method CASCADE;
DROP TYPE IF EXISTS donation_status CASCADE;
```

## Next Steps

After successfully applying the migration:

1. **Update your application code** to use the new database schema
2. **Test the donation form** to ensure it works with the new tables
3. **Test the prayer request form** to verify prayer submissions
4. **Update your components** to fetch data from the new views and tables
5. **Set up monitoring** for donation and prayer request submissions

## Support

If you encounter any issues:

1. Check the Supabase logs in the dashboard
2. Verify your project settings and permissions
3. Test individual parts of the migration separately
4. Contact Supabase support if needed

The migration is designed to be idempotent, so you can run it multiple times safely.
