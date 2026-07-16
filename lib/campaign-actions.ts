'use server';

import { revalidatePath } from 'next/cache';
import type { Campaign } from '@/types/campaign';

const IS_MOCK = process.env.NEXT_PUBLIC_MOCK_MODE === 'true';

async function getSupabaseClient() {
  const { createClient } = await import('@/lib/supabase');
  return createClient();
}

/**
 * Fetches campaign configurations.
 * If not in admin mode, filters by 'published' status and current scheduling times.
 */
export async function getCampaigns(options?: {
  adminMode?: boolean;
  previewTime?: string;
}): Promise<Campaign[]> {
  const adminMode = options?.adminMode ?? false;
  const previewTime = options?.previewTime ? new Date(options.previewTime) : new Date();

  if (IS_MOCK) {
    const { mockGetCampaigns } = await import('./mock-data');
    return mockGetCampaigns(adminMode, options?.previewTime);
  }

  try {
    const supabase = await getSupabaseClient();
    let query = supabase.from('campaigns').select('*');

    if (!adminMode) {
      // Fetch only published ones
      query = query.eq('status', 'published');
    }

    const { data, error } = await query.order('order', { ascending: true });

    if (error) {
      console.warn('Supabase campaign fetch error (falling back):', error.message);
      return [];
    }

    if (!data) return [];

    const campaignsList = data as Campaign[];

    if (!adminMode) {
      // Perform date checking on campaigns that have scheduling boundaries
      return campaignsList.filter((c) => {
        const publishDate = c.publish_at ? new Date(c.publish_at) : null;
        const expireDate = c.expires_at ? new Date(c.expires_at) : null;

        if (publishDate && publishDate > previewTime) return false;
        if (expireDate && expireDate < previewTime) return false;
        return true;
      });
    }

    return campaignsList;
  } catch (err: any) {
    // Rethrow Next.js dynamic routing errors so it handles dynamic page opts cleanly without console alerts
    if (err && (err.message?.includes('Dynamic server usage') || err.digest === 'DYNAMIC_SERVER_USAGE')) {
      throw err;
    }
    console.error('Fatal campaigns retrieval error:', err);
    return [];
  }
}

/**
 * Creates a new campaign
 */
export async function createCampaign(
  values: Omit<Campaign, 'id' | 'created_at' | 'updated_at' | 'version'>
): Promise<{ success: boolean; data?: Campaign; error?: string }> {
  if (IS_MOCK) {
    const { mockCreateCampaign } = await import('./mock-data');
    const data = mockCreateCampaign(values);
    revalidatePath('/admin/homepage');
    revalidatePath('/');
    return { success: true, data };
  }

  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('campaigns')
      .insert([values])
      .select()
      .single();

    if (error) return { success: false, error: error.message };

    revalidatePath('/admin/homepage');
    revalidatePath('/');
    return { success: true, data: data as Campaign };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to create campaign' };
  }
}

/**
 * Updates an existing campaign
 */
export async function updateCampaign(
  id: string,
  values: Partial<Omit<Campaign, 'id' | 'created_at' | 'updated_at' | 'version'>>
): Promise<{ success: boolean; data?: Campaign; error?: string }> {
  if (IS_MOCK) {
    const { mockUpdateCampaign } = await import('./mock-data');
    const success = mockUpdateCampaign(id, values);
    if (!success) return { success: false, error: 'Campaign not found' };
    revalidatePath('/admin/homepage');
    revalidatePath('/');
    return { success: true };
  }

  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('campaigns')
      .update(values)
      .eq('id', id)
      .select()
      .single();

    if (error) return { success: false, error: error.message };

    revalidatePath('/admin/homepage');
    revalidatePath('/');
    return { success: true, data: data as Campaign };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update campaign' };
  }
}

/**
 * Deletes a campaign
 */
export async function deleteCampaign(id: string): Promise<{ success: boolean; error?: string }> {
  if (IS_MOCK) {
    const { mockDeleteCampaign } = await import('./mock-data');
    const success = mockDeleteCampaign(id);
    if (!success) return { success: false, error: 'Campaign not found' };
    revalidatePath('/admin/homepage');
    revalidatePath('/');
    return { success: true };
  }

  try {
    const supabase = await getSupabaseClient();
    const { error } = await supabase.from('campaigns').delete().eq('id', id);

    if (error) return { success: false, error: error.message };

    revalidatePath('/admin/homepage');
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete campaign' };
  }
}

/**
 * Reorders a list of campaigns by updating their 'order' value
 */
export async function reorderCampaigns(
  orderedIds: string[]
): Promise<{ success: boolean; error?: string }> {
  if (IS_MOCK) {
    const { mockReorderCampaigns } = await import('./mock-data');
    mockReorderCampaigns(orderedIds);
    revalidatePath('/admin/homepage');
    revalidatePath('/');
    return { success: true };
  }

  try {
    const supabase = await getSupabaseClient();
    
    // We execute individual updates in a batch or loop.
    // In a production server action, running a simple loop is sufficient for a few homepage items.
    const promises = orderedIds.map((id, index) =>
      supabase.from('campaigns').update({ order: index }).eq('id', id)
    );
    
    const results = await Promise.all(promises);
    const failed = results.find((r) => r.error);
    
    if (failed) return { success: false, error: failed.error?.message };

    revalidatePath('/admin/homepage');
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to reorder campaigns' };
  }
}
