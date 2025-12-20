export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
}

export interface Size {
  id: string;
  value: string;
  sort_order: number;
}

export interface Color {
  id: string;
  name: string;
  hex_code: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  original_price: number | null;
  brand_id: string | null;
  category_id: string | null;
  images: string[];
  featured: boolean;
  is_new: boolean;
  model_3d: string | null;
  created_at: string;
  updated_at: string;
  brand: Brand | null;
  category: Category | null;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  size_id: string | null;
  color_id: string | null;
  stock: number;
  sku: string | null;
  size?: Size;
  color?: Color;
}

export interface ProductWithDetails extends Product {
  brand: Brand | null;
  category: Category | null;
  variants: ProductVariant[];
}

export interface ProductFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  color?: string;
  isNew?: boolean;
  search?: string;
  sortBy?: 'price-asc' | 'price-desc' | 'newest' | 'name';
}
