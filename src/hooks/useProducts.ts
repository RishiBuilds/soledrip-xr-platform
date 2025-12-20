import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Product, Brand, Category, Size, Color, ProductFilters, ProductWithDetails } from "@/types/product";

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select(`
          *,
          brand:brands(*),
          category:categories(*)
        `);

      if (filters?.category) {
        query = query.eq("category.slug", filters.category);
      }

      if (filters?.brand) {
        query = query.eq("brand.slug", filters.brand);
      }

      if (filters?.minPrice) {
        query = query.gte("price", filters.minPrice);
      }

      if (filters?.maxPrice) {
        query = query.lte("price", filters.maxPrice);
      }

      if (filters?.isNew) {
        query = query.eq("is_new", true);
      }

      if (filters?.search) {
        query = query.ilike("name", `%${filters.search}%`);
      }

      // Sorting
      switch (filters?.sortBy) {
        case "price-asc":
          query = query.order("price", { ascending: true });
          break;
        case "price-desc":
          query = query.order("price", { ascending: false });
          break;
        case "newest":
          query = query.order("created_at", { ascending: false });
          break;
        case "name":
          query = query.order("name", { ascending: true });
          break;
        default:
          query = query.order("featured", { ascending: false }).order("created_at", { ascending: false });
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Product[];
    },
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const { data: product, error: productError } = await supabase
        .from("products")
        .select(`
          *,
          brand:brands(*),
          category:categories(*)
        `)
        .eq("slug", slug)
        .maybeSingle();

      if (productError) throw productError;
      if (!product) return null;

      // Get variants with sizes and colors
      const { data: variants, error: variantsError } = await supabase
        .from("product_variants")
        .select(`
          *,
          size:sizes(*),
          color:colors(*)
        `)
        .eq("product_id", product.id);

      if (variantsError) throw variantsError;

      return {
        ...product,
        variants: variants || [],
      } as ProductWithDetails;
    },
    enabled: !!slug,
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ["products", "featured"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          brand:brands(*),
          category:categories(*)
        `)
        .eq("featured", true)
        .limit(8);

      if (error) throw error;
      return data as Product[];
    },
  });
}

export function useBrands() {
  return useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("brands")
        .select("*")
        .order("name");

      if (error) throw error;
      return data as Brand[];
    },
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) throw error;
      return data as Category[];
    },
  });
}

export function useSizes() {
  return useQuery({
    queryKey: ["sizes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sizes")
        .select("*")
        .order("sort_order");

      if (error) throw error;
      return data as Size[];
    },
  });
}

export function useColors() {
  return useQuery({
    queryKey: ["colors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("colors")
        .select("*")
        .order("name");

      if (error) throw error;
      return data as Color[];
    },
  });
}
