'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Package,
  CheckCircle2,
  Star,
  FileText,
  Clock,
  ArrowRight,
  Plus,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { AdminProduct } from '@/types/admin';
import type { DashboardStats } from '@/types/admin';

interface DashboardClientProps {
  stats: DashboardStats;
  recentProducts: AdminProduct[];
}

function StatCard({
  label,
  value,
  icon: Icon,
  description,
  accent = false,
  index = 0,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  description?: string;
  accent?: boolean;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      className="admin-card p-5 group hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9B9BA4] mb-2">{label}</p>
          <p className={`text-3xl font-black tracking-tight leading-none ${accent ? 'text-[#C9A227]' : 'text-[#111111]'}`}>
            {value}
          </p>
          {description && (
            <p className="text-[12px] text-[#9B9BA4] mt-2 font-medium">{description}</p>
          )}
        </div>
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 ${
            accent ? 'bg-[#C9A227]/10' : 'bg-black/[0.04]'
          }`}
        >
          <Icon size={18} className={accent ? 'text-[#C9A227]' : 'text-[#6B6B70]'} />
        </div>
      </div>
    </motion.div>
  );
}

export default function DashboardClient({ stats, recentProducts }: DashboardClientProps) {
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <>
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Products" value={stats.total} icon={Package} description="All products" index={0} />
        <StatCard label="Active" value={stats.active} icon={CheckCircle2} description="Live on store" index={1} />
        <StatCard label="Featured" value={stats.featured} icon={Star} description="On homepage" accent index={2} />
        <StatCard label="Drafts" value={stats.draft} icon={FileText} description="Not published" index={3} />
      </div>

      {/* Quick Action */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <Link
          href="/admin/products/new"
          className="admin-btn-primary inline-flex gap-2 items-center"
        >
          <Plus size={15} />
          Add New Product
        </Link>
      </motion.div>

      {/* Recent Products */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="admin-card overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-black/[0.06]">
          <div className="flex items-center gap-2.5">
            <Clock size={15} className="text-[#9B9BA4]" />
            <h2 className="text-[14px] font-semibold text-[#111111]">Recently Updated</h2>
          </div>
          <Link
            href="/admin/products"
            className="flex items-center gap-1.5 text-[12px] font-semibold text-[#9B9BA4] hover:text-[#C9A227] transition-colors"
          >
            View all
            <ArrowRight size={12} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="w-14">Image</th>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Updated</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {recentProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-[13px] text-[#9B9BA4]">
                    No products yet.{' '}
                    <Link href="/admin/products/new" className="text-[#C9A227] hover:underline font-semibold">
                      Add your first product →
                    </Link>
                  </td>
                </tr>
              ) : (
                recentProducts.map((product) => (
                  <tr key={product.id} className="group">
                    <td>
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-black/[0.06] bg-[#F4F4F6]">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#C0C0C8] text-xs font-bold">?</div>
                        )}
                      </div>
                    </td>
                    <td>
                      <p className="font-semibold text-[#111111] text-[13.5px]">{product.name}</p>
                    </td>
                    <td>
                      <span className="text-[12.5px] text-[#6B6B70]">{product.category}</span>
                    </td>
                    <td>
                      <span className="font-semibold text-[13px] text-[#111111]">
                        Rs. {product.price.toLocaleString()}
                      </span>
                    </td>
                    <td>
                      <span className={`admin-badge ${
                        product.status === 'active' ? 'admin-badge-active' :
                        product.status === 'draft' ? 'admin-badge-draft' :
                        'admin-badge-hidden'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          product.status === 'active' ? 'bg-green-500' :
                          product.status === 'draft' ? 'bg-amber-500' :
                          'bg-gray-400'
                        }`} />
                        {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      <span className="text-[12px] text-[#9B9BA4]">
                        {formatDate(product.updated_at)}
                      </span>
                    </td>
                    <td>
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="text-[12px] font-semibold text-[#C9A227] hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </>
  );
}
