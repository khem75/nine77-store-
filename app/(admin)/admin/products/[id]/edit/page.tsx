import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductById } from '@/lib/product-actions';
import PageHeader from '@/components/admin/page-header';
import ProductForm from '@/components/admin/product-form';

export const metadata: Metadata = { title: 'Edit Product' };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) notFound();

  return (
    <div>
      <PageHeader
        title={`Edit: ${product.name}`}
        description="Update product details, images, and settings"
        breadcrumbs={[
          { label: 'Products', href: '/admin/products' },
          { label: product.name },
          { label: 'Edit' },
        ]}
      />
      <ProductForm product={product} isEditing />
    </div>
  );
}
