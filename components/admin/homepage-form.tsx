'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Save, Loader2, Globe, Star, X } from 'lucide-react';
import { toast } from 'sonner';
import type { HomepageSettings, AdminProduct } from '@/types/admin';
import { updateHomepageSettings } from '@/lib/homepage-actions';
import ImageUploader from '@/components/admin/image-uploader';

interface HomepageFormProps {
  initialSettings: HomepageSettings | null;
  allProducts: AdminProduct[];
}

export default function HomepageForm({ initialSettings, allProducts }: HomepageFormProps) {
  const [values, setValues] = useState({
    hero_title: initialSettings?.hero_title ?? 'BUILD DIFFERENT.',
    hero_subtitle: initialSettings?.hero_subtitle ?? 'Premium streetwear engineered for those who refuse to blend in.',
    hero_button: initialSettings?.hero_button ?? 'Shop Now',
    hero_button_link: initialSettings?.hero_button_link ?? '/shop',
    hero_image: initialSettings?.hero_image ? [initialSettings.hero_image] : [] as string[],
    announcement: initialSettings?.announcement ?? '🔥 New Drop: Limited Edition Collection — WhatsApp to Order',
    featured_products: initialSettings?.featured_products ?? [] as string[],
  });

  const [isPending, startTransition] = useTransition();

  function set(key: string, val: any) {
    setValues((prev) => ({ ...prev, [key]: val }));
  }

  function toggleFeatured(id: string) {
    const selected = values.featured_products.includes(id);
    set(
      'featured_products',
      selected
        ? values.featured_products.filter((pid) => pid !== id)
        : [...values.featured_products, id]
    );
  }

  function handleSave() {
    startTransition(async () => {
      const result = await updateHomepageSettings({
        hero_title: values.hero_title,
        hero_subtitle: values.hero_subtitle,
        hero_button: values.hero_button,
        hero_button_link: values.hero_button_link,
        hero_image: values.hero_image[0] ?? null,
        announcement: values.announcement,
        featured_products: values.featured_products,
      });
      if (result.success) {
        toast.success('Homepage updated successfully');
      } else {
        toast.error(result.error ?? 'Failed to save');
      }
    });
  }

  const activeProducts = allProducts.filter((p) => p.status === 'active');

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Hero Section Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="admin-card p-6 space-y-5"
      >
        <h2 className="text-[14px] font-semibold text-[#111111] border-b border-black/[0.06] pb-3 flex items-center gap-2">
          <Globe size={15} className="text-[#C9A227]" />
          Hero Section
        </h2>

        <div>
          <label className="block text-[12px] font-semibold text-[#6B6B70] uppercase tracking-wider mb-1.5">
            Hero Title
          </label>
          <input
            type="text"
            value={values.hero_title}
            onChange={(e) => set('hero_title', e.target.value)}
            placeholder="BUILD DIFFERENT."
            className="admin-input text-[16px] font-bold"
          />
        </div>

        <div>
          <label className="block text-[12px] font-semibold text-[#6B6B70] uppercase tracking-wider mb-1.5">
            Hero Subtitle
          </label>
          <textarea
            value={values.hero_subtitle}
            onChange={(e) => set('hero_subtitle', e.target.value)}
            placeholder="Premium streetwear engineered for those who refuse to blend in."
            rows={3}
            className="admin-input resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[12px] font-semibold text-[#6B6B70] uppercase tracking-wider mb-1.5">
              Button Text
            </label>
            <input
              type="text"
              value={values.hero_button}
              onChange={(e) => set('hero_button', e.target.value)}
              placeholder="Shop Now"
              className="admin-input"
            />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-[#6B6B70] uppercase tracking-wider mb-1.5">
              Button Link
            </label>
            <input
              type="text"
              value={values.hero_button_link}
              onChange={(e) => set('hero_button_link', e.target.value)}
              placeholder="/shop"
              className="admin-input font-mono text-[13px]"
            />
          </div>
        </div>

        {/* Hero Image */}
        <div>
          <label className="block text-[12px] font-semibold text-[#6B6B70] uppercase tracking-wider mb-1.5">
            Hero Banner Image
          </label>
          <ImageUploader
            value={values.hero_image}
            onChange={(urls) => set('hero_image', urls)}
            folder="homepage"
            maxFiles={1}
          />
        </div>
      </motion.div>

      {/* Announcement Bar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
        className="admin-card p-6 space-y-4"
      >
        <h2 className="text-[14px] font-semibold text-[#111111] border-b border-black/[0.06] pb-3">
          Announcement Bar
        </h2>
        <div>
          <label className="block text-[12px] font-semibold text-[#6B6B70] uppercase tracking-wider mb-1.5">
            Announcement Text
          </label>
          <input
            type="text"
            value={values.announcement}
            onChange={(e) => set('announcement', e.target.value)}
            placeholder="🔥 New Drop — Limited Edition. WhatsApp to Order"
            className="admin-input"
          />
          <p className="text-[11px] text-[#9B9BA4] mt-1.5">
            This text appears in the top announcement bar on your store.
          </p>
        </div>
      </motion.div>

      {/* Featured Products */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="admin-card p-6"
      >
        <div className="flex items-center justify-between border-b border-black/[0.06] pb-3 mb-4">
          <h2 className="text-[14px] font-semibold text-[#111111] flex items-center gap-2">
            <Star size={15} className="text-[#C9A227]" />
            Featured Products
          </h2>
          <span className="text-[12px] text-[#9B9BA4]">
            {values.featured_products.length} selected
          </span>
        </div>

        {activeProducts.length === 0 ? (
          <p className="text-[13px] text-[#9B9BA4] py-4 text-center">No active products found.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {activeProducts.map((product) => {
              const selected = values.featured_products.includes(product.id);
              return (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => toggleFeatured(product.id)}
                  className={`relative rounded-xl border text-left transition-all duration-150 overflow-hidden ${
                    selected
                      ? 'border-[#C9A227] shadow-[0_0_0_2px_rgba(201,162,39,0.2)]'
                      : 'border-black/[0.08] hover:border-black/20'
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="aspect-square relative bg-[#F4F4F6]">
                    {product.images?.[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="140px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#C0C0C8] text-xs">?</div>
                    )}
                    {selected && (
                      <div className="absolute inset-0 bg-[#C9A227]/10 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-[#C9A227] flex items-center justify-center shadow-md">
                          <Star size={12} className="text-white fill-white" />
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Name */}
                  <div className="p-2">
                    <p className="text-[12px] font-semibold text-[#111111] truncate">{product.name}</p>
                    <p className="text-[11px] text-[#9B9BA4]">Rs. {product.price.toLocaleString()}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Save Button */}
      <div className="flex gap-3 pb-8">
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="admin-btn-primary"
        >
          {isPending ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Saving…
            </>
          ) : (
            <>
              <Save size={15} />
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}
