import { createClient, SupabaseClient, User } from '@supabase/supabase-js';

// Retrieve credentials from localStorage first, then environment variables
export const getSupabaseConfig = () => {
  const localUrl = localStorage.getItem('sv_supabase_url');
  const localKey = localStorage.getItem('sv_supabase_anon_key');

  const url = (localUrl || import.meta.env.VITE_SUPABASE_URL || '').trim();
  const key = (localKey || import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

  const isConfigured = Boolean(
    url &&
    key &&
    url !== 'https://your-project.supabase.co' &&
    !url.includes('your_supabase_url') &&
    key !== 'your-anon-key-here' &&
    key.length > 20
  );

  return { url, key, isConfigured };
};

const config = getSupabaseConfig();
export const isSupabaseConfigured = config.isConfigured;

// Create Supabase client instance (or a fallback client)
export const supabase: SupabaseClient | null = config.isConfigured
  ? createClient(config.url, config.key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

/**
 * Save Supabase configuration dynamically
 */
export function saveSupabaseConfig(url: string, anonKey: string) {
  localStorage.setItem('sv_supabase_url', url.trim());
  localStorage.setItem('sv_supabase_anon_key', anonKey.trim());
  window.location.reload();
}

/**
 * Trigger official Google OAuth sign-in via Supabase
 */
export async function signInWithGoogle(): Promise<{ error: Error | null; data?: any }> {
  const currentConfig = getSupabaseConfig();
  if (!currentConfig.isConfigured) {
    return {
      error: new Error(
        'Supabase is not yet connected to a live project. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file, or configure it via the connection modal.'
      ),
    };
  }

  const client = supabase || createClient(currentConfig.url, currentConfig.key);

  try {
    const { data, error } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) throw error;
    return { error: null, data };
  } catch (err: any) {
    return { error: err };
  }
}

/**
 * Sign in with Email and Password
 */
export async function signInWithEmail(email: string, password: string) {
  const currentConfig = getSupabaseConfig();
  if (!currentConfig.isConfigured) {
    return {
      error: new Error(
        'Supabase credentials not configured. You can use the "Demo Student Login" button to explore StudentVerse instantly!'
      ),
      data: null,
    };
  }

  const client = supabase || createClient(currentConfig.url, currentConfig.key);
  return await client.auth.signInWithPassword({
    email,
    password,
  });
}

/**
 * Sign up with Email and Password along with student metadata
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  metadata: {
    full_name: string;
    college: string;
    course: string;
    semester: number;
  }
) {
  const currentConfig = getSupabaseConfig();
  if (!currentConfig.isConfigured) {
    return {
      error: new Error(
        'Supabase credentials not configured. Please add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
      ),
      data: null,
    };
  }

  const client = supabase || createClient(currentConfig.url, currentConfig.key);
  return await client.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
      emailRedirectTo: `${window.location.origin}/dashboard`,
    },
  });
}

/**
 * Send Password Reset Email
 */
export async function resetPassword(email: string) {
  const currentConfig = getSupabaseConfig();
  if (!currentConfig.isConfigured) {
    return {
      error: new Error('Supabase not configured for email delivery.'),
      data: null,
    };
  }

  const client = supabase || createClient(currentConfig.url, currentConfig.key);
  return await client.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/login?reset=success`,
  });
}

/**
 * Sign Out
 */
export async function signOutUser() {
  const currentConfig = getSupabaseConfig();
  if (currentConfig.isConfigured && supabase) {
    await supabase.auth.signOut();
  }
}
