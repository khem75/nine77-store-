import type { Metadata } from 'next';
import { getHomepageSettings } from '@/lib/homepage-actions';
import { getProducts } from '@/lib/product-actions';
import PageHeader from '@/components/admin/page-header';
import HomepageForm from '@/components/admin/homepage-form';

export const metadata: Metadata = { title: 'Homepage Manager' };

export default async function HomepageManagerPage() {
  const [settings, products] = await Promise.all([
    getHomepageSettings(),
    getProducts(),
  ]);

  return (
    <div>
      <PageHeader
        title="Homepage Manager"
        description="Customize your store's homepage content and featured products"
      />
      <HomepageForm initialSettings={settings} allProducts={products} />
    </div>
  );
}
