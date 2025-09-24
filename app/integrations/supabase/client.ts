
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from './types';
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://nnyepzqtvpznrhrydxdz.supabase.co";
// Note: This is a placeholder - you'll need to get the actual anon key from Supabase dashboard
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ueWVwenF0dnB6bnJocnlkeGR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU2MDcxMTYsImV4cCI6MjA0MTE4MzExNn0.placeholder";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
