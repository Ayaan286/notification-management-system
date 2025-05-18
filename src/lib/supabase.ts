import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a mock client if environment variables are missing
const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
      },
      from: () => ({
        insert: () => ({
          select: () => ({
            single: () => ({ data: null, error: null }),
          }),
        }),
      }),
      functions: {
        invoke: async () => ({ data: { success: true }, error: null }),
      },
    };

export { supabase };