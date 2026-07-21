// ============================================================
// NINE77 Admin — Mock Data Layer (for UI testing without Supabase)
// ============================================================

import type { AdminProduct, HomepageSettings, StoreSettings } from '@/types/admin';
import type { Campaign } from '@/types/campaign';

// In-memory store (resets on server restart — that's fine for mock mode)
let mockProducts: AdminProduct[] = [
  {
    id: 'prod-001',
    name: 'Henley',
    description: 'Signature luxury Henley crafted for elevated streetwear. A sculpted silhouette with premium weight and refined minimal detail.',
    category: 'Tops',
    price: 1350,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#F4F0E8', '#1B1B1B', '#D4AF37'],
    images: ['/products/vintage-t-shirt-1.jpg', '/products/vintage-t-shirt-2.jpg'],
    featured: true,
    status: 'active',
    created_at: '2025-01-10T10:00:00Z',
    updated_at: '2025-07-10T14:23:00Z',
  },
  {
    id: 'prod-002',
    name: 'Vintage T-Shirt',
    description: 'Soft premium cotton with understated branding and vintage-inspired construction for refined layering and everyday luxury.',
    category: 'Tops',
    price: 1350,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#F4F0E8', '#1A1A1A', '#8A6A4D'],
    images: ['/products/vintage-t-shirt-1.jpg', '/products/vintage-t-shirt-2.jpg'],
    featured: true,
    status: 'active',
    created_at: '2025-01-12T10:00:00Z',
    updated_at: '2025-07-11T09:15:00Z',
  },
  {
    id: 'prod-003',
    name: 'Old Money Tee',
    description: 'A luxury wardrobe essential with a clean editorial edge. Elevated tee styling designed for quiet statement dressing.',
    category: 'Tops',
    price: 1450,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#F7F1E3', '#1B1B1B', '#D4AF37'],
    images: ['/products/vintage-t-shirt-3.jpg', '/products/vintage-t-shirt-2.jpg'],
    featured: false,
    status: 'active',
    created_at: '2025-02-01T10:00:00Z',
    updated_at: '2025-07-09T16:45:00Z',
  },
  {
    id: 'prod-004',
    name: 'Barrel Pants',
    description: 'Modern barrel silhouette crafted from premium suiting fabric, offering a relaxed fit with structured luxury detail.',
    category: 'Pants',
    price: 1800,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#1A1A1A', '#3A2F2A', '#D4AF37'],
    images: ['/products/barrel-pants-1.jpg', '/products/barrel-pants-2.jpg'],
    featured: true,
    status: 'active',
    created_at: '2025-02-15T10:00:00Z',
    updated_at: '2025-07-08T11:30:00Z',
  },
  {
    id: 'prod-005',
    name: 'AMD Pants',
    description: 'Engineered streetwear pants with technical tailoring and premium texture for refined urban dressing.',
    category: 'Pants',
    price: 1800,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#111111', '#474747', '#D4AF37'],
    images: ['/products/barrel-pants-3.jpg', '/products/barrel-pants-4.jpg'],
    featured: false,
    status: 'draft',
    created_at: '2025-03-01T10:00:00Z',
    updated_at: '2025-07-07T08:20:00Z',
  },
  {
    id: 'prod-006',
    name: 'Linen Trousers',
    description: 'Lightweight luxury linen trousers with tailored ease. A refined silhouette for elevated warm-weather dressing.',
    category: 'Pants',
    price: 1450,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#F4E8D2', '#222222', '#D4AF37'],
    images: ['/products/linen-trousers-1.jpg', '/products/linen-trousers-2.jpg'],
    featured: false,
    status: 'active',
    created_at: '2025-03-10T10:00:00Z',
    updated_at: '2025-07-06T13:10:00Z',
  },
  {
    id: 'prod-007',
    name: 'Muscle Tee',
    description: 'Structured luxury muscle tee with premium finishes and a sculpted fit designed for modern layering.',
    category: 'Tops',
    price: 1350,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#F4F0E8', '#1B1B1B', '#B8860B'],
    images: ['/products/vintage-t-shirt-1.jpg', '/products/vintage-t-shirt-2.jpg'],
    featured: true,
    status: 'active',
    created_at: '2025-04-01T10:00:00Z',
    updated_at: '2025-07-05T15:55:00Z',
  },
  {
    id: 'prod-008',
    name: 'Linen Shirt',
    description: 'Premium linen shirt crafted for effortless luxury. Lightweight, breathable, with a relaxed silhouette for elevated everyday wear.',
    category: 'Tops',
    price: 1650,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#F3E8D8', '#1C1C1C', '#D4AF37'],
    images: ['/products/linen-shirt-1.jpg', '/products/linen-shirt-2.jpg'],
    featured: true,
    status: 'active',
    created_at: '2025-04-15T10:00:00Z',
    updated_at: '2025-07-04T10:00:00Z',
  },
  {
    id: 'prod-009',
    name: 'Windcheater',
    description: 'Bold luxury outerwear with premium windproof construction and an elevated street-ready silhouette.',
    category: 'Outerwear',
    price: 2750,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#1A1A1A', '#5A554E', '#D4AF37'],
    images: ['/products/windcheater-1.jpg', '/products/windcheater-2.jpg'],
    featured: false,
    status: 'hidden',
    created_at: '2025-05-01T10:00:00Z',
    updated_at: '2025-07-03T09:00:00Z',
  },
  {
    id: 'prod-011',
    name: 'Original Vintage Distressed Cap',
    description: 'Signature vintage distressed dad cap featuring 3D "ORIGINAL THE BLACK" embroidery, custom distressing, and an adjustable strap.',
    category: 'Accessories',
    price: 1250,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#7A2938', '#CBB28A', '#5C5449'],
    images: [
      '/products/distressed-cap-1.jpg',
      '/products/distressed-cap-2.jpg',
      '/products/distressed-cap-3.jpg',
      '/products/distressed-cap-4.jpg',
      '/products/distressed-cap-5.jpg',
    ],
    featured: true,
    status: 'active',
    created_at: '2025-06-15T10:00:00Z',
    updated_at: '2025-07-21T12:00:00Z',
  },
];

