import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If Supabase is not configured, return a mock client
  if (!supabaseUrl || !supabaseKey || supabaseUrl === 'your-supabase-project-url') {
    console.warn('⚠️  Supabase not configured - some features may not work')
    // Return a mock client that won't cause errors
    return createBrowserClient(
      'https://placeholder.supabase.co',
      'placeholder-key-for-development'
    )
  }

  return createBrowserClient(supabaseUrl, supabaseKey)
}
