# Database Setup Instructions

This application requires a Supabase database with specific tables. Follow these steps to set up your database:

## Prerequisites

- A Supabase account and project
- Access to the Supabase SQL Editor

## Setup Steps

1. **Navigate to your Supabase project's SQL Editor**
   - Go to your Supabase dashboard
   - Select your project
   - Click on "SQL Editor" in the left sidebar

2. **Run the schema migration**
   - Open the file `supabase/migrations/20250101000000_initial_schema.sql`
   - Copy the entire contents
   - Paste into the Supabase SQL Editor
   - Click "Run" to execute the SQL

3. **Run the seed data migration**
   - Open the file `supabase/migrations/20250101000001_seed_data.sql`
   - Copy the entire contents
   - Paste into the Supabase SQL Editor
   - Click "Run" to execute the SQL

## Verify Setup

After running both migrations, verify that the following tables exist:
- `users`
- `jobs`
- `applications`
- `crowdsourced_stats`
- `chatbot_queries`

You should also see 10 job listings and 5 crowdsourced stats entries.

## Important Notes

- The migrations are idempotent and can be run multiple times safely
- Row Level Security (RLS) is enabled on all tables
- Anonymous authentication is used for the prototype
- All user data is properly secured with RLS policies

## Troubleshooting

If you encounter any errors:
1. Make sure you're using the correct Supabase URL and anon key in your `.env` file
2. Verify that RLS is enabled on all tables
3. Check that the SQL was executed without errors in the Supabase SQL Editor

## Environment Variables

Ensure your `.env` file contains:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```
