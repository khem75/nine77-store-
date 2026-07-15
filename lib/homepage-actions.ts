'use server';

import { revalidatePath } from 'next/cache';
import type { HomepageSettings, StoreSettings } from '@/types/admin';

const IS_MOCK = process.env.NEXT_PUBLIC_MOCK_MODE === 'true';

async function getSupabaseClient() {
  const { cookies } = await import('next/headers');
  const { createClient } = await import('@supabase/supabase-js');
  const cookieStore = await cookies();
  const token = cookieStore.get('nine77-admin-token')?.value;
  const refresh = cookieStore.get('nine77-admin-refresh')?.value;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
  if (token && refresh) {
    await supabase.auth.setSession({ access_token: token, refresh_token: refresh });
  }
  return supabase;
}

// ── Homepage ────────────────────────────────────────────────────

export async function getHomepageSettings(): Promise<HomepageSettings | null> {
  if (IS_MOCK) {
    const { mockGetHomepage } = await import('./mock-data');
    return mockGetHomepage();
  }
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase.from('homepage').select('*').eq('id', 1).single();
  if (error) return null;
  return data;
}

export async function updateHomepageSettings(
  values: Partial<Omit<HomepageSettings, 'id' | 'updated_at'>>
): Promise<{ success: boolean; error?: string }> {
  if (IS_MOCK) {
    const { mockUpdateHomepage } = await import('./mock-data');
    mockUpdateHomepage(values as any);
    revalidatePath('/admin/homepage');
    return { success: true };
  }
  const supabase = await getSupabaseClient();
  const { error } = await supabase
    .from('homepage')
    .upsert({ id: 1, ...values, updated_at: new Date().toISOString() });
  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/homepage');
  revalidatePath('/');
  return { success: true };
}

// ── Settings ─────────────────────────────────────────────────────

export async function getStoreSettings(): Promise<StoreSettings | null> {
  if (IS_MOCK) {
    const { mockGetSettings } = await import('./mock-data');
    return mockGetSettings();
  }
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase.from('settings').select('*').eq('id', 1).single();
  if (error) return null;
  return data;
}

export async function updateStoreSettings(
  values: Partial<Omit<StoreSettings, 'id' | 'updated_at'>>
): Promise<{ success: boolean; error?: string }> {
  if (IS_MOCK) {
    const { mockUpdateSettings } = await import('./mock-data');
    mockUpdateSettings(values as any);
    revalidatePath('/admin/settings');
    return { success: true };
  }
  const supabase = await getSupabaseClient();
  const { error } = await supabase
    .from('settings')
    .upsert({ id: 1, ...values, updated_at: new Date().toISOString() });
  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/settings');
  return { success: true };
}
