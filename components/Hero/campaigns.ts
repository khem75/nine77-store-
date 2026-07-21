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
      en: 'NEW\nSEASON',
      np: 'नयाँ\nसिजन'
    },
    subtitle: {
      en: 'Designed with precision and crafted for those who appreciate understated luxury. Every collection is built to outlast trends and elevate everyday wear.',
      np: 'शान्त विलासिताको कदर गर्नेहरूका लागि सटीकतापूर्वक डिजाइन।'
    },
    tagline: {
      en: 'DROP 01 · EDITORIAL COLLECTION',
      np: 'ड्रप ०१ · सम्पादकीय'
    },
    media: {
      desktop: {
        url: '/hero/hero-1-v4.jpg',
        alt: 'NINE77 New Season Campaign — Signature Jordan Tee',
        focalPoint: { x: 50, y: 22 }
      },
      mobile: {
        url: '/hero/hero-1-v4.jpg',
        alt: 'NINE77 New Season Portrait',
        focalPoint: { x: 50, y: 18 }
      }
    },
    type: 'image',
    cta: 'DISCOVER THE COLLECTION',
    secondaryCta: 'VIEW LOOKBOOK',
    ctaLink: '/shop',
    theme: {
      accent: '#C89B5A',
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
    title: 'EVERY\nDAY',
    subtitle: 'Premium weight fabrics tailored with absolute museum-grade precision. Wear it everywhere. Own every room.',
    tagline: 'CORE ESSENTIALS · SS26',
    media: {
      desktop: {
        url: '/hero/hero-2-v4.jpg',
        alt: 'NINE77 Everyday Uniform Henley',
        focalPoint: { x: 50, y: 22 }
      },
      mobile: {
        url: '/hero/hero-2-v4.jpg',
        alt: 'NINE77 Everyday Uniform Henley Mobile',
        focalPoint: { x: 50, y: 18 }
      }
    },
    type: 'image',
    cta: 'DISCOVER THE COLLECTION',
    secondaryCta: 'VIEW LOOKBOOK',
    ctaLink: '/shop',
    theme: {
      accent: '#4A7BB0',
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
    title: 'RULES THE\nWORLD',
    subtitle: 'Bold oversized graphic prints engineered for those who refuse to blend in. Limited numbers crafted.',
    tagline: 'GRAPHIC SERIES · RULES THE WORLD',
    media: {
      desktop: {
        url: '/hero/hero-3-v4.jpg',
        alt: 'NINE77 Rules The World Graphic Tee Editorial',
        focalPoint: { x: 50, y: 30 }
      },
      mobile: {
        url: '/hero/hero-3-v4.jpg',
        alt: 'NINE77 Rules The World Graphic Tee Mobile',
        focalPoint: { x: 50, y: 25 }
      }
    },
    type: 'image',
    cta: 'DISCOVER THE COLLECTION',
    secondaryCta: 'VIEW LOOKBOOK',
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
