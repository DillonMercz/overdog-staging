// lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    url: !!supabaseUrl,
    key: !!supabaseAnonKey
  });
  // Instead of throwing, we could use dummy values for development
  // This is just an example, replace with your actual Supabase URL and anon key
  throw new Error('Please add Supabase environment variables to .env file');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);