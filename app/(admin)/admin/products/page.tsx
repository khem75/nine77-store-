import type { Metadata } from 'next';
import { getProducts } from '@/lib/product-actions';
import ProductTable from '@/components/admin/product-table';
import PageHeader from '@/components/admin/page-header';

export const metadata: Metadata = { title: 'Products' };

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div>
      <PageHeader
        title="Products"
        description={`${products.length} product${products.length !== 1 ? 's' : ''} in your catalog`}
        action={{
          label: 'Add Product',
          href: '/admin/products/new',
          variant: 'primary',
        }}
      />
      <ProductTable initialProducts={products} />
    </div>
  );
}
