'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const IS_MOCK = process.env.NEXT_PUBLIC_MOCK_MODE === 'true';

// ── Mock session cookie name ───────────────────────────────────
const MOCK_TOKEN = 'nine77-mock-admin';

export async function adminLogin(email: string, password: string) {
  // ── MOCK MODE ──────────────────────────────────────────────
  if (IS_MOCK) {
    // Accept any non-empty email/password in mock mode
    if (!email || !password) {
      return { success: false, error: 'Please enter email and password.' };
    }
    const cookieStore = await cookies();
    cookieStore.set('nine77-admin-token', MOCK_TOKEN, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24,
    });
    return { success: true };
  }

  // ── REAL MODE ──────────────────────────────────────────────
  const { createClient } = await import('@/lib/supabase');
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { success: false, error: error.message };

  return { success: true };
}

export async function adminLogout() {
  const cookieStore = await cookies();
  
  if (IS_MOCK) {
    cookieStore.delete('nine77-admin-token');
    redirect('/admin/login');
  }

  // ── REAL MODE ──────────────────────────────────────────────
  const { createClient } = await import('@/lib/supabase');
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}

export async function getAdminSession() {
  const cookieStore = await cookies();

  // ── MOCK MODE ──────────────────────────────────────────────
  if (IS_MOCK) {
    const token = cookieStore.get('nine77-admin-token')?.value;
    if (!token) return null;
    if (token === MOCK_TOKEN) {
      return {
        id: 'mock-admin-001',
        email: 'admin@nine77.com',
        user_metadata: { full_name: 'Admin User' },
      };
    }
    return null;
  }

  // ── REAL MODE ──────────────────────────────────────────────
  const { createClient } = await import('@/lib/supabase');
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  
  return {
    id: data.user.id,
    email: data.user.email ?? '',
    user_metadata: data.user.user_metadata,
  };
}

export async function changeAdminPassword(newPassword: string) {
  if (IS_MOCK) {
    // Simulate success in mock mode
    return { success: true };
  }

  // ── REAL MODE ──────────────────────────────────────────────
  const { createClient } = await import('@/lib/supabase');
  const supabase = await createClient();
  
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return { success: false, error: error.message };
  return { success: true };
}
