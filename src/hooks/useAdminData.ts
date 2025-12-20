import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

// Orders
export function useAdminOrders() {
  return useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (*)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const { error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", orderId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    },
  });
}

// Products
export function useAdminProducts() {
  return useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          brand:brands(*),
          category:categories(*),
          variants:product_variants(
            *,
            size:sizes(*),
            color:colors(*)
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: TablesInsert<"products">) => {
      const { data, error } = await supabase
        .from("products")
        .insert(product)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...product }: TablesUpdate<"products"> & { id: string }) => {
      const { data, error } = await supabase
        .from("products")
        .update(product)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
  });
}

// Analytics
export function useAdminAnalytics() {
  return useQuery({
    queryKey: ["admin-analytics"],
    queryFn: async () => {
      // Get total orders and revenue
      const { data: orders, error: ordersError } = await supabase
        .from("orders")
        .select("total, status, created_at");

      if (ordersError) throw ordersError;

      // Get products count
      const { count: productsCount, error: productsError } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true });

      if (productsError) throw productsError;

      // Get top selling products from order_items
      const { data: topProducts, error: topProductsError } = await supabase
        .from("order_items")
        .select("product_name, quantity, price, product_image")
        .order("quantity", { ascending: false })
        .limit(5);

      if (topProductsError) throw topProductsError;

      // Calculate metrics
      const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.total), 0) || 0;
      const totalOrders = orders?.length || 0;
      const paidOrders = orders?.filter(o => o.status === "paid" || o.status === "shipped" || o.status === "delivered").length || 0;

      // Group orders by date for chart
      const ordersByDate = orders?.reduce((acc, order) => {
        const date = new Date(order.created_at).toLocaleDateString();
        if (!acc[date]) {
          acc[date] = { date, revenue: 0, orders: 0 };
        }
        acc[date].revenue += Number(order.total);
        acc[date].orders += 1;
        return acc;
      }, {} as Record<string, { date: string; revenue: number; orders: number }>);

      const revenueData = Object.values(ordersByDate || {}).slice(-7);

      return {
        totalRevenue,
        totalOrders,
        paidOrders,
        productsCount: productsCount || 0,
        topProducts: topProducts || [],
        revenueData,
      };
    },
  });
}

// Product variants
export function useCreateProductVariant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variant: TablesInsert<"product_variants">) => {
      const { data, error } = await supabase
        .from("product_variants")
        .insert(variant)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
  });
}

export function useDeleteProductVariant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("product_variants")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
  });
}
