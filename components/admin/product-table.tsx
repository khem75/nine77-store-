'use client';

import { useState, useMemo, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Star,
  StarOff,
  Filter,
  MoreHorizontal,
} from 'lucide-react';
import { toast } from 'sonner';
import type { AdminProduct, ProductFilters, SortField } from '@/types/admin';
import {
  deleteProduct,
  duplicateProduct,
  toggleProductVisibility,
  updateProduct,
  getProducts,
} from '@/lib/product-actions';
import DeleteModal from './delete-modal';
import EmptyState from './empty-state';

const CATEGORIES = ['All', 'Tops', 'Pants', 'Outerwear', 'Accessories'];
const STATUSES = ['All', 'active', 'draft', 'hidden'];

interface ProductTableProps {
  initialProducts: AdminProduct[];
}

export default function ProductTable({ initialProducts }: ProductTableProps) {
  const [products, setProducts] = useState(initialProducts);
  const [filters, setFilters] = useState<ProductFilters>({
    search: '',
    category: 'All',
    status: 'All',
    sortField: 'updated_at',
    sortDirection: 'desc',
  });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Filtered + sorted products
  const filtered = useMemo(() => {
    let list = [...products];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    if (filters.category !== 'All') list = list.filter((p) => p.category === filters.category);
    if (filters.status !== 'All') list = list.filter((p) => p.status === filters.status);

    list.sort((a, b) => {
      const field = filters.sortField;
      const dir = filters.sortDirection === 'asc' ? 1 : -1;
      const av = (a as any)[field] ?? '';
      const bv = (b as any)[field] ?? '';
      return av < bv ? -dir : av > bv ? dir : 0;
    });

    return list;
  }, [products, filters]);

  function toggleSort(field: SortField) {
    setFilters((f) => ({
      ...f,
      sortField: field,
      sortDirection: f.sortField === field && f.sortDirection === 'asc' ? 'desc' : 'asc',
    }));
  }

  function SortIcon({ field }: { field: SortField }) {
    if (filters.sortField !== field) return <ChevronDown size={12} className="text-[#C0C0C8]" />;
    return filters.sortDirection === 'asc' ? (
      <ChevronUp size={12} className="text-[#C9A227]" />
    ) : (
      <ChevronDown size={12} className="text-[#C9A227]" />
    );
  }

  async function handleDelete(id: string) {
    const result = await deleteProduct(id);
    if (result.success) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success('Product deleted');
    } else {
      toast.error(result.error ?? 'Failed to delete');
    }
  }

  async function handleDuplicate(id: string) {
    setActionLoading(id + '-dup');
    const result = await duplicateProduct(id);
    if (result.success) {
      toast.success('Product duplicated — check draft products');
      const latest = await getProducts();
      setProducts(latest);
    } else {
      toast.error(result.error ?? 'Failed to duplicate');
    }
    setActionLoading(null);
  }

  async function handleToggleVisibility(product: AdminProduct) {
    setActionLoading(product.id + '-vis');
    const result = await toggleProductVisibility(product.id, product.status);
    setActionLoading(null);
    if (result.success) {
      const newStatus = product.status === 'hidden' ? 'active' : 'hidden';
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, status: newStatus as AdminProduct['status'] } : p))
      );
      toast.success(newStatus === 'hidden' ? 'Product hidden' : 'Product visible');
    } else {
      toast.error(result.error ?? 'Failed to update');
    }
  }

  async function handleToggleFeatured(product: AdminProduct) {
    setActionLoading(product.id + '-feat');
    const result = await updateProduct(product.id, { featured: !product.featured });
    setActionLoading(null);
    if (result.success) {
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, featured: !p.featured } : p))
      );
      toast.success(product.featured ? 'Removed from featured' : 'Marked as featured');
    } else {
      toast.error(result.error ?? 'Failed to update');
    }
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="space-y-4">
      {/* Filters bar */}
      <div className="admin-card p-4 flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9B9BA4]" />
          <input
            type="text"
            placeholder="Search products…"
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
            className="admin-input pl-9 h-9 text-[13px]"
          />
        </div>

        {/* Category filter */}
        <select
          value={filters.category}
          onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
          className="admin-input h-9 text-[13px] w-full sm:w-36 cursor-pointer"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
          ))}
        </select>

        {/* Status filter */}
        <select
          value={filters.status}
          onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
          className="admin-input h-9 text-[13px] w-full sm:w-36 cursor-pointer capitalize"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s} className="capitalize">
              {s === 'All' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>

        {/* Add button */}
        <Link
          href="/admin/products/new"
          className="admin-btn-primary h-9 px-4 text-[13px] whitespace-nowrap shrink-0"
        >
          <Plus size={14} />
          Add Product
        </Link>
      </div>

      {/* Table */}
      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="w-14">Image</th>
                <th>
                  <button onClick={() => toggleSort('name')} className="flex items-center gap-1 hover:text-[#111] transition-colors">
                    Name <SortIcon field="name" />
                  </button>
                </th>
                <th>
                  <button onClick={() => toggleSort('category')} className="flex items-center gap-1 hover:text-[#111] transition-colors">
                    Category <SortIcon field="category" />
                  </button>
                </th>
                <th>
                  <button onClick={() => toggleSort('price')} className="flex items-center gap-1 hover:text-[#111] transition-colors">
                    Price <SortIcon field="price" />
                  </button>
                </th>
                <th>Status</th>
                <th>Featured</th>
                <th>
                  <button onClick={() => toggleSort('updated_at')} className="flex items-center gap-1 hover:text-[#111] transition-colors">
                    Updated <SortIcon field="updated_at" />
                  </button>
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-0">
                    <EmptyState
                      title="No products found"
                      description={filters.search || filters.category !== 'All' || filters.status !== 'All'
                        ? 'Try adjusting your filters'
                        : 'Start by adding your first product'
                      }
                      action={{ label: 'Add Product', href: '/admin/products/new' }}
                    />
                  </td>
                </tr>
              ) : (
                filtered.map((product, idx) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="group"
                  >
                    {/* Image */}
                    <td>
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-black/[0.06] bg-[#F4F4F6] shrink-0">
                        {product.images?.[0] ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#C0C0C8] text-xs">?</div>
                        )}
                      </div>
                    </td>

                    {/* Name */}
                    <td>
                      <p className="font-semibold text-[#111111] text-[13.5px]">{product.name}</p>
                      {product.description && (
                        <p className="text-[11.5px] text-[#9B9BA4] mt-0.5 max-w-[180px] truncate">{product.description}</p>
                      )}
                    </td>

                    {/* Category */}
                    <td>
                      <span className="text-[12.5px] text-[#6B6B70]">{product.category}</span>
                    </td>

                    {/* Price */}
                    <td>
                      <span className="font-semibold text-[13.5px] text-[#111111]">
                        Rs. {product.price.toLocaleString()}
                      </span>
                    </td>

                    {/* Status */}
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

                    {/* Featured */}
                    <td>
                      <button
                        onClick={() => handleToggleFeatured(product)}
                        disabled={actionLoading === product.id + '-feat'}
                        className="p-1 rounded-lg hover:bg-black/5 transition-colors"
                        title={product.featured ? 'Remove from featured' : 'Mark as featured'}
                      >
                        {product.featured ? (
                          <Star size={15} className="text-[#C9A227] fill-[#C9A227]" />
                        ) : (
                          <StarOff size={15} className="text-[#C0C0C8]" />
                        )}
                      </button>
                    </td>

                    {/* Updated */}
                    <td>
                      <span className="text-[12px] text-[#9B9BA4]">{formatDate(product.updated_at)}</span>
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="flex items-center gap-1">
                        {/* Edit */}
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-black/5 transition-colors text-[#6B6B70] hover:text-[#111]"
                          title="Edit"
                        >
                          <Edit2 size={13} />
                        </Link>

                        {/* Duplicate */}
                        <button
                          onClick={() => handleDuplicate(product.id)}
                          disabled={actionLoading === product.id + '-dup'}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-black/5 transition-colors text-[#6B6B70] hover:text-[#111]"
                          title="Duplicate"
                        >
                          <Copy size={13} />
                        </button>

                        {/* Toggle visibility */}
                        <button
                          onClick={() => handleToggleVisibility(product)}
                          disabled={actionLoading === product.id + '-vis'}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-black/5 transition-colors text-[#6B6B70] hover:text-[#111]"
                          title={product.status === 'hidden' ? 'Show' : 'Hide'}
                        >
                          {product.status === 'hidden' ? <Eye size={13} /> : <EyeOff size={13} />}
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => setDeleteId(product.id)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 transition-colors text-[#9B9BA4] hover:text-red-500"
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-black/[0.06] flex items-center justify-between">
            <p className="text-[12px] text-[#9B9BA4]">
              Showing <span className="font-semibold text-[#111]">{filtered.length}</span> of{' '}
              <span className="font-semibold text-[#111]">{products.length}</span> products
            </p>
          </div>
        )}
      </div>

      {/* Delete modal */}
      <DeleteModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => handleDelete(deleteId!)}
        title="Delete Product"
        description="Are you sure you want to permanently delete this product? This action cannot be undone."
      />
    </div>
  );
}
