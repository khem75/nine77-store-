'use server';

import { revalidatePath } from 'next/cache';
import type { AdminProduct, ProductFormValues } from '@/types/admin';
import { slugify } from '@/utils';

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

export async function getProducts(): Promise<AdminProduct[]> {
  if (IS_MOCK) {
    const { mockGetProducts } = await import('./mock-data');
    return mockGetProducts();
  }
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('updated_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getProductById(id: string): Promise<AdminProduct | null> {
  if (IS_MOCK) {
    const { mockGetProductById } = await import('./mock-data');
    return mockGetProductById(id);
  }
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
  if (error) return null;
  return data;
}

export async function createProduct(values: ProductFormValues): Promise<{ success: boolean; id?: string; error?: string }> {
  if (IS_MOCK) {
    const { mockCreateProduct } = await import('./mock-data');
    const product = mockCreateProduct(values as any);
    revalidatePath('/admin/products');
    revalidatePath('/admin');
    return { success: true, id: product.id };
  }
  const supabase = await getSupabaseClient();
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('products')
    .insert([{ ...values, created_at: now, updated_at: now }])
    .select('id')
    .single();
  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/products');
  revalidatePath('/admin');
  return { success: true, id: data.id };
}

export async function updateProduct(id: string, values: Partial<ProductFormValues>): Promise<{ success: boolean; error?: string }> {
  if (IS_MOCK) {
    const { mockUpdateProduct } = await import('./mock-data');
    const ok = mockUpdateProduct(id, values as any);
    revalidatePath('/admin/products');
    revalidatePath('/admin');
    return ok ? { success: true } : { success: false, error: 'Product not found' };
  }
  const supabase = await getSupabaseClient();
  const { error } = await supabase
    .from('products')
    .update({ ...values, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/products');
  revalidatePath('/admin');
  return { success: true };
}

export async function deleteProduct(id: string): Promise<{ success: boolean; error?: string }> {
  if (IS_MOCK) {
    const { mockDeleteProduct } = await import('./mock-data');
    const ok = mockDeleteProduct(id);
    revalidatePath('/admin/products');
    revalidatePath('/admin');
    return ok ? { success: true } : { success: false, error: 'Product not found' };
  }
  const supabase = await getSupabaseClient();
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/products');
  revalidatePath('/admin');
  return { success: true };
}

export async function duplicateProduct(id: string): Promise<{ success: boolean; error?: string }> {
  const product = await getProductById(id);
  if (!product) return { success: false, error: 'Product not found' };
  const { id: _id, created_at: _ca, updated_at: _ua, ...values } = product;
  return createProduct({ ...values, name: `${values.name} (Copy)`, status: 'draft' });
}

export async function toggleProductVisibility(id: string, currentStatus: string): Promise<{ success: boolean; error?: string }> {
  const newStatus = currentStatus === 'hidden' ? 'active' : 'hidden';
  return updateProduct(id, { status: newStatus as AdminProduct['status'] });
}

export async function getDashboardStats() {
  if (IS_MOCK) {
    const { mockGetStats } = await import('./mock-data');
    return mockGetStats();
  }
  const products = await getProducts();
  return {
    total: products.length,
    active: products.filter((p) => p.status === 'active').length,
    featured: products.filter((p) => p.featured).length,
    draft: products.filter((p) => p.status === 'draft').length,
  };
}

export async function getProductBySlug(slug: string): Promise<AdminProduct | null> {
  const products = await getProducts();
  return products.find((p) => slugify(p.name) === slug) ?? null;
}

