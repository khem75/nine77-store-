-- ============================================================
-- NINE77 Admin Panel — Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Products Table ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.products (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category    TEXT NOT NULL DEFAULT 'Tops' CHECK (category IN ('Tops', 'Pants', 'Outerwear', 'Accessories')),
  price       NUMERIC(10,2) NOT NULL DEFAULT 0,
  sizes       TEXT[] NOT NULL DEFAULT '{}',
  colors      TEXT[] NOT NULL DEFAULT '{}',
  images      TEXT[] NOT NULL DEFAULT '{}',
  featured    BOOLEAN NOT NULL DEFAULT FALSE,
  status      TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('active', 'draft', 'hidden')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Homepage Settings Table ──────────────────────────────────
CREATE TABLE IF NOT EXISTS public.homepage (
  id                  INT PRIMARY KEY DEFAULT 1,
  hero_title          TEXT NOT NULL DEFAULT 'BUILD DIFFERENT.',
  hero_subtitle       TEXT NOT NULL DEFAULT 'Premium streetwear engineered for those who refuse to blend in.',
  hero_button         TEXT NOT NULL DEFAULT 'Shop Now',
  hero_button_link    TEXT NOT NULL DEFAULT '/shop',
  hero_image          TEXT,
  announcement        TEXT NOT NULL DEFAULT '🔥 New Drop — Limited Edition. WhatsApp to Order',
  featured_products   UUID[] NOT NULL DEFAULT '{}',
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert default homepage row
INSERT INTO public.homepage (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- ─── Store Settings Table ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.settings (
  id          INT PRIMARY KEY DEFAULT 1,
  store_name  TEXT NOT NULL DEFAULT 'NINE77',
  logo        TEXT,
  whatsapp    TEXT NOT NULL DEFAULT '',
  instagram   TEXT NOT NULL DEFAULT '',
  facebook    TEXT NOT NULL DEFAULT '',
  footer      TEXT NOT NULL DEFAULT '© 2025 NINE77. All rights reserved.',
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert default settings row
INSERT INTO public.settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- ─── Row Level Security (RLS) ─────────────────────────────────
-- Enable RLS on all tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Public read access for store frontend
CREATE POLICY "Public can read active products"
  ON public.products FOR SELECT
  USING (status = 'active');

CREATE POLICY "Public can read homepage"
  ON public.homepage FOR SELECT
  USING (true);

CREATE POLICY "Public can read settings"
  ON public.settings FOR SELECT
  USING (true);

-- Authenticated users (admin) get full access
CREATE POLICY "Authenticated users full access to products"
  ON public.products FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users full access to homepage"
  ON public.homepage FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users full access to settings"
  ON public.settings FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ─── Storage Buckets ──────────────────────────────────────────
-- Run these in Supabase Dashboard > Storage > Create Bucket
-- Or use the Supabase API:

-- INSERT INTO storage.buckets (id, name, public, allowed_mime_types, file_size_limit)
-- VALUES (
--   'nine77-assets',
--   'nine77-assets',
--   true,
--   ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
--   5242880  -- 5MB limit
-- );

-- Storage policies (public read, auth write)
-- CREATE POLICY "Public read nine77-assets"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'nine77-assets');
--
-- CREATE POLICY "Auth can upload to nine77-assets"
--   ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'nine77-assets' AND auth.role() = 'authenticated');
--
-- CREATE POLICY "Auth can update nine77-assets"
--   ON storage.objects FOR UPDATE
--   USING (bucket_id = 'nine77-assets' AND auth.role() = 'authenticated');
--
-- CREATE POLICY "Auth can delete nine77-assets"
--   ON storage.objects FOR DELETE
--   USING (bucket_id = 'nine77-assets' AND auth.role() = 'authenticated');

-- ─── Campaigns Table ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.campaigns (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title                   JSONB NOT NULL, -- {"en": "...", "np": "..."}
  subtitle                JSONB NOT NULL,
  tagline                 JSONB NOT NULL,
  media                   JSONB NOT NULL, -- {"desktop": {"url": "...", "alt": "..."}, "mobile": {...}}
  type                    TEXT NOT NULL DEFAULT 'image' CHECK (type IN ('image', 'video')),
  cta                     TEXT NOT NULL DEFAULT 'Shop Collection',
  secondary_cta           TEXT DEFAULT 'Explore',
  cta_link                TEXT NOT NULL DEFAULT '/shop',
  theme                   JSONB, -- {"accent": "#c8a84b", "overlay": "dark", "text": "light", "button": "gold"}
  status                  TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'archived')),
  "order"                 INT NOT NULL DEFAULT 0,
  featured_product_ids    TEXT[] DEFAULT '{}',
  featured_collection_id  TEXT,
  publish_at              TIMESTAMPTZ,
  expires_at              TIMESTAMPTZ,
  version                 INT NOT NULL DEFAULT 1,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger for campaigns auto-updating updated_at and incrementing version
CREATE OR REPLACE FUNCTION update_campaigns_metadata()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  NEW.version = OLD.version + 1;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER campaigns_metadata_trigger
  BEFORE UPDATE ON public.campaigns
  FOR EACH ROW EXECUTE FUNCTION update_campaigns_metadata();

-- Search and filter performance indexes
CREATE INDEX IF NOT EXISTS idx_campaigns_order ON public.campaigns("order");
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON public.campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_publish ON public.campaigns(publish_at);
CREATE INDEX IF NOT EXISTS idx_campaigns_expire ON public.campaigns(expires_at);

-- Row Level Security (RLS)
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

-- Public read policy for published, scheduled active campaigns
CREATE POLICY "Public can read active campaigns"
  ON public.campaigns FOR SELECT
  USING (
    status = 'published' AND
    (publish_at IS NULL OR publish_at <= NOW()) AND
    (expires_at IS NULL OR expires_at >= NOW())
  );

-- Admin authorization full access
CREATE POLICY "Authenticated users full access to campaigns"
  ON public.campaigns FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

