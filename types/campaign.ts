// ============================================================
// NINE77 — Campaign TypeScript Definitions
// ============================================================

export type CampaignStatus = 'draft' | 'scheduled' | 'published' | 'archived';
export type CampaignMediaType = 'image' | 'video';

export interface LocalizedString {
  [locale: string]: string;
}

export interface CampaignTheme {
  accent?: string;       // e.g. "#C8A84B"
  overlay?: 'dark' | 'light';
  text?: 'light' | 'dark';
  button?: 'gold' | 'white' | 'dark';
}

export interface CampaignMediaDetail {
  url: string;
  alt: string;
  focalPoint?: { x: number; y: number }; // Focal point percentages: e.g. { x: 50, y: 50 }
  credit?: string;
}

export interface CampaignMedia {
  desktop: CampaignMediaDetail;
  mobile?: CampaignMediaDetail;
}

export interface Campaign {
  id: string;
  title: string | LocalizedString;
  subtitle: string | LocalizedString;
  tagline: string | LocalizedString;
  media: CampaignMedia;
  type: CampaignMediaType; // 'image' | 'video'
  cta: string;
  secondaryCta?: string;
  ctaLink: string;
  theme?: CampaignTheme;
  status: CampaignStatus;
  order: number;
  featuredProductIds?: string[];
  featuredCollectionId?: string;
  publish_at?: string;
  expires_at?: string;
  version: number;
  created_at: string;
  updated_at: string;
}

// Resolved version for client rendering
export interface ResolvedCampaign {
  id: string;
  title: string;
  subtitle: string;
  tagline: string;
  media: {
    desktop: CampaignMediaDetail;
    mobile?: CampaignMediaDetail;
  };
  type: CampaignMediaType;
  cta: string;
  secondaryCta?: string;
  ctaLink: string;
  theme: {
    accent: string;
    overlay: 'dark' | 'light';
    text: 'light' | 'dark';
    button: 'gold' | 'white' | 'dark';
  };
  status: CampaignStatus;
  order: number;
  featuredProductIds?: string[];
  featuredCollectionId?: string;
  publish_at?: string;
  expires_at?: string;
  version: number;
}