let mockHomepage: HomepageSettings = {
  id: 1,
  hero_title: 'BUILD DIFFERENT.',
  hero_subtitle: 'Premium streetwear engineered for those who refuse to blend in. Fusing architectural geometry with museum-grade craftsmanship.',
  hero_button: 'Shop Now',
  hero_button_link: '/shop',
  hero_image: null,
  announcement: '🔥 New Drop: Limited Edition Collection — WhatsApp to Order',
  featured_products: ['prod-001', 'prod-002', 'prod-004', 'prod-007', 'prod-008'],
  updated_at: new Date().toISOString(),
};

let mockSettings: StoreSettings = {
  id: 1,
  store_name: 'NINE77',
  logo: null,
  whatsapp: '9779810605409',
  instagram: 'https://www.instagram.com/nine.77___/',
  facebook: 'https://www.facebook.com/profile.php?id=61590493074666',
  footer: '© 2026 NINE77. All rights reserved.',
  updated_at: new Date().toISOString(),
};

// ── Helper ─────────────────────────────────────────────────────
function generateId() {
  return 'prod-' + Math.random().toString(36).slice(2, 9);
}

// ── Products ───────────────────────────────────────────────────
export function mockGetProducts(): AdminProduct[] {
  return [...mockProducts].sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );
}

export function mockGetProductById(id: string): AdminProduct | null {
  return mockProducts.find((p) => p.id === id) ?? null;
}

export function mockCreateProduct(values: Omit<AdminProduct, 'id' | 'created_at' | 'updated_at'>): AdminProduct {
  const now = new Date().toISOString();
  const product: AdminProduct = { ...values, id: generateId(), created_at: now, updated_at: now };
  mockProducts.unshift(product);
  return product;
}

export function mockUpdateProduct(id: string, values: Partial<AdminProduct>): boolean {
  const idx = mockProducts.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  mockProducts[idx] = { ...mockProducts[idx], ...values, updated_at: new Date().toISOString() };
  return true;
}

export function mockDeleteProduct(id: string): boolean {
  const before = mockProducts.length;
  mockProducts = mockProducts.filter((p) => p.id !== id);
  return mockProducts.length < before;
}

// ── Homepage ───────────────────────────────────────────────────
export function mockGetHomepage(): HomepageSettings {
  return { ...mockHomepage };
}

export function mockUpdateHomepage(values: Partial<HomepageSettings>): void {
  mockHomepage = { ...mockHomepage, ...values, updated_at: new Date().toISOString() };
}

// ── Settings ───────────────────────────────────────────────────
export function mockGetSettings(): StoreSettings {
  return { ...mockSettings };
}

export function mockUpdateSettings(values: Partial<StoreSettings>): void {
  mockSettings = { ...mockSettings, ...values, updated_at: new Date().toISOString() };
}

// ── Dashboard Stats ────────────────────────────────────────────
export function mockGetStats() {
  const products = mockGetProducts();
  return {
    total: products.length,
    active: products.filter((p) => p.status === 'active').length,
    featured: products.filter((p) => p.featured).length,
    draft: products.filter((p) => p.status === 'draft').length,
  };
}

