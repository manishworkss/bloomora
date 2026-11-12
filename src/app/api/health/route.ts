import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { isSupabaseConfigured } from '@/lib/supabase/status';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const startedAt = Date.now();
  const isCloud = isSupabaseConfigured();
  let supabaseOk = false;
  let dbLatencyMs: number | null = null;

  if (isCloud) {
    try {
      const supabase = createAdminClient();
      const { error } = await supabase.from('categories').select('id', { count: 'exact', head: true });
      dbLatencyMs = Date.now() - startedAt;
      supabaseOk = !error;
    } catch {
      dbLatencyMs = Date.now() - startedAt;
      supabaseOk = false;
    }
  }

  const status = !isCloud || supabaseOk ? 'ok' : 'degraded';

  return NextResponse.json(
    {
      status,
      brand: 'Bloomora',
      whatsapp: '+91 8271735190',
      database: {
        mode: isCloud ? 'supabase' : 'local-json',
        connected: !isCloud || supabaseOk,
        latencyMs: dbLatencyMs,
      },
      timestamp: new Date().toISOString(),
    },
    { status: status === 'ok' ? 200 : 503 }
  );
}
