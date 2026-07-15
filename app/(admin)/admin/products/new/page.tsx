import type { Metadata } from 'next';
import PageHeader from '@/components/admin/page-header';
import ProductForm from '@/components/admin/product-form';

export const metadata: Metadata = { title: 'Add Product' };

export default function NewProductPage() {
  return (
    <div>
      <PageHeader
        title="Add Product"
        description="Create a new product in your catalog"
        breadcrumbs={[
          { label: 'Products', href: '/admin/products' },
          { label: 'Add Product' },
        ]}
      />
      <ProductForm />
    </div>
  );
}
