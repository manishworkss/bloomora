export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return false;

  const isPlaceholderUrl =
    url.includes('placeholder') ||
    url.includes('your-project') ||
    url === 'https://your-project.supabase.co';

  const isPlaceholderKey =
    key.includes('placeholder') ||
    key.includes('your-supabase') ||
    key === 'your-supabase-anon-key';

  return !isPlaceholderUrl && !isPlaceholderKey;
}

