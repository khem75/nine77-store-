import type { Product } from '@/types/product';

export const products: Product[] = [
    {
        id: 'henley',
        name: 'Henley',
        slug: 'henley',
        price: 1350,
        description: 'Signature luxury Henley crafted for elevated streetwear. A sculpted silhouette with premium weight and refined minimal detail.',
        category: 'Tops',
        images: [],
        sizes: ['S', 'M', 'L', 'XL'],
        featured: true,
        newArrival: false
    },
    {
        id: 'vintage-t-shirt',
        name: 'Vintage T-Shirt',
        slug: 'vintage-t-shirt',
        price: 1350,
        description: 'Soft premium cotton with understated branding and vintage-inspired construction for refined layering and everyday luxury.',
        category: 'Tops',
        images: [],
        sizes: ['S', 'M', 'L', 'XL'],
        featured: true,
        newArrival: true
    },
    {
        id: 'old-money-tee',
        name: 'Old Money Tee',
        slug: 'old-money-tee',
        price: 1450,
        description: 'A luxury wardrobe essential with a clean editorial edge. Elevated tee styling designed for quiet statement dressing.',
        category: 'Tops',
        images: [],
        sizes: ['S', 'M', 'L', 'XL'],
        featured: false,
        newArrival: true
    },
    {
        id: 'barrel-pants',
        name: 'Barrel Pants',
        slug: 'barrel-pants',
        price: 1800,
        description: 'Modern barrel silhouette crafted from premium suiting fabric, offering a relaxed fit with structured luxury detail.',
        category: 'Pants',
        images: [],
        sizes: ['S', 'M', 'L', 'XL'],
        featured: true,
        newArrival: false
    },
    {
        id: 'amd-pants',
        name: 'AMD Pants',
        slug: 'amd-pants',
        price: 1800,
        description: 'Engineered streetwear pants with technical tailoring and premium texture, brought to life for refined urban dressing.',
        category: 'Pants',
        images: [],
        sizes: ['S', 'M', 'L', 'XL'],
        featured: false,
        newArrival: false
    },
    {
        id: 'linen-trousers',
        name: 'Linen Trousers',
        slug: 'linen-trousers',
        price: 1450,
        description: 'Lightweight luxury linen trousers with tailored ease. A refined silhouette for elevated warm-weather dressing.',
        category: 'Pants',
        images: [],
        sizes: ['S', 'M', 'L', 'XL'],
        featured: false,
        newArrival: true
    },
    {
        id: 'muscle-tee',
        name: 'Muscle Tee',
        slug: 'muscle-tee',
        price: 1350,
        description: 'Structured luxury muscle tee with premium finishes and a sculpted fit designed for modern layering.',
        category: 'Tops',
        images: [],
        sizes: ['S', 'M', 'L', 'XL'],
        featured: true,
        newArrival: false
    },
    {
        id: 'crop-tee',
        name: 'Crop Tee',
        slug: 'crop-tee',
        price: 1250,
        description: 'Cropped luxury tee with effortless styling and minimalist identity. A standout addition to elevated streetwear edits.',
        category: 'Tops',
        images: [],
        sizes: ['S', 'M', 'L', 'XL'],
        featured: false,
        newArrival: false
    },
    {
        id: 'windcheater',
        name: 'Windcheater',
        slug: 'windcheater',
        price: 2750,
        description: 'Bold luxury outerwear with premium windproof construction and an elevated street-ready silhouette.',
        category: 'Outerwear',
        images: [],
        sizes: ['S', 'M', 'L', 'XL'],
        featured: false,
        newArrival: true
    }
];