'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, Save, X, Plus } from 'lucide-react';
import { toast } from 'sonner';
import type { AdminProduct, ProductFormValues, ProductCategory, ProductSize, ProductStatus } from '@/types/admin';
import { createProduct, updateProduct } from '@/lib/product-actions';
import ImageUploader from './image-uploader';

const SIZES: ProductSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const CATEGORIES: ProductCategory[] = ['Tops', 'Pants', 'Outerwear', 'Accessories'];
const STATUSES: { value: ProductStatus; label: string; description: string }[] = [
  { value: 'active', label: 'Active', description: 'Visible on store' },
  { value: 'draft', label: 'Draft', description: 'Hidden from store' },
  { value: 'hidden', label: 'Hidden', description: 'Manually hidden' },
];

interface ProductFormProps {
  product?: AdminProduct;
  isEditing?: boolean;
}

export default function ProductForm({ product, isEditing = false }: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [values, setValues] = useState<ProductFormValues>({
    name: product?.name ?? '',
    description: product?.description ?? '',
    category: product?.category ?? 'Tops',
    price: product?.price ?? 0,
    sizes: product?.sizes ?? [],
    colors: product?.colors ?? [],
    images: product?.images ?? [],
    featured: product?.featured ?? false,
    status: product?.status ?? 'draft',
  });

  const [colorInput, setColorInput] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormValues, string>>>({});

  function set<K extends keyof ProductFormValues>(key: K, val: ProductFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function toggleSize(size: ProductSize) {
    set('sizes', values.sizes.includes(size)
      ? values.sizes.filter((s) => s !== size)
      : [...values.sizes, size]
    );
  }

  function addColor() {
    const color = colorInput.trim();
    if (!color) return;
    if (!values.colors.includes(color)) {
      set('colors', [...values.colors, color]);
    }
    setColorInput('');
  }

  function removeColor(color: string) {
    set('colors', values.colors.filter((c) => c !== color));
  }

  function validate(): boolean {
    const newErrors: typeof errors = {};
    if (!values.name.trim()) newErrors.name = 'Product name is required';
    if (!values.description.trim()) newErrors.description = 'Description is required';
    if (values.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (values.sizes.length === 0) newErrors.sizes = 'Select at least one size';
    if (values.images.length === 0) newErrors.images = 'Add at least one image';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fix the errors below');
      return;
    }

    startTransition(async () => {
      try {
        if (isEditing && product?.id) {
          const result = await updateProduct(product.id, values);
          if (result.success) {
            toast.success('Product updated successfully');
            router.push('/admin/products');
          } else {
            toast.error(result.error ?? 'Failed to update');
          }
        } else {
          const result = await createProduct(values);
          if (result.success) {
            toast.success('Product created successfully');
            router.push('/admin/products');
          } else {
            toast.error(result.error ?? 'Failed to create');
          }
        }
      } catch {
        toast.error('An unexpected error occurred');
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {/* Product Details Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="admin-card p-6 space-y-5"
      >
        <h2 className="text-[14px] font-semibold text-[#111111] border-b border-black/[0.06] pb-3">
          Product Details
        </h2>

        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-[12px] font-semibold text-[#6B6B70] uppercase tracking-wider mb-1.5">
            Product Name *
          </label>
          <input
            id="name"
            type="text"
            value={values.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="e.g. Barrel Pants"
            className={`admin-input ${errors.name ? 'border-red-300 focus:border-red-400' : ''}`}
          />
          {errors.name && <p className="text-red-500 text-[12px] mt-1">{errors.name}</p>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-[12px] font-semibold text-[#6B6B70] uppercase tracking-wider mb-1.5">
            Description *
          </label>
          <textarea
            id="description"
            value={values.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder="Describe the product, materials, fit, and design details…"
            rows={4}
            className={`admin-input resize-none ${errors.description ? 'border-red-300' : ''}`}
          />
          {errors.description && <p className="text-red-500 text-[12px] mt-1">{errors.description}</p>}
        </div>

        {/* Category + Price */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-[12px] font-semibold text-[#6B6B70] uppercase tracking-wider mb-1.5">
              Category
            </label>
            <select
              id="category"
              value={values.category}
              onChange={(e) => set('category', e.target.value as ProductCategory)}
              className="admin-input cursor-pointer"
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="price" className="block text-[12px] font-semibold text-[#6B6B70] uppercase tracking-wider mb-1.5">
              Price (NPR) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] font-medium text-[#9B9BA4]">Rs.</span>
              <input
                id="price"
                type="number"
                min={0}
                step={50}
                value={values.price || ''}
                onChange={(e) => set('price', parseFloat(e.target.value) || 0)}
                placeholder="1350"
                className={`admin-input pl-10 ${errors.price ? 'border-red-300' : ''}`}
              />
            </div>
            {errors.price && <p className="text-red-500 text-[12px] mt-1">{errors.price}</p>}
          </div>
        </div>
      </motion.div>

      {/* Sizes Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
        className="admin-card p-6"
      >
        <h2 className="text-[14px] font-semibold text-[#111111] border-b border-black/[0.06] pb-3 mb-4">
          Sizes *
        </h2>
        <div className="flex flex-wrap gap-2.5">
          {SIZES.map((size) => {
            const selected = values.sizes.includes(size);
            return (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                className={`h-10 w-16 rounded-xl border text-[13px] font-semibold transition-all duration-150 ${
                  selected
                    ? 'bg-[#111111] text-white border-[#111111] shadow-sm'
                    : 'bg-white text-[#6B6B70] border-black/[0.1] hover:border-[#111] hover:text-[#111]'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
        {errors.sizes && <p className="text-red-500 text-[12px] mt-2">{errors.sizes}</p>}
      </motion.div>

      {/* Colors Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        className="admin-card p-6"
      >
        <h2 className="text-[14px] font-semibold text-[#111111] border-b border-black/[0.06] pb-3 mb-4">
          Colors
        </h2>

        {/* Color swatches */}
        {values.colors.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {values.colors.map((color) => (
              <div key={color} className="group flex items-center gap-1.5 bg-[#F4F4F6] rounded-lg px-2.5 py-1.5">
                <div
                  className="w-4 h-4 rounded-full border border-black/10 shadow-sm shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span className="text-[12px] font-mono text-[#6B6B70]">{color}</span>
                <button
                  type="button"
                  onClick={() => removeColor(color)}
                  className="text-[#9B9BA4] hover:text-red-400 transition-colors ml-0.5"
                >
                  <X size={11} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Color input */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="color"
              value={colorInput.startsWith('#') ? colorInput : '#000000'}
              onChange={(e) => setColorInput(e.target.value)}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded cursor-pointer border-0 p-0 bg-transparent"
              title="Pick color"
            />
            <input
              type="text"
              value={colorInput}
              onChange={(e) => setColorInput(e.target.value)}
              placeholder="#D4AF37 or color name"
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
              className="admin-input pl-10 h-10 text-[13px] font-mono"
            />
          </div>
          <button
            type="button"
            onClick={addColor}
            className="admin-btn-secondary h-10 px-4 shrink-0"
          >
            <Plus size={14} />
            Add
          </button>
        </div>
      </motion.div>

      {/* Images Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.11, ease: [0.16, 1, 0.3, 1] }}
        className="admin-card p-6"
      >
        <h2 className="text-[14px] font-semibold text-[#111111] border-b border-black/[0.06] pb-3 mb-4">
          Images *
        </h2>
        <ImageUploader
          value={values.images}
          onChange={(urls) => set('images', urls)}
        />
        {errors.images && <p className="text-red-500 text-[12px] mt-2">{errors.images}</p>}
      </motion.div>

      {/* Settings Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
        className="admin-card p-6 space-y-5"
      >
        <h2 className="text-[14px] font-semibold text-[#111111] border-b border-black/[0.06] pb-3">
          Settings
        </h2>

        {/* Featured */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[13.5px] font-semibold text-[#111111]">Featured Product</p>
            <p className="text-[12px] text-[#9B9BA4] mt-0.5">Show on homepage featured section</p>
          </div>
          <button
            type="button"
            onClick={() => set('featured', !values.featured)}
            className={`admin-toggle ${values.featured ? 'on' : ''}`}
            role="switch"
            aria-checked={values.featured}
          />
        </div>

        {/* Status */}
        <div>
          <p className="text-[12px] font-semibold text-[#6B6B70] uppercase tracking-wider mb-3">Status</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {STATUSES.map(({ value, label, description }) => (
              <button
                key={value}
                type="button"
                onClick={() => set('status', value)}
                className={`text-left p-3.5 rounded-xl border transition-all duration-150 ${
                  values.status === value
                    ? 'border-[#111111] bg-[#111111] text-white shadow-sm'
                    : 'border-black/[0.08] bg-white hover:border-black/20'
                }`}
              >
                <p className={`text-[13px] font-semibold ${values.status === value ? 'text-white' : 'text-[#111111]'}`}>
                  {label}
                </p>
                <p className={`text-[11px] mt-0.5 ${values.status === value ? 'text-white/60' : 'text-[#9B9BA4]'}`}>
                  {description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Submit buttons */}
      <div className="flex items-center gap-3 pb-8">
        <button
          type="submit"
          disabled={isPending}
          className="admin-btn-primary"
        >
          {isPending ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              {isEditing ? 'Saving…' : 'Creating…'}
            </>
          ) : (
            <>
              <Save size={15} />
              {isEditing ? 'Save Changes' : 'Create Product'}
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="admin-btn-secondary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
