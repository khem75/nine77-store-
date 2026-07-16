'use client';

import { useState, useTransition, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save,
  Loader2,
  Globe,
  Star,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Edit,
  Eye,
  Sliders,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import type { HomepageSettings, AdminProduct } from '@/types/admin';
import type { Campaign, CampaignStatus, CampaignMediaType, LocalizedString } from '@/types/campaign';
import { updateHomepageSettings } from '@/lib/homepage-actions';
import {
  createCampaign,
  updateCampaign,
  deleteCampaign,
  reorderCampaigns,
} from '@/lib/campaign-actions';
import ImageUploader from '@/components/admin/image-uploader';
import Hero from '@/components/Hero';

interface HomepageFormProps {
  initialSettings: HomepageSettings | null;
  allProducts: AdminProduct[];
  initialCampaigns: Campaign[];
}

export default function HomepageForm({
  initialSettings,
  allProducts,
  initialCampaigns = [],
}: HomepageFormProps) {
  // Current active tab: 'general' | 'campaigns'
  const [activeTab, setActiveTab] = useState<'general' | 'campaigns'>('campaigns');

  // Core homepage settings state
  const [values, setValues] = useState({
    hero_title: initialSettings?.hero_title ?? 'BUILD DIFFERENT.',
    hero_subtitle:
      initialSettings?.hero_subtitle ??
      'Premium streetwear engineered for those who refuse to blend in.',
    hero_button: initialSettings?.hero_button ?? 'Shop Now',
    hero_button_link: initialSettings?.hero_button_link ?? '/shop',
    hero_image: initialSettings?.hero_image ? [initialSettings.hero_image] : ([] as string[]),
    announcement:
      initialSettings?.announcement ??
      '🔥 New Drop: Limited Edition Collection — WhatsApp to Order',
    featured_products: initialSettings?.featured_products ?? ([] as string[]),
  });

  // Campaigns list state
  const [campaignsList, setCampaignsList] = useState<Campaign[]>(initialCampaigns);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  // Edit fields state
  const [editTitleEn, setEditTitleEn] = useState('');
  const [editTitleNp, setEditTitleNp] = useState('');
  const [editSubtitleEn, setEditSubtitleEn] = useState('');
  const [editSubtitleNp, setEditSubtitleNp] = useState('');
  const [editTaglineEn, setEditTaglineEn] = useState('');
  const [editTaglineNp, setEditTaglineNp] = useState('');
  const [editDesktopUrl, setEditDesktopUrl] = useState<string[]>([]);
  const [editMobileUrl, setEditMobileUrl] = useState<string[]>([]);
  const [editFocalX, setEditFocalX] = useState(50);
  const [editFocalY, setEditFocalY] = useState(50);
  const [editCta, setEditCta] = useState('');
  const [editSecondaryCta, setEditSecondaryCta] = useState('');
  const [editCtaLink, setEditCtaLink] = useState('');
  const [editAccent, setEditAccent] = useState('#c8a84b');
  const [editOverlay, setEditOverlay] = useState<'dark' | 'light'>('dark');
  const [editTextTheme, setEditTextTheme] = useState<'light' | 'dark'>('light');
  const [editButtonTheme, setEditButtonTheme] = useState<'gold' | 'white' | 'dark'>('gold');
  const [editStatus, setEditStatus] = useState<CampaignStatus>('draft');
  const [editPublishAt, setEditPublishAt] = useState('');
  const [editExpiresAt, setEditExpiresAt] = useState('');
  const [editMediaType, setEditMediaType] = useState<CampaignMediaType>('image');

  // Preview options
  const [previewAsPublished, setPreviewAsPublished] = useState(false);

  const [isPending, startTransition] = useTransition();

  // Load selected campaign data into form fields
  useEffect(() => {
    if (selectedCampaign) {
      const c = selectedCampaign;
      setEditTitleEn(typeof c.title === 'string' ? c.title : c.title?.en || '');
      setEditTitleNp(typeof c.title === 'string' ? '' : c.title?.np || '');
      
      setEditSubtitleEn(typeof c.subtitle === 'string' ? c.subtitle : c.subtitle?.en || '');
      setEditSubtitleNp(typeof c.subtitle === 'string' ? '' : c.subtitle?.np || '');
      
      setEditTaglineEn(typeof c.tagline === 'string' ? c.tagline : c.tagline?.en || '');
      setEditTaglineNp(typeof c.tagline === 'string' ? '' : c.tagline?.np || '');
      
      setEditDesktopUrl(c.media?.desktop?.url ? [c.media.desktop.url] : []);
      setEditMobileUrl(c.media?.mobile?.url ? [c.media.mobile.url] : []);
      
      setEditFocalX(c.media?.desktop?.focalPoint?.x ?? 50);
      setEditFocalY(c.media?.desktop?.focalPoint?.y ?? 50);
      
      setEditCta(c.cta || '');
      setEditSecondaryCta(c.secondaryCta || '');
      setEditCtaLink(c.ctaLink || '');
      
      setEditAccent(c.theme?.accent || '#c8a84b');
      setEditOverlay(c.theme?.overlay || 'dark');
      setEditTextTheme(c.theme?.text || 'light');
      setEditButtonTheme(c.theme?.button || 'gold');
      
      setEditStatus(c.status || 'draft');
      setEditPublishAt(c.publish_at ? c.publish_at.slice(0, 16) : '');
      setEditExpiresAt(c.expires_at ? c.expires_at.slice(0, 16) : '');
      setEditMediaType(c.type || 'image');
    } else {
      clearForm();
    }
  }, [selectedCampaign]);

  function clearForm() {
    setEditTitleEn('');
    setEditTitleNp('');
    setEditSubtitleEn('');
    setEditSubtitleNp('');
    setEditTaglineEn('');
    setEditTaglineNp('');
    setEditDesktopUrl([]);
    setEditMobileUrl([]);
    setEditFocalX(50);
    setEditFocalY(50);
    setEditCta('Shop Collection');
    setEditSecondaryCta('Explore');
    setEditCtaLink('/shop');
    setEditAccent('#c8a84b');
    setEditOverlay('dark');
    setEditTextTheme('light');
    setEditButtonTheme('gold');
    setEditStatus('draft');
    setEditPublishAt('');
    setEditExpiresAt('');
    setEditMediaType('image');
  }

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

  function handleSaveGeneral() {
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
        toast.success('Core homepage settings updated');
      } else {
        toast.error(result.error ?? 'Failed to save');
      }
    });
  }

  // Publish validation checks
  function validateCampaignInput(): boolean {
    if (!editTitleEn.trim()) {
      toast.error('Campaign Title (English) is required');
      return false;
    }
    if (editDesktopUrl.length === 0) {
      toast.error('Desktop media asset is required');
      return false;
    }
    if (!editCta.trim()) {
      toast.error('Button CTA label is required');
      return false;
    }
    if (!editCtaLink.trim()) {
      toast.error('CTA URL target link is required');
      return false;
    }
    
    // Scheduled publication times checking
    if (editStatus === 'scheduled' && !editPublishAt) {
      toast.error('Publishing date-time is required for scheduled campaigns');
      return false;
    }

    return true;
  }

  function handleSaveCampaign() {
    if (!validateCampaignInput()) return;

    const title: LocalizedString = { en: editTitleEn };
    if (editTitleNp) title.np = editTitleNp;

    const subtitle: LocalizedString = { en: editSubtitleEn };
    if (editSubtitleNp) subtitle.np = editSubtitleNp;

    const tagline: LocalizedString = { en: editTaglineEn };
    if (editTaglineNp) tagline.np = editTaglineNp;

    const media = {
      desktop: {
        url: editDesktopUrl[0],
        alt: `${editTitleEn} Desktop Media`,
        focalPoint: { x: editFocalX, y: editFocalY },
      },
      mobile: {
        url: editMobileUrl[0] || editDesktopUrl[0],
        alt: `${editTitleEn} Mobile Media`,
        focalPoint: { x: editFocalX, y: editFocalY },
      },
    };

    const campaignData = {
      title,
      subtitle,
      tagline,
      media,
      type: editMediaType,
      cta: editCta,
      secondaryCta: editSecondaryCta || undefined,
      ctaLink: editCtaLink,
      theme: {
        accent: editAccent,
        overlay: editOverlay,
        text: editTextTheme,
        button: editButtonTheme,
      },
      status: editStatus,
      publish_at: editPublishAt ? new Date(editPublishAt).toISOString() : undefined,
      expires_at: editExpiresAt ? new Date(editExpiresAt).toISOString() : undefined,
      order: selectedCampaign ? selectedCampaign.order : campaignsList.length,
    };

    startTransition(async () => {
      if (selectedCampaign) {
        // Update Campaign
        const result = await updateCampaign(selectedCampaign.id, campaignData as any);
        if (result.success) {
          toast.success('Campaign updated successfully');
          setCampaignsList((prev) =>
            prev.map((c) => (c.id === selectedCampaign.id ? { ...c, ...campaignData } as Campaign : c))
          );
          setSelectedCampaign(null);
        } else {
          toast.error(result.error ?? 'Failed to update campaign');
        }
      } else {
        // Create Campaign
        const result = await createCampaign(campaignData as any);
        if (result.success && result.data) {
          toast.success('Campaign created successfully');
          setCampaignsList((prev) => [...prev, result.data as Campaign]);
          clearForm();
        } else {
          toast.error(result.error ?? 'Failed to create campaign');
        }
      }
    });
  }

  function handleDeleteCampaign(id: string) {
    if (!confirm('Are you sure you want to delete this campaign? This action is permanent.')) return;

    startTransition(async () => {
      const result = await deleteCampaign(id);
      if (result.success) {
        toast.success('Campaign deleted successfully');
        setCampaignsList((prev) => prev.filter((c) => c.id !== id));
        if (selectedCampaign?.id === id) {
          setSelectedCampaign(null);
        }
      } else {
        toast.error(result.error ?? 'Failed to delete campaign');
      }
    });
  }

  // Campaign Reordering logic
  function moveCampaign(index: number, direction: 'up' | 'down') {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= campaignsList.length) return;

    const list = [...campaignsList];
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;

    // Recalculate order indices
    const updatedList = list.map((c, i) => ({ ...c, order: i }));
    setCampaignsList(updatedList);

    startTransition(async () => {
      const orderedIds = updatedList.map((c) => c.id);
      const result = await reorderCampaigns(orderedIds);
      if (!result.success) {
        toast.error('Reordering failed to synchronize with database');
      }
    });
  }

  // Get campaigns list to inject into client storefront Hero preview
  const getPreviewCampaigns = (): Campaign[] => {
    // If previewAsPublished is checked, filter out drafts or expired/future ones to see storefront view
    if (previewAsPublished) {
      const now = new Date();
      return campaignsList.filter((c) => {
        if (c.status !== 'published') return false;
        const pub = c.publish_at ? new Date(c.publish_at) : null;
        const exp = c.expires_at ? new Date(c.expires_at) : null;
        if (pub && pub > now) return false;
        if (exp && exp < now) return false;
        return true;
      });
    }
    
    // Default preview: show all active campaigns including drafts to see edits instantly!
    return campaignsList.filter((c) => c.status !== 'archived');
  };

  const activeProducts = allProducts.filter((p) => p.status === 'active');
  const previewCampaigns = getPreviewCampaigns();

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-4 border-b border-black/[0.08] pb-1">
        <button
          type="button"
          onClick={() => setActiveTab('campaigns')}
          className={`pb-2.5 text-[13px] font-bold uppercase tracking-wider transition-all border-b-2 ${
            activeTab === 'campaigns'
              ? 'border-[#C9A227] text-[#111111]'
              : 'border-transparent text-[#9B9BA4] hover:text-[#111111]'
          }`}
        >
          Campaigns Manager
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('general')}
          className={`pb-2.5 text-[13px] font-bold uppercase tracking-wider transition-all border-b-2 ${
            activeTab === 'general'
              ? 'border-[#C9A227] text-[#111111]'
              : 'border-transparent text-[#9B9BA4] hover:text-[#111111]'
          }`}
        >
          General Settings
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'general' ? (
          // TAB: General Settings
          <motion.div
            key="general"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="space-y-6 max-w-3xl"
          >
            <div className="admin-card p-6 space-y-5">
              <h2 className="text-[14px] font-semibold text-[#111111] border-b border-black/[0.06] pb-3 flex items-center gap-2">
                <Globe size={15} className="text-[#C9A227]" />
                Fallback Hero Config
              </h2>
              <div>
                <label className="block text-[11px] font-bold text-[#6B6B70] uppercase tracking-wider mb-1.5">
                  Hero Title
                </label>
                <input
                  type="text"
                  value={values.hero_title}
                  onChange={(e) => set('hero_title', e.target.value)}
                  className="admin-input text-[16px] font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#6B6B70] uppercase tracking-wider mb-1.5">
                  Hero Subtitle
                </label>
                <textarea
                  value={values.hero_subtitle}
                  onChange={(e) => set('hero_subtitle', e.target.value)}
                  rows={3}
                  className="admin-input resize-none"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#6B6B70] uppercase tracking-wider mb-1.5">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={values.hero_button}
                    onChange={(e) => set('hero_button', e.target.value)}
                    className="admin-input"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#6B6B70] uppercase tracking-wider mb-1.5">
                    Button Link
                  </label>
                  <input
                    type="text"
                    value={values.hero_button_link}
                    onChange={(e) => set('hero_button_link', e.target.value)}
                    className="admin-input font-mono text-[13px]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#6B6B70] uppercase tracking-wider mb-1.5">
                  Hero Banner Image
                </label>
                <ImageUploader
                  value={values.hero_image}
                  onChange={(urls) => set('hero_image', urls)}
                  folder="homepage"
                  maxFiles={1}
                />
              </div>
            </div>

            <div className="admin-card p-6 space-y-4">
              <h2 className="text-[14px] font-semibold text-[#111111] border-b border-black/[0.06] pb-3">
                Announcement Bar
              </h2>
              <div>
                <label className="block text-[11px] font-bold text-[#6B6B70] uppercase tracking-wider mb-1.5">
                  Announcement Text
                </label>
                <input
                  type="text"
                  value={values.announcement}
                  onChange={(e) => set('announcement', e.target.value)}
                  className="admin-input"
                />
              </div>
            </div>

            <div className="admin-card p-6">
              <div className="flex items-center justify-between border-b border-black/[0.06] pb-3 mb-4">
                <h2 className="text-[14px] font-semibold text-[#111111] flex items-center gap-2">
                  <Star size={15} className="text-[#C9A227]" />
                  Featured Products
                </h2>
                <span className="text-[12px] text-[#9B9BA4]">
                  {values.featured_products.length} selected
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {activeProducts.map((product) => {
                  const selected = values.featured_products.includes(product.id);
                  return (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => toggleFeatured(product.id)}
                      className={`relative rounded-xl border text-left transition-all overflow-hidden ${
                        selected ? 'border-[#C9A227] shadow-sm' : 'border-black/[0.08]'
                      }`}
                    >
                      <div className="aspect-square relative bg-[#F4F4F6]">
                        {product.images?.[0] && (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="120px"
                          />
                        )}
                      </div>
                      <div className="p-2">
                        <p className="text-[11px] font-semibold text-[#111111] truncate">
                          {product.name}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <button type="button" onClick={handleSaveGeneral} className="admin-btn-primary">
              {isPending ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
              Save Core Settings
            </button>
          </motion.div>
        ) : (
          // TAB: Campaigns Manager (Slideshow campaigns list + form + live editor!)
          <motion.div
            key="campaigns"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col lg:flex-row gap-6 w-full"
          >
            {/* Left pane: Campaigns List */}
            <div className="w-full lg:w-[35%] space-y-4">
              <div className="admin-card p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-black/[0.06] pb-3.5">
                  <h3 className="text-[13px] font-bold uppercase tracking-wider text-[#111111]">
                    Slideshow Campaigns
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCampaign(null);
                      clearForm();
                    }}
                    className="flex items-center gap-1 text-[11px] font-bold text-[#C9A227] hover:text-[#B0891A] border border-[#C9A227]/30 rounded-lg px-2 py-1 transition-colors"
                  >
                    <Plus size={12} />
                    New
                  </button>
                </div>

                {campaignsList.length === 0 ? (
                  <div className="text-center py-8 text-[#9B9BA4] text-xs">
                    No campaigns created yet. Click New to get started.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {campaignsList.map((c, i) => {
                      const isSelected = selectedCampaign?.id === c.id;
                      const titleStr = typeof c.title === 'string' ? c.title : c.title?.en || 'Untitled';
                      const badgeColors: Record<string, string> = {
                        draft: 'bg-neutral-100 text-neutral-600',
                        scheduled: 'bg-blue-50 text-blue-600',
                        published: 'bg-green-50 text-green-600',
                        archived: 'bg-red-50 text-red-600',
                      };

                      return (
                        <div
                          key={c.id}
                          className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                            isSelected
                              ? 'border-[#C9A227] bg-[#C9A227]/5'
                              : 'border-black/[0.06] hover:bg-neutral-50'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {/* Order adjustment buttons */}
                            <div className="flex flex-col gap-1">
                              <button
                                type="button"
                                onClick={() => moveCampaign(i, 'up')}
                                disabled={i === 0 || isPending}
                                className="text-neutral-400 hover:text-neutral-700 disabled:opacity-30"
                              >
                                <ArrowUp size={11} />
                              </button>
                              <button
                                type="button"
                                onClick={() => moveCampaign(i, 'down')}
                                disabled={i === campaignsList.length - 1 || isPending}
                                className="text-neutral-400 hover:text-neutral-700 disabled:opacity-30"
                              >
                                <ArrowDown size={11} />
                              </button>
                            </div>

                            {/* Tiny thumbnail */}
                            <div className="relative w-10 h-10 rounded-lg bg-neutral-100 overflow-hidden flex-shrink-0">
                              {c.media?.desktop?.url ? (
                                <Image
                                  src={c.media.desktop.url}
                                  alt=""
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-400">
                                  ?
                                </div>
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="text-[12px] font-bold text-[#111111] truncate">
                                {titleStr}
                              </p>
                              <span
                                className={`inline-block text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full mt-1 ${
                                  badgeColors[c.status] || 'bg-neutral-100 text-neutral-600'
                                }`}
                              >
                                {c.status}
                              </span>
                            </div>
                          </div>

                          {/* Quick buttons */}
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => setSelectedCampaign(c)}
                              className="p-1 text-[#6B6B70] hover:text-[#111111]"
                              title="Edit campaign"
                            >
                              <Edit size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCampaign(c.id)}
                              disabled={isPending}
                              className="p-1 text-red-500 hover:text-red-700"
                              title="Delete campaign"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Middle Pane: Editor Form fields */}
            <div className="w-full lg:w-[40%] space-y-4">
              <div className="admin-card p-5 space-y-4">
                <h3 className="text-[13px] font-bold uppercase tracking-wider text-[#111111] border-b border-black/[0.06] pb-3 flex items-center justify-between">
                  <span>{selectedCampaign ? 'Edit Campaign' : 'Create Campaign'}</span>
                  {selectedCampaign && (
                    <span className="text-[9px] font-mono text-[#9B9BA4]">
                      v{selectedCampaign.version}
                    </span>
                  )}
                </h3>

                {/* Status selector */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-[#6B6B70] uppercase tracking-wider mb-1">
                      Status
                    </label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as CampaignStatus)}
                      className="admin-input"
                    >
                      <option value="draft">Draft</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#6B6B70] uppercase tracking-wider mb-1">
                      Media Type
                    </label>
                    <select
                      value={editMediaType}
                      onChange={(e) => setEditMediaType(e.target.value as CampaignMediaType)}
                      className="admin-input"
                    >
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </select>
                  </div>
                </div>

                {/* Localized inputs for Titles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 border-t border-black/[0.04] pt-3">
                  <div>
                    <label className="block text-[10px] font-bold text-[#6B6B70] uppercase tracking-wider mb-1">
                      Title (English) *
                    </label>
                    <input
                      type="text"
                      value={editTitleEn}
                      onChange={(e) => setEditTitleEn(e.target.value)}
                      placeholder="e.g. NEW SEASON"
                      className="admin-input font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#6B6B70] uppercase tracking-wider mb-1">
                      Title (Nepalese translation)
                    </label>
                    <input
                      type="text"
                      value={editTitleNp}
                      onChange={(e) => setEditTitleNp(e.target.value)}
                      placeholder="e.g. नयाँ सिजन"
                      className="admin-input"
                    />
                  </div>
                </div>

                {/* Tagline */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-[#6B6B70] uppercase tracking-wider mb-1">
                      Tagline (English)
                    </label>
                    <input
                      type="text"
                      value={editTaglineEn}
                      onChange={(e) => setEditTaglineEn(e.target.value)}
                      placeholder="e.g. CORE ESSENTIALS"
                      className="admin-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#6B6B70] uppercase tracking-wider mb-1">
                      Tagline (Nepalese)
                    </label>
                    <input
                      type="text"
                      value={editTaglineNp}
                      onChange={(e) => setEditTaglineNp(e.target.value)}
                      placeholder="tagline translation"
                      className="admin-input text-xs"
                    />
                  </div>
                </div>

                {/* Subtitle description */}
                <div className="border-t border-black/[0.04] pt-3">
                  <label className="block text-[10px] font-bold text-[#6B6B70] uppercase tracking-wider mb-1">
                    Subtitle Description (English)
                  </label>
                  <textarea
                    value={editSubtitleEn}
                    onChange={(e) => setEditSubtitleEn(e.target.value)}
                    rows={2}
                    placeholder="Brief collection narrative..."
                    className="admin-input text-xs resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#6B6B70] uppercase tracking-wider mb-1">
                    Subtitle Description (Nepalese)
                  </label>
                  <textarea
                    value={editSubtitleNp}
                    onChange={(e) => setEditSubtitleNp(e.target.value)}
                    rows={2}
                    placeholder="subtitle translation..."
                    className="admin-input text-xs resize-none"
                  />
                </div>

                {/* Media assets */}
                <div className="border-t border-black/[0.04] pt-3 space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-[#6B6B70] uppercase tracking-wider mb-1.5 flex items-center justify-between">
                      <span>Desktop Media Asset *</span>
                      <span className="text-[9px] text-[#9B9BA4]">Recommended: 16:9 ratio</span>
                    </label>
                    <ImageUploader
                      value={editDesktopUrl}
                      onChange={(urls) => setEditDesktopUrl(urls)}
                      folder="campaigns"
                      maxFiles={1}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#6B6B70] uppercase tracking-wider mb-1.5 flex items-center justify-between">
                      <span>Mobile Media Asset (Optional Crop)</span>
                      <span className="text-[9px] text-[#9B9BA4]">Recommended: 9:16 portrait</span>
                    </label>
                    <ImageUploader
                      value={editMobileUrl}
                      onChange={(urls) => setEditMobileUrl(urls)}
                      folder="campaigns"
                      maxFiles={1}
                    />
                  </div>
                </div>

                {/* Sliders for custom focal point */}
                <div className="bg-neutral-50 rounded-xl p-3 border border-black/[0.04] space-y-3.5">
                  <span className="text-[10px] font-bold text-[#111111] uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders size={12} className="text-[#C9A227]" />
                    Image Focal Point Alignment
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="flex justify-between text-[9px] text-[#6B6B70] font-bold mb-1">
                        <span>FOCAL X (WIDTH)</span>
                        <span>{editFocalX}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={editFocalX}
                        onChange={(e) => setEditFocalX(parseInt(e.target.value, 10))}
                        className="w-full h-1 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-[#C9A227]"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-[9px] text-[#6B6B70] font-bold mb-1">
                        <span>FOCAL Y (HEIGHT)</span>
                        <span>{editFocalY}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={editFocalY}
                        onChange={(e) => setEditFocalY(parseInt(e.target.value, 10))}
                        className="w-full h-1 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-[#C9A227]"
                      />
                    </div>
                  </div>
                  <span className="block text-[8px] text-[#9B9BA4] leading-normal">
                    This keeps models or clothing details centered automatically when cropping down to mobile ratios.
                  </span>
                </div>

                {/* CTAs */}
                <div className="grid grid-cols-2 gap-3 border-t border-black/[0.04] pt-3">
                  <div>
                    <label className="block text-[10px] font-bold text-[#6B6B70] uppercase tracking-wider mb-1">
                      Button CTA Label *
                    </label>
                    <input
                      type="text"
                      value={editCta}
                      onChange={(e) => setEditCta(e.target.value)}
                      placeholder="Shop Collection"
                      className="admin-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#6B6B70] uppercase tracking-wider mb-1">
                      CTA Url Link *
                    </label>
                    <input
                      type="text"
                      value={editCtaLink}
                      onChange={(e) => setEditCtaLink(e.target.value)}
                      placeholder="/shop"
                      className="admin-input font-mono text-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#6B6B70] uppercase tracking-wider mb-1">
                    Secondary Button CTA Label
                  </label>
                  <input
                    type="text"
                    value={editSecondaryCta}
                    onChange={(e) => setEditSecondaryCta(e.target.value)}
                    placeholder="Explore (leave empty to hide)"
                    className="admin-input text-xs"
                  />
                </div>

                {/* Campaign Themes visual parameters */}
                <div className="bg-neutral-50 rounded-xl p-3 border border-black/[0.04] space-y-3">
                  <span className="text-[10px] font-bold text-[#111111] uppercase tracking-wider block">
                    Visual Identity Theme Overrides
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] text-[#6B6B70] font-bold uppercase mb-0.5">
                        Accent Color
                      </label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="color"
                          value={editAccent}
                          onChange={(e) => setEditAccent(e.target.value)}
                          className="w-6 h-6 border-none cursor-pointer rounded overflow-hidden"
                        />
                        <input
                          type="text"
                          value={editAccent}
                          onChange={(e) => setEditAccent(e.target.value)}
                          className="admin-input text-xs py-1 px-2 font-mono h-6 text-[10px]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] text-[#6B6B70] font-bold uppercase mb-0.5">
                        Overlay shading
                      </label>
                      <select
                        value={editOverlay}
                        onChange={(e) => setEditOverlay(e.target.value as any)}
                        className="admin-input text-xs py-1 h-7"
                      >
                        <option value="dark">Dark Vignette</option>
                        <option value="light">Light Shading</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] text-[#6B6B70] font-bold uppercase mb-0.5">
                        Text Contrast
                      </label>
                      <select
                        value={editTextTheme}
                        onChange={(e) => setEditTextTheme(e.target.value as any)}
                        className="admin-input text-xs py-1 h-7"
                      >
                        <option value="light">High Contrast Light</option>
                        <option value="dark">Dark Text</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[9px] text-[#6B6B70] font-bold uppercase mb-0.5">
                        Button style
                      </label>
                      <select
                        value={editButtonTheme}
                        onChange={(e) => setEditButtonTheme(e.target.value as any)}
                        className="admin-input text-xs py-1 h-7"
                      >
                        <option value="gold">Gold Solid</option>
                        <option value="white">White Minimal</option>
                        <option value="dark">Matte Black</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Scheduling controls */}
                <div className="bg-neutral-50 rounded-xl p-3 border border-black/[0.04] space-y-3">
                  <span className="text-[10px] font-bold text-[#111111] uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar size={12} className="text-[#C9A227]" />
                    Campaign Publication Window
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] text-[#6B6B70] font-bold uppercase mb-0.5">
                        Start Publish (local)
                      </label>
                      <input
                        type="datetime-local"
                        value={editPublishAt}
                        onChange={(e) => setEditPublishAt(e.target.value)}
                        className="admin-input text-[11px] py-1 h-7"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-[#6B6B70] font-bold uppercase mb-0.5">
                        Expire Publication
                      </label>
                      <input
                        type="datetime-local"
                        value={editExpiresAt}
                        onChange={(e) => setEditExpiresAt(e.target.value)}
                        className="admin-input text-[11px] py-1 h-7"
                      />
                    </div>
                  </div>
                  <span className="block text-[8px] text-[#9B9BA4] leading-normal flex items-start gap-1">
                    <AlertCircle size={10} className="flex-shrink-0 mt-0.5 text-blue-500" />
                    If status is Published, dates are optional. If status is Scheduled, you must set a Publish start time.
                  </span>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 pt-2 border-t border-black/[0.06]">
                  <button
                    type="button"
                    onClick={handleSaveCampaign}
                    disabled={isPending}
                    className="admin-btn-primary flex-1 py-2 text-xs"
                  >
                    {isPending ? (
                      <Loader2 className="animate-spin" size={12} />
                    ) : (
                      <Save size={12} />
                    )}
                    {selectedCampaign ? 'Update Campaign' : 'Add Campaign'}
                  </button>
                  {selectedCampaign && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCampaign(null);
                        clearForm();
                      }}
                      className="border border-black/[0.08] hover:bg-neutral-50 px-3.5 py-2 rounded-xl text-xs font-bold text-neutral-600 transition-all"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right Pane: Live Device Preview mockup! */}
            <div className="w-full lg:w-[25%] space-y-4">
              <div className="admin-card p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
                  <h3 className="text-[13px] font-bold uppercase tracking-wider text-[#111111] flex items-center gap-1.5">
                    <Eye size={14} className="text-[#C9A227]" />
                    Live Storefront Preview
                  </h3>
                </div>

                {/* Scheduled published status preview toggle filter */}
                <div className="flex items-center justify-between bg-neutral-50 rounded-xl px-3 py-2 border border-black/[0.04]">
                  <label className="text-[11px] font-semibold text-neutral-600 cursor-pointer select-none">
                    Preview as published only
                  </label>
                  <input
                    type="checkbox"
                    checked={previewAsPublished}
                    onChange={(e) => setPreviewAsPublished(e.target.checked)}
                    className="w-3.5 h-3.5 accent-[#C9A227] cursor-pointer"
                  />
                </div>

                {/* Simulated frame device container */}
                <div className="relative w-full aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl border-4 border-black/90 bg-[#050505] overflow-y-hidden max-w-[280px] mx-auto select-none">
                  {/* Status header overlay */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-2.5 py-0.5 text-[8px] font-bold text-white tracking-wider flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    MOCKUP PREVIEW
                  </div>

                  {previewCampaigns.length === 0 ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                      <p className="text-[10px] text-white/30 font-bold uppercase tracking-wider">
                        No Active Campaigns
                      </p>
                      <p className="text-[9px] text-white/20 mt-1 leading-normal">
                        Create a campaign or set status to Published to preview slides.
                      </p>
                    </div>
                  ) : (
                    <div className="absolute inset-0 w-full h-full scale-[1.0] origin-top-left pointer-events-none select-none">
                      {/* Mount our Hero slideshow component inline with the reactive local editing state values! */}
                      <Hero
                        initialCampaigns={previewCampaigns}
                        autoplayDuration={4000} // shorter timer for quick review
                      />
                    </div>
                  )}
                </div>
                <span className="block text-center text-[9px] text-[#9B9BA4] leading-normal max-w-[260px] mx-auto">
                  Pre-compiled local edits will sync with the mockup immediately.
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
