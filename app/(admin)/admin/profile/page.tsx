import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth-actions';
import PageHeader from '@/components/admin/page-header';
import ProfileForm from '@/components/admin/profile-form';

export const metadata: Metadata = { title: 'Profile' };

export default async function AdminProfilePage() {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');

  return (
    <div>
      <PageHeader
        title="Profile"
        description="Manage your admin account and password"
      />
      <ProfileForm user={session as any} />
    </div>
  );
}
