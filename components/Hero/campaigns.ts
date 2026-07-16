import type { Campaign, ResolvedCampaign, CampaignTheme } from '@/types/campaign';

export const DEFAULT_THEME = {
  accent: '#c8a84b',
  overlay: 'dark' as const,
  text: 'light' as const,
  button: 'gold' as const,
};

// Branded NINE77 campaign presets used as fallbacks
export const DEFAULT_CAMPAIGNS: Campaign[] = [
  {
    id: 'fallback-new-season',
    title: {
      en: 'NEW SEASON',
      np: 'नयाँ सिजन'
    },
    subtitle: {
      en: 'Elevated streetwear drops shaped for modern quiet luxury.',
      np: 'आधुनिक मन्द विलासिताको लागि आकार दिइएको उन्नत स्ट्रीटवियर।'
    },
    tagline: {
      en: 'DROP 01 / EDITORIAL',
      np: 'ड्रप ०१ / सम्पादकीय'
    },
    media: {
      desktop: {
        url: '/products/campaign-new-season.png',
        alt: 'NINE77 New Season Autumn Campaign Model',
        focalPoint: { x: 50, y: 45 }
      },
      mobile: {
        url: '/products/campaign-new-season.png',
        alt: 'NINE77 New Season Portrait Crop',
        focalPoint: { x: 50, y: 40 }
      }
    },
    type: 'image',
    cta: 'Shop Collection',
    secondaryCta: 'Explore',
    ctaLink: '/shop',
    theme: {
      accent: '#c8a84b',
      overlay: 'dark',
      text: 'light',
      button: 'gold'
    },
    status: 'published',
    order: 0,
    version: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'fallback-everyday-uniform',
    title: 'EVERYDAY UNIFORM',
    subtitle: 'Premium weight fabrics tailored with absolute museum-grade precision.',
    tagline: 'CORE ESSENTIALS',
    media: {
      desktop: {
        url: '/products/campaign-everyday-uniform.png',
        alt: 'NINE77 Everyday Uniform Core Styling',
        focalPoint: { x: 50, y: 50 }
      },
      mobile: {
        url: '/products/campaign-everyday-uniform.png',
        alt: 'NINE77 Everyday Uniform Portrait Crop',
        focalPoint: { x: 50, y: 50 }
      }
    },
    type: 'image',
    cta: 'Discover Fits',
    ctaLink: '/shop',
    theme: {
      accent: '#bcc8e0',
      overlay: 'dark',
      text: 'light',
      button: 'white'
    },
    status: 'published',
    order: 1,
    version: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'fallback-limited-drop',
    title: 'LIMITED DROP',
    subtitle: 'High-demand outerwear and pants engineered for those who refuse to blend in.',
    tagline: 'TECHNICAL GARMENTS',
    media: {
      desktop: {
        url: '/products/campaign-limited-drop.png',
        alt: 'NINE77 Limited Drop Technical Outerwear',
        focalPoint: { x: 50, y: 50 }
      },
      mobile: {
        url: '/products/campaign-limited-drop.png',
        alt: 'NINE77 Limited Drop Portrait Crop',
        focalPoint: { x: 50, y: 50 }
      }
    },
    type: 'image',
    cta: 'Pre-Order Now',
    ctaLink: '/shop',
    theme: {
      accent: '#e8dcc8',
      overlay: 'dark',
      text: 'light',
      button: 'gold'
    },
    status: 'published',
    order: 2,
    version: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

/**
 * Expose helper to resolve translation strings
 */
export function translate(text: string | Record<string, string> | undefined, locale = 'en'): string {
  if (!text) return '';
  if (typeof text === 'string') return text;
  return text[locale] || text['en'] || Object.values(text)[0] || '';
}

/**
 * Computes resolved properties of a campaign including theme fallback
 */
export function resolveCampaign(campaign: Campaign, locale = 'en'): ResolvedCampaign {
  const mergedTheme = {
    accent: campaign.theme?.accent || DEFAULT_THEME.accent,
    overlay: campaign.theme?.overlay || DEFAULT_THEME.overlay,
    text: campaign.theme?.text || DEFAULT_THEME.text,
    button: campaign.theme?.button || DEFAULT_THEME.button,
  };

  return {
    id: campaign.id,
    title: translate(campaign.title, locale),
    subtitle: translate(campaign.subtitle, locale),
    tagline: translate(campaign.tagline, locale),
    media: campaign.media,
    type: campaign.type,
    cta: campaign.cta,
    secondaryCta: campaign.secondaryCta,
    ctaLink: campaign.ctaLink,
    theme: mergedTheme,
    status: campaign.status,
    order: campaign.order,
    featuredProductIds: campaign.featuredProductIds,
    featuredCollectionId: campaign.featuredCollectionId,
    publish_at: campaign.publish_at,
    expires_at: campaign.expires_at,
    version: campaign.version,
  };
}
