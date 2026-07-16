import type { Metadata } from 'next';
import { getHomepageSettings } from '@/lib/homepage-actions';
import { getProducts } from '@/lib/product-actions';
import { getCampaigns } from '@/lib/campaign-actions';
import PageHeader from '@/components/admin/page-header';
import HomepageForm from '@/components/admin/homepage-form';

export const metadata: Metadata = { title: 'Homepage Manager' };

export default async function HomepageManagerPage() {
  const [settings, products, campaigns] = await Promise.all([
    getHomepageSettings(),
    getProducts(),
    getCampaigns({ adminMode: true }),
  ]);

  return (
    <div>
      <PageHeader
        title="Homepage Manager"
        description="Customize your store's homepage content, slideshow campaigns, and featured products"
      />
      <HomepageForm
        initialSettings={settings}
        allProducts={products}
        initialCampaigns={campaigns}
      />
    </div>
  );
}
