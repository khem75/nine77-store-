import { createBrowserClient, createServerClient } from '@supabase/ssr';

const IS_MOCK = process.env.NEXT_PUBLIC_MOCK_MODE === 'true';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder';

// Browser / Client-side client (uses @supabase/ssr to automatically handle cookies)
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

// Server-side client creator (to be used in Server Components, Actions, and Route Handlers)
export async function createClient() {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing user sessions.
        }
      },
    },
  });
}

// Helper: get storage public URL for a given path
export function getPublicUrl(bucket: string, path: string): string {
  if (IS_MOCK) return `/products/${path.split('/').pop()}`;
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

// Helper: upload a file to Supabase storage
export async function uploadFile(
  bucket: string,
  path: string,
  file: File,
  options?: { upsert?: boolean }
): Promise<string> {
  if (IS_MOCK) {
    // In mock mode, return a fake object URL from the file
    return URL.createObjectURL(file);
  }
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: options?.upsert ?? true });
  if (error) throw error;
  return getPublicUrl(bucket, path);
}

// Helper: delete a file from Supabase storage
export async function deleteFile(bucket: string, path: string): Promise<void> {
  if (IS_MOCK) return;
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw error;
}
