# Supabase Database Setup Guide

## ⚠️ IMPORTANT: Database Tables Must Be Created First

The DanceMotion application requires Supabase database tables to be initialized before you can use the admin panel and save data.

## Current Status

❌ **Database tables not yet created**

Error: `Could not find the table 'public.events' in the schema cache`

**Action Required:** Follow the steps below to create the database tables.

---

## How to Set Up Supabase Database

### Step 1: Access Supabase Dashboard

1. Go to https://app.supabase.com
2. Sign in with your account
3. Select the project: **`sbbrjdfcxvbbcswnbyki`** (DanceMotion)

### Step 2: Go to SQL Editor

1. In the left sidebar, click **"SQL Editor"**
2. Click **"+ New Query"**

### Step 3: Copy the Migration SQL

Open the file `supabase/migrations/001_create_tables.sql` and copy **ALL** its contents.

### Step 4: Paste and Run

1. In the Supabase SQL Editor, **paste the entire SQL** into the editor
2. Click the blue **"Run"** button (or press `Cmd+Enter` / `Ctrl+Enter`)
3. Wait for the query to complete (should see "Success" message)

### Step 5: Verify Tables Were Created

1. In the left sidebar, click **"Database"** → **"Tables"**
2. You should see these tables:
   - ✅ `events` 
   - ✅ `content`
   - ✅ `forms`
   - ✅ `form_submissions`
   - ✅ `gallery`
   - ✅ `admin_users`

If all tables appear, the setup is complete! ✅

---

## What the Migration Does

This SQL migration creates:

1. **`events` table** - Stores all events (concerts, workshops, training, etc.)
   - Columns: id, title, date, time, location, city, category, groups, note, href, created_at, updated_at, is_published

2. **`content` table** - Stores all dynamic text content (hero titles, descriptions, etc.)
   - Columns: id, key, value, section, description, created_at, updated_at

3. **`forms` table** - Stores form configurations (contact, newsletter, membership)

4. **`form_submissions` table** - Stores form submission data

5. **`gallery` table** - Stores gallery/photo data

6. **`admin_users` table** - Stores admin user information

7. **RLS (Row Level Security) Policies** - Ensures:
   - ✅ Public can read published events and content
   - ✅ Only authenticated admins can write/edit/delete
   - ✅ Gallery only shows published items

---

## After Creating Tables

Once tables are created:

1. ✅ Refresh the website at https://dancemotion.org
2. ✅ The errors should be gone
3. ✅ You can add events and content through the admin panel
4. ✅ Changes appear live on the website immediately

---

## Troubleshooting

### "Query failed: syntax error"

- This usually means part of the SQL wasn't copied correctly
- Try copying the entire file again carefully
- Make sure you're in the SQL Editor (not Query Builder)

### "Table already exists"

- If you see this, the table was already created successfully
- The migration script checks for `IF NOT EXISTS` so it's safe to run again

### Still seeing errors after running SQL

1. Clear your browser cache (Ctrl+Shift+Delete / Cmd+Shift+Delete)
2. Refresh the page
3. Check that ALL 6 tables appear in the Database → Tables section

---

## Next Steps

After database setup:

1. Add sample events via `/admin/events`
2. Add content via `/admin/content`  
3. Verify changes appear on the website immediately
4. Start using the admin panel for all content management!

---

**Questions?** Check the Docker logs:
```bash
docker compose logs dancemotion-web --tail 50
```
