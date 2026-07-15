// ============================================================
// NINE77 Admin Panel — TypeScript Types
// ============================================================

export type ProductStatus = 'active' | 'draft' | 'hidden';

export type ProductCategory = 'Tops' | 'Pants' | 'Outerwear' | 'Accessories';

export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface AdminProduct {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  sizes: ProductSize[];
  colors: string[];
  images: string[];
  featured: boolean;
  status: ProductStatus;
  created_at: string;
  updated_at: string;
}

export interface HomepageSettings {
  id: number;
  hero_title: string;
  hero_subtitle: string;
  hero_button: string;
  hero_button_link: string;
  hero_image: string | null;
  announcement: string;
  featured_products: string[];
  updated_at: string;
}

export interface StoreSettings {
  id: number;
  store_name: string;
  logo: string | null;
  whatsapp: string;
  instagram: string;
  facebook: string;
  footer: string;
  updated_at: string;
}

export interface DashboardStats {
  total: number;
  active: number;
  featured: number;
  draft: number;
}

export interface ProductFormValues {
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  sizes: ProductSize[];
  colors: string[];
  images: string[];
  featured: boolean;
  status: ProductStatus;
}

export interface AdminUser {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

export type SortField = 'name' | 'price' | 'category' | 'status' | 'updated_at';
export type SortDirection = 'asc' | 'desc';

export interface ProductFilters {
  search: string;
  category: string;
  status: string;
  sortField: SortField;
  sortDirection: SortDirection;
}
