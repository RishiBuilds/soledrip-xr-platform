import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import type { Product } from "@/types/product";

// Generate a session ID for anonymous users
function getSessionId(): string {
  let sessionId = localStorage.getItem("session_id");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("session_id", sessionId);
  }
  return sessionId;
}

// Track a product view
export function useTrackProductView() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      const sessionId = getSessionId();
      
      const { error } = await supabase.from("product_views").insert({
        product_id: productId,
        user_id: user?.id || null,
        session_id: user ? null : sessionId,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recently-viewed"] });
      queryClient.invalidateQueries({ queryKey: ["trending-products"] });
    },
  });
}

// Get recently viewed products
export function useRecentlyViewed(limit = 8) {
  const { user } = useAuth();
  const [sessionId] = useState(getSessionId);

  return useQuery({
    queryKey: ["recently-viewed", user?.id || sessionId, limit],
    queryFn: async () => {
      // Get distinct product IDs from recent views
      let query = supabase
        .from("product_views")
        .select("product_id, viewed_at")
        .order("viewed_at", { ascending: false })
        .limit(limit * 2); // Get more to account for duplicates

      if (user) {
        query = query.eq("user_id", user.id);
      } else {
        query = query.eq("session_id", sessionId);
      }

      const { data: views, error: viewsError } = await query;
      if (viewsError) throw viewsError;
      if (!views?.length) return [];

      // Get unique product IDs preserving order
      const uniqueProductIds = [...new Set(views.map((v) => v.product_id))].slice(0, limit);

      // Fetch the products
      const { data: products, error: productsError } = await supabase
        .from("products")
        .select(`*, brand:brands(*), category:categories(*)`)
        .in("id", uniqueProductIds);

      if (productsError) throw productsError;

      // Sort products by the order they were viewed
      const productMap = new Map(products?.map((p) => [p.id, p]));
      return uniqueProductIds.map((id) => productMap.get(id)).filter(Boolean) as Product[];
    },
  });
}

// Get trending products (most viewed in last 7 days)
export function useTrendingProducts(limit = 8) {
  return useQuery({
    queryKey: ["trending-products", limit],
    queryFn: async () => {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      // Get view counts per product
      const { data: viewCounts, error: viewError } = await supabase
        .from("product_views")
        .select("product_id")
        .gte("viewed_at", sevenDaysAgo.toISOString());

      if (viewError) throw viewError;
      if (!viewCounts?.length) {
        // Fallback to featured products if no views
        const { data: featured, error: featuredError } = await supabase
          .from("products")
          .select(`*, brand:brands(*), category:categories(*)`)
          .eq("featured", true)
          .limit(limit);

        if (featuredError) throw featuredError;
        return featured as Product[];
      }

      // Count views per product
      const counts = viewCounts.reduce(
        (acc, { product_id }) => {
          acc[product_id] = (acc[product_id] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      // Sort by count and get top product IDs
      const topProductIds = Object.entries(counts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, limit)
        .map(([id]) => id);

      // Fetch the products
      const { data: products, error: productsError } = await supabase
        .from("products")
        .select(`*, brand:brands(*), category:categories(*)`)
        .in("id", topProductIds);

      if (productsError) throw productsError;

      // Sort by view count
      const productMap = new Map(products?.map((p) => [p.id, p]));
      return topProductIds.map((id) => productMap.get(id)).filter(Boolean) as Product[];
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}

// Get related products (same category or brand)
export function useRelatedProducts(productId: string, categoryId?: string, brandId?: string, limit = 4) {
  return useQuery({
    queryKey: ["related-products", productId, categoryId, brandId, limit],
    queryFn: async () => {
      if (!categoryId && !brandId) return [];

      let query = supabase
        .from("products")
        .select(`*, brand:brands(*), category:categories(*)`)
        .neq("id", productId)
        .limit(limit);

      // Prioritize same category
      if (categoryId) {
        query = query.eq("category_id", categoryId);
      } else if (brandId) {
        query = query.eq("brand_id", brandId);
      }

      const { data, error } = await query;
      if (error) throw error;

      // If not enough from same category, get from same brand
      if (data && data.length < limit && brandId && categoryId) {
        const { data: brandProducts, error: brandError } = await supabase
          .from("products")
          .select(`*, brand:brands(*), category:categories(*)`)
          .neq("id", productId)
          .eq("brand_id", brandId)
          .not("id", "in", `(${data.map((p) => p.id).join(",")})`)
          .limit(limit - data.length);

        if (!brandError && brandProducts) {
          return [...data, ...brandProducts] as Product[];
        }
      }

      return data as Product[];
    },
    enabled: !!(productId && (categoryId || brandId)),
  });
}

// Smart search suggestions
export function useSearchSuggestions(query: string) {
  return useQuery({
    queryKey: ["search-suggestions", query],
    queryFn: async () => {
      if (!query || query.length < 2) return { products: [], brands: [], categories: [] };

      // Search products
      const { data: products } = await supabase
        .from("products")
        .select("id, name, slug, images, price")
        .ilike("name", `%${query}%`)
        .limit(5);

      // Search brands
      const { data: brands } = await supabase
        .from("brands")
        .select("id, name, slug")
        .ilike("name", `%${query}%`)
        .limit(3);

      // Search categories
      const { data: categories } = await supabase
        .from("categories")
        .select("id, name, slug")
        .ilike("name", `%${query}%`)
        .limit(3);

      return {
        products: products || [],
        brands: brands || [],
        categories: categories || [],
      };
    },
    enabled: query.length >= 2,
    staleTime: 1000 * 60, // Cache for 1 minute
  });
}
