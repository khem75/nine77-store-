import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getDashboardStats, getProducts } from '@/lib/product-actions';
import PageHeader from '@/components/admin/page-header';
import DashboardClient from '@/components/admin/dashboard-client';

export const metadata: Metadata = { title: 'Dashboard' };

export default async function AdminDashboardPage() {
  const [stats, recentProducts] = await Promise.all([
    getDashboardStats(),
    getProducts(),
  ]);

  const recent = recentProducts.slice(0, 8);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description={`Welcome back. ${stats.active} products are live on your store.`}
        action={{
          label: 'Add Product',
          href: '/admin/products/new',
          variant: 'primary',
        }}
      />

      {/* Client component handles stat cards + recent table */}
      <DashboardClient stats={stats} recentProducts={recent} />
    </div>
  );
}
