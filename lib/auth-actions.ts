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
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { success: false, error: error.message };

  const cookieStore = await cookies();
  cookieStore.set('nine77-admin-token', data.session?.access_token ?? '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24,
  });
  cookieStore.set('nine77-admin-refresh', data.session?.refresh_token ?? '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return { success: true };
}

export async function adminLogout() {
  const cookieStore = await cookies();
  cookieStore.delete('nine77-admin-token');
  cookieStore.delete('nine77-admin-refresh');
  redirect('/admin/login');
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('nine77-admin-token')?.value;
  if (!token) return null;

  // ── MOCK MODE ──────────────────────────────────────────────
  if (IS_MOCK) {
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
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return null;
  return data.user;
}

export async function changeAdminPassword(newPassword: string) {
  if (IS_MOCK) {
    // Simulate success in mock mode
    return { success: true };
  }

  const session = await getAdminSession();
  if (!session) return { success: false, error: 'Not authenticated' };

  const cookieStore = await cookies();
  const token = cookieStore.get('nine77-admin-token')?.value;
  const refresh = cookieStore.get('nine77-admin-refresh')?.value;

  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
  await supabase.auth.setSession({ access_token: token!, refresh_token: refresh ?? '' });
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return { success: false, error: error.message };
  return { success: true };
}
