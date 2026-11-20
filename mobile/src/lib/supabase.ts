import 'react-native-url-polyfill/auto';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Null when .env is missing, so the app still starts and the feed can say why
// it's empty instead of crashing on launch.
export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          storage: AsyncStorage,
          autoRefreshToken: true,
          persistSession: true,
          // No URL-based session in React Native
          detectSessionInUrl: false,
        },
      })
    : null;

export const SUPABASE_NOT_CONFIGURED =
  'Supabase is not configured. Copy mobile/.env.example to mobile/.env and fill it in.';
