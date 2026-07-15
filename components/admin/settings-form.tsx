'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Save, Loader2, Store, MessageCircle, Instagram, Facebook, FileText } from 'lucide-react';
import { toast } from 'sonner';
import type { StoreSettings } from '@/types/admin';
import { updateStoreSettings } from '@/lib/homepage-actions';
import ImageUploader from '@/components/admin/image-uploader';

interface SettingsFormProps {
  initialSettings: StoreSettings | null;
}

export default function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [values, setValues] = useState({
    store_name: initialSettings?.store_name ?? 'NINE77',
    logo: initialSettings?.logo ? [initialSettings.logo] : [] as string[],
    whatsapp: initialSettings?.whatsapp ?? '',
    instagram: initialSettings?.instagram ?? '',
    facebook: initialSettings?.facebook ?? '',
    footer: initialSettings?.footer ?? '© 2025 NINE77. All rights reserved.',
  });

  const [isPending, startTransition] = useTransition();

  function set(key: string, val: any) {
    setValues((prev) => ({ ...prev, [key]: val }));
  }

  function handleSave() {
    startTransition(async () => {
      const result = await updateStoreSettings({
        store_name: values.store_name,
        logo: values.logo[0] ?? null,
        whatsapp: values.whatsapp,
        instagram: values.instagram,
        facebook: values.facebook,
        footer: values.footer,
      });
      if (result.success) {
        toast.success('Settings saved successfully');
      } else {
        toast.error(result.error ?? 'Failed to save settings');
      }
    });
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Store Info */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="admin-card p-6 space-y-5"
      >
        <h2 className="text-[14px] font-semibold text-[#111111] border-b border-black/[0.06] pb-3 flex items-center gap-2">
          <Store size={15} className="text-[#C9A227]" />
          Store Information
        </h2>

        {/* Store Name */}
        <div>
          <label className="block text-[12px] font-semibold text-[#6B6B70] uppercase tracking-wider mb-1.5">
            Store Name
          </label>
          <input
            type="text"
            value={values.store_name}
            onChange={(e) => set('store_name', e.target.value)}
            placeholder="NINE77"
            className="admin-input font-bold text-[15px]"
          />
        </div>

        {/* Logo Upload */}
        <div>
          <label className="block text-[12px] font-semibold text-[#6B6B70] uppercase tracking-wider mb-1.5">
            Store Logo
          </label>
          {values.logo.length > 0 && (
            <div className="mb-3 p-3 bg-[#F4F4F6] rounded-xl inline-flex items-center gap-3">
              <Image
                src={values.logo[0]}
                alt="Store logo"
                width={60}
                height={60}
                className="object-contain"
              />
              <p className="text-[12px] text-[#6B6B70]">Current logo</p>
            </div>
          )}
          <ImageUploader
            value={values.logo}
            onChange={(urls) => set('logo', urls)}
            folder="settings"
            maxFiles={1}
          />
        </div>
      </motion.div>

      {/* Social Links */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
        className="admin-card p-6 space-y-5"
      >
        <h2 className="text-[14px] font-semibold text-[#111111] border-b border-black/[0.06] pb-3">
          Social & Contact Links
        </h2>

        {/* WhatsApp */}
        <div>
          <label className="block text-[12px] font-semibold text-[#6B6B70] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <MessageCircle size={12} className="text-green-500" />
            WhatsApp Number
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-[#9B9BA4] font-medium">+</span>
            <input
              type="tel"
              value={values.whatsapp}
              onChange={(e) => set('whatsapp', e.target.value)}
              placeholder="9779812345678"
              className="admin-input pl-7 font-mono text-[13px]"
            />
          </div>
          <p className="text-[11px] text-[#9B9BA4] mt-1">Include country code, e.g. 977xxxxxxxxxx for Nepal</p>
        </div>

        {/* Instagram */}
        <div>
          <label className="block text-[12px] font-semibold text-[#6B6B70] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Instagram size={12} className="text-pink-500" />
            Instagram Link
          </label>
          <input
            type="url"
            value={values.instagram}
            onChange={(e) => set('instagram', e.target.value)}
            placeholder="https://instagram.com/nine77store"
            className="admin-input font-mono text-[13px]"
          />
        </div>

        {/* Facebook */}
        <div>
          <label className="block text-[12px] font-semibold text-[#6B6B70] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Facebook size={12} className="text-blue-500" />
            Facebook Link
          </label>
          <input
            type="url"
            value={values.facebook}
            onChange={(e) => set('facebook', e.target.value)}
            placeholder="https://facebook.com/nine77store"
            className="admin-input font-mono text-[13px]"
          />
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="admin-card p-6 space-y-4"
      >
        <h2 className="text-[14px] font-semibold text-[#111111] border-b border-black/[0.06] pb-3 flex items-center gap-2">
          <FileText size={15} className="text-[#C9A227]" />
          Footer
        </h2>
        <div>
          <label className="block text-[12px] font-semibold text-[#6B6B70] uppercase tracking-wider mb-1.5">
            Footer Copyright Text
          </label>
          <input
            type="text"
            value={values.footer}
            onChange={(e) => set('footer', e.target.value)}
            placeholder="© 2025 NINE77. All rights reserved."
            className="admin-input"
          />
        </div>
      </motion.div>

      {/* Save */}
      <div className="pb-8">
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
              Save Settings
            </>
          )}
        </button>
      </div>
    </div>
  );
}
