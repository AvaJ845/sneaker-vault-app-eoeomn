
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const supabaseUrl = 'https://nmlcaqwylqijxmfykcis.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tbGNhcXd5bHFpanhtZnlrY2lzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY2MjQzOTgsImV4cCI6MjA4MjIwMDM5OH0.6tjLiam17LY84rYJSlnqwOEPf0vl8iUBDypYR9HiFC4';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
