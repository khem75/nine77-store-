import type { Metadata } from 'next';
import { getStoreSettings } from '@/lib/homepage-actions';
import PageHeader from '@/components/admin/page-header';
import SettingsForm from '@/components/admin/settings-form';

export const metadata: Metadata = { title: 'Settings' };

export default async function AdminSettingsPage() {
  const settings = await getStoreSettings();

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Manage your store configuration and social links"
      />
      <SettingsForm initialSettings={settings} />
    </div>
  );
}
