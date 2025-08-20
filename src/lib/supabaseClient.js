import { createClient } from '@supabase/supabase-js';

    const supabaseUrl = 'https://acwsnffikgogyupyifxx.supabase.co';
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjd3NuZmZpa2dvZ3l1cHlpZnh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyMTgwMzcsImV4cCI6MjA2Mzc5NDAzN30.45EIePvA6zwF_KBqEuL4tSCW_vOoQDX4D_ab9j9yhC0';
    
    export const supabase = createClient(supabaseUrl, supabaseAnonKey);