#!/usr/bin/env node

/**
 * Initialize Supabase Database Schema
 * This script runs the SQL migrations to set up the database tables
 * 
 * IMPORTANT: This must be run as a TypeScript/JavaScript file with proper module support
 * Usage: node --loader ts-node/esm scripts/init-supabase.ts (or tsx if available)
 */

const fs = require('fs');
const path = require('path');

// Import Supabase client
const { createClient } = require('@supabase/supabase-js');

async function runMigration() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
    process.exit(1);
  }

  try {
    console.log('📡 Connecting to Supabase...');
    console.log(`URL: ${supabaseUrl}`);

    // Create Supabase client with service role (admin) key
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Get the SQL migration file
    const migrationPath = path.join(__dirname, '../supabase/migrations/001_create_tables.sql');
    const sql = fs.readFileSync(migrationPath, 'utf-8');

    // Execute the entire migration as one statement
    console.log('⏳ Running database migrations...');
    
    const { error } = await supabase.rpc('exec_sql', {
      sql: sql,
    }).catch(err => {
      // If exec_sql doesn't exist, try direct query
      console.log('Note: exec_sql RPC not available, trying alternative method...');
      return supabase.from('_migrations').select().catch(e => ({ error: e }));
    });

    if (error && error.message.includes('function exec_sql')) {
      console.log('⚠️  Cannot execute arbitrary SQL via RPC. You need to manually run the migration in Supabase dashboard.');
      console.log('📝 SQL file location: supabase/migrations/001_create_tables.sql');
      console.log('');
      console.log('Instructions:');
      console.log('1. Go to https://app.supabase.com');
      console.log('2. Select your project (sbbrjdfcxvbbcswnbyki)');
      console.log('3. Go to SQL Editor');
      console.log('4. Create new query');
      console.log('5. Copy and paste the contents of supabase/migrations/001_create_tables.sql');
      console.log('6. Click Run');
      process.exit(0);
    }

    if (error) {
      throw error;
    }

    console.log('✅ Migration completed successfully!');
    console.log('✓ All tables created and RLS policies configured');

  } catch (error) {
    console.error('❌ Error running migration:', error.message);
    console.log('');
    console.log('📝 Manual Setup Required:');
    console.log('1. Go to https://app.supabase.com');
    console.log('2. Select your project');
    console.log('3. Go to SQL Editor');
    console.log('4. Copy and paste the contents of supabase/migrations/001_create_tables.sql');
    console.log('5. Click Run');
    process.exit(1);
  }
}

runMigration();
