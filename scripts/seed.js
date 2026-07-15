// Load env vars from .env.local
const fs = require('fs');
const path = require('path');
try {
  const envPath = path.join(__dirname, '../.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split(/\r?\n/).forEach((line) => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || '';
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.substring(1, value.length - 1);
        }
        process.env[key] = value.trim();
      }
    });
  }
} catch (e) {
  console.warn('⚠️ Could not load .env.local', e);
}

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  console.error('   Create a .env.local file from .env.example and fill in your keys');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const products = [
  {
    name: 'Henley',
    description: 'Signature luxury Henley crafted for elevated streetwear. A sculpted silhouette with premium weight and refined minimal detail.',
    category: 'Tops',
    price: 1350,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#F4F0E8', '#1B1B1B', '#D4AF37'],
    images: ['/products/henley-1.jpg', '/products/henley-2.jpg'],
    featured: true,
    status: 'active',
  },
  {
    name: 'Vintage T-Shirt',
    description: 'Soft premium cotton with understated branding and vintage-inspired construction for refined layering.',
    category: 'Tops',
    price: 1350,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#F4F0E8', '#1A1A1A'],
    images: ['/products/vintage-t-shirt-1.jpg', '/products/vintage-t-shirt-2.jpg'],
    featured: true,
    status: 'active',
  },
  {
    name: 'Old Money Tee',
    description: 'A luxury wardrobe essential with a clean editorial edge. Elevated tee styling for quiet statement dressing.',
    category: 'Tops',
    price: 1450,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#F7F1E3', '#1B1B1B'],
    images: ['/products/old-money-tee-1.jpg', '/products/old-money-tee-2.jpg'],
    featured: false,
    status: 'active',
  },
  {
    name: 'Barrel Pants',
    description: 'Modern barrel silhouette crafted from premium suiting fabric, offering a relaxed fit with structured luxury detail.',
    category: 'Pants',
    price: 1800,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#1A1A1A', '#3A2F2A'],
    images: ['/products/barrel-pants-1.jpg', '/products/barrel-pants-2.jpg'],
    featured: true,
    status: 'active',
  },
  {
    name: 'AMD Pants',
    description: 'Engineered streetwear pants with technical tailoring and premium texture for refined urban dressing.',
    category: 'Pants',
    price: 1800,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#111111', '#474747'],
    images: ['/products/amd-pants-1.jpg', '/products/amd-pants-2.jpg'],
    featured: false,
    status: 'active',
  },
  {
    name: 'Linen Trousers',
    description: 'Lightweight luxury linen trousers with tailored ease for elevated warm-weather dressing.',
    category: 'Pants',
    price: 1450,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#F4E8D2', '#222222'],
    images: ['/products/linen-trousers-1.jpg', '/products/linen-trousers-2.jpg'],
    featured: false,
    status: 'active',
  },
  {
    name: 'Muscle Tee',
    description: 'Structured luxury muscle tee with premium finishes and a sculpted fit designed for modern layering.',
    category: 'Tops',
    price: 1350,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#F4F0E8', '#1B1B1B'],
    images: ['/products/muscle-tee-1.jpg', '/products/muscle-tee-2.jpg'],
    featured: true,
    status: 'active',
  },
  {
    name: 'Windcheater',
    description: 'Bold luxury outerwear with premium windproof construction and an elevated street-ready silhouette.',
    category: 'Outerwear',
    price: 2750,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#1A1A1A', '#5A554E'],
    images: ['/products/windcheater-1.jpg', '/products/windcheater-2.jpg'],
    featured: false,
    status: 'active',
  },
  {
    name: 'Linen Shirt',
    description: 'Premium linen shirt crafted for effortless luxury. Lightweight, breathable, with a relaxed silhouette.',
    category: 'Tops',
    price: 1650,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#F3E8D8', '#1C1C1C'],
    images: ['/products/linen-shirt-1.jpg', '/products/linen-shirt-2.jpg'],
    featured: true,
    status: 'active',
  },
];

async function seed() {
  console.log('🌱 Starting seed...\n');

  // Check existing count
  const { count, error: countError } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    console.error('❌ Failed to check existing products:', countError.message);
    console.error('   Make sure you ran supabase_schema.sql first in the Supabase SQL Editor');
    process.exit(1);
  }

  if (count && count > 0) {
    console.log(`⚠️  Found ${count} existing products. Skipping seed to avoid duplicates.`);
    console.log('   To reseed, clear the products table first.');
    process.exit(0);
  }

  const { data, error } = await supabase
    .from('products')
    .insert(products)
    .select('id, name');

  if (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }

  console.log(`✅ Successfully seeded ${data.length} products:\n`);
  data.forEach((p) => console.log(`   → ${p.name} (${p.id})`));
  console.log('\n🎉 Seed complete!');
}

seed();