// ── Campaigns Mock Store ───────────────────────────────────────
let mockCampaigns: Campaign[] = [
  {
    id: 'campaign-001',
    title: { en: 'NEW SEASON', np: 'नयाँ सिजन' },
    subtitle: { en: 'Elevated streetwear drops shaped for modern quiet luxury.', np: 'आधुनिक मन्द विलासिताको लागि आकार दिइएको उन्नत स्ट्रीटवियर।' },
    tagline: { en: 'DROP 01 / EDITORIAL', np: 'ड्रप ०१ / सम्पादकीय' },
    media: {
      desktop: {
        url: '/hero/hero-1-v4.jpg',
        alt: 'NINE77 New Season Autumn Campaign Model',
        focalPoint: { x: 50, y: 22 }
      },
      mobile: {
        url: '/hero/hero-1-v4.jpg',
        alt: 'NINE77 New Season Portrait Crop',
        focalPoint: { x: 50, y: 18 }
      }
    },
    type: 'image',
    cta: 'Shop Collection',
    secondaryCta: 'Explore',
    ctaLink: '/shop',
    theme: { accent: '#c8a84b', overlay: 'dark', text: 'light', button: 'gold' },
    status: 'published',
    order: 0,
    version: 1,
    created_at: '2026-07-01T10:00:00Z',
    updated_at: '2026-07-01T10:00:00Z'
  },
  {
    id: 'campaign-002',
    title: 'EVERYDAY UNIFORM',
    subtitle: 'Premium weight fabrics tailored with absolute museum-grade precision.',
    tagline: 'CORE ESSENTIALS',
    media: {
      desktop: {
        url: '/hero/hero-2-v4.jpg',
        alt: 'NINE77 Everyday Uniform Core Styling',
        focalPoint: { x: 50, y: 22 }
      },
      mobile: {
        url: '/hero/hero-2-v4.jpg',
        alt: 'NINE77 Everyday Uniform Portrait Crop',
        focalPoint: { x: 50, y: 18 }
      }
    },
    type: 'image',
    cta: 'Discover Fits',
    ctaLink: '/shop',
    theme: { accent: '#4A7BB0', overlay: 'dark', text: 'light', button: 'white' },
    status: 'published',
    order: 1,
    version: 1,
    created_at: '2026-07-02T10:00:00Z',
    updated_at: '2026-07-02T10:00:00Z'
  },
  {
    id: 'campaign-003',
    title: 'RULES THE WORLD',
    subtitle: 'Bold oversized back graphic prints engineered for those who refuse to blend in.',
    tagline: 'GRAPHIC SERIES',
    media: {
      desktop: {
        url: '/hero/hero-3-v4.jpg',
        alt: 'NINE77 Rules The World Graphic Tee Editorial',
        focalPoint: { x: 50, y: 30 }
      },
      mobile: {
        url: '/hero/hero-3-v4.jpg',
        alt: 'NINE77 Rules The World Graphic Tee Portrait',
        focalPoint: { x: 50, y: 25 }
      }
    },
    type: 'image',
    cta: 'Pre-Order Now',
    ctaLink: '/shop',
    theme: { accent: '#e8dcc8', overlay: 'dark', text: 'light', button: 'gold' },
    status: 'published',
    order: 2,
    version: 1,
    created_at: '2026-07-03T10:00:00Z',
    updated_at: '2026-07-03T10:00:00Z'
  }
];

// ── Campaigns ──────────────────────────────────────────────────
export function mockGetCampaigns(adminMode = false, previewTimeStr?: string): Campaign[] {
  let campaigns = [...mockCampaigns].sort((a, b) => a.order - b.order);

  if (!adminMode) {
    const previewTime = previewTimeStr ? new Date(previewTimeStr) : new Date();
    campaigns = campaigns.filter((c) => {
      if (c.status !== 'published') return false;
      const pub = c.publish_at ? new Date(c.publish_at) : null;
      const exp = c.expires_at ? new Date(c.expires_at) : null;
      if (pub && pub > previewTime) return false;
      if (exp && exp < previewTime) return false;
      return true;
    });
  }

  return campaigns;
}

export function mockCreateCampaign(
  values: Omit<Campaign, 'id' | 'created_at' | 'updated_at' | 'version'>
): Campaign {
  const now = new Date().toISOString();
  const newCampaign: Campaign = {
    ...values,
    id: 'campaign-' + Math.random().toString(36).slice(2, 9),
    version: 1,
    created_at: now,
    updated_at: now
  };
  mockCampaigns.push(newCampaign);
  return newCampaign;
}

export function mockUpdateCampaign(
  id: string,
  values: Partial<Omit<Campaign, 'id' | 'created_at' | 'updated_at' | 'version'>>
): boolean {
  const idx = mockCampaigns.findIndex((c) => c.id === id);
  if (idx === -1) return false;
  
  mockCampaigns[idx] = {
    ...mockCampaigns[idx],
    ...values,
    version: mockCampaigns[idx].version + 1,
    updated_at: new Date().toISOString()
  };
  return true;
}

export function mockDeleteCampaign(id: string): boolean {
  const before = mockCampaigns.length;
  mockCampaigns = mockCampaigns.filter((c) => c.id !== id);
  return mockCampaigns.length < before;
}

export function mockReorderCampaigns(orderedIds: string[]): void {
  orderedIds.forEach((id, index) => {
    const idx = mockCampaigns.findIndex((c) => c.id === id);
    if (idx !== -1) {
      mockCampaigns[idx].order = index;
    }
  });
}
