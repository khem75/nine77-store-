'use server';

import { revalidatePath } from 'next/cache';
import type { HomepageSettings, StoreSettings } from '@/types/admin';

const IS_MOCK = process.env.NEXT_PUBLIC_MOCK_MODE === 'true';

async function getSupabaseClient() {
  const { createClient } = await import('@/lib/supabase');
  return createClient();
}

// ── Homepage ────────────────────────────────────────────────────

export async function getHomepageSettings(): Promise<HomepageSettings | null> {
  if (IS_MOCK) {
    const { mockGetHomepage } = await import('./mock-data');
    return mockGetHomepage();
  }
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase.from('homepage').select('*').eq('id', 1).single();
    if (error) {
      const { mockGetHomepage } = await import('./mock-data');
      return mockGetHomepage();
    }
    return data;
  } catch {
    const { mockGetHomepage } = await import('./mock-data');
    return mockGetHomepage();
  }
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
  try {
    const supabase = await getSupabaseClient();
    const { error } = await supabase
      .from('homepage')
      .upsert({ id: 1, ...values, updated_at: new Date().toISOString() });
    if (error) return { success: false, error: error.message };
    revalidatePath('/admin/homepage');
    revalidatePath('/');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e?.message || 'Failed to update homepage settings' };
  }
}

// ── Settings ─────────────────────────────────────────────────────

export async function getStoreSettings(): Promise<StoreSettings | null> {
  if (IS_MOCK) {
    const { mockGetSettings } = await import('./mock-data');
    return mockGetSettings();
  }
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase.from('settings').select('*').eq('id', 1).single();
    if (error) {
      const { mockGetSettings } = await import('./mock-data');
      return mockGetSettings();
    }
    return data;
  } catch {
    const { mockGetSettings } = await import('./mock-data');
    return mockGetSettings();
  }
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
  try {
    const supabase = await getSupabaseClient();
    const { error } = await supabase
      .from('settings')
      .upsert({ id: 1, ...values, updated_at: new Date().toISOString() });
    if (error) return { success: false, error: error.message };
    revalidatePath('/admin/settings');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e?.message || 'Failed to update store settings' };
  }
}
