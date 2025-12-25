
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const supabaseUrl = 'https://nmlcaqwylqijxmfykcis.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tbGNhcXd5bHFpanhtZnlrY2lzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2NzI2NjcsImV4cCI6MjA1MTI0ODY2N30.Zy5xQqYvZxQxYqYvZxQxYqYvZxQxYqYvZxQxYqYvZxQ';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
