import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface CartItem {
  id: string;
  productId: string;
  variantId: string | null;
  name: string;
  image: string;
  price: number;
  size: string | null;
  color: string | null;
  quantity: number;
  stock: number;
}

interface CartContextType {
  items: CartItem[];
  isLoading: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addItem: (item: Omit<CartItem, "id">) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  itemCount: number;
  subtotal: number;
  tax: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const TAX_RATE = 0.08; // 8% tax
const STORAGE_KEY = "soledrip-cart";

function generateSessionId(): string {
  return `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function getSessionId(): string {
  let sessionId = localStorage.getItem("soledrip-session-id");
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem("soledrip-session-id", sessionId);
  }
  return sessionId;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Load cart from localStorage first, then sync with DB
  const loadCart = useCallback(async () => {
    setIsLoading(true);
    
    // Load from localStorage first for immediate display
    const savedCart = localStorage.getItem(STORAGE_KEY);
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart from localStorage");
      }
    }

    // If user is logged in, sync with database
    if (user) {
      try {
        const { data, error } = await supabase
          .from("cart_items")
          .select(`
            id,
            quantity,
            product:products(id, name, price, images),
            variant:product_variants(id, stock, size:sizes(value), color:colors(name, hex_code))
          `)
          .eq("user_id", user.id);

        if (error) throw error;

        if (data && data.length > 0) {
          const dbItems: CartItem[] = data.map((item: any) => ({
            id: item.id,
            productId: item.product?.id || "",
            variantId: item.variant?.id || null,
            name: item.product?.name || "Unknown Product",
            image: item.product?.images?.[0] || "",
            price: Number(item.product?.price) || 0,
            size: item.variant?.size?.value || null,
            color: item.variant?.color?.name || null,
            quantity: item.quantity,
            stock: item.variant?.stock || 0,
          }));
          setItems(dbItems);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(dbItems));
        }
      } catch (error) {
        console.error("Error loading cart from DB:", error);
      }
    }

    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // Save to localStorage whenever items change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isLoading]);

  const addItem = async (newItem: Omit<CartItem, "id">) => {
    // Check if item already exists
    const existingIndex = items.findIndex(
      (item) => item.productId === newItem.productId && item.variantId === newItem.variantId
    );

    if (existingIndex >= 0) {
      // Update quantity
      const updatedItems = [...items];
      const newQty = updatedItems[existingIndex].quantity + newItem.quantity;
      
      if (newQty > newItem.stock) {
        toast({
          title: "Not enough stock",
          description: `Only ${newItem.stock} available`,
          variant: "destructive",
        });
        return;
      }

      updatedItems[existingIndex].quantity = newQty;
      setItems(updatedItems);

      // Update in DB if logged in
      if (user) {
        await supabase
          .from("cart_items")
          .update({ quantity: newQty })
          .eq("id", items[existingIndex].id);
      }
    } else {
      // Add new item
      const tempId = `temp_${Date.now()}`;
      const itemWithId = { ...newItem, id: tempId };
      setItems((prev) => [...prev, itemWithId]);

      // Save to DB if logged in
      if (user) {
        const { data, error } = await supabase
          .from("cart_items")
          .insert({
            user_id: user.id,
            product_id: newItem.productId,
            variant_id: newItem.variantId,
            quantity: newItem.quantity,
          })
          .select()
          .single();

        if (!error && data) {
          setItems((prev) =>
            prev.map((item) => (item.id === tempId ? { ...item, id: data.id } : item))
          );
        }
      } else {
        // For guest users, use session_id
        const sessionId = getSessionId();
        await supabase.from("cart_items").insert({
          session_id: sessionId,
          product_id: newItem.productId,
          variant_id: newItem.variantId,
          quantity: newItem.quantity,
        });
      }
    }

    toast({
      title: "Added to cart",
      description: `${newItem.name} has been added to your cart.`,
    });
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) return;

    const item = items.find((i) => i.id === id);
    if (!item) return;

    if (quantity > item.stock) {
      toast({
        title: "Not enough stock",
        description: `Only ${item.stock} available`,
        variant: "destructive",
      });
      return;
    }

    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );

    // Update in DB
    if (user) {
      await supabase.from("cart_items").update({ quantity }).eq("id", id);
    }
  };

  const removeItem = async (id: string) => {
    const item = items.find((i) => i.id === id);
    setItems((prev) => prev.filter((item) => item.id !== id));

    // Remove from DB
    if (user || !id.startsWith("temp_")) {
      await supabase.from("cart_items").delete().eq("id", id);
    }

    if (item) {
      toast({
        title: "Removed from cart",
        description: `${item.name} has been removed.`,
      });
    }
  };

  const clearCart = async () => {
    setItems([]);
    localStorage.removeItem(STORAGE_KEY);

    if (user) {
      await supabase.from("cart_items").delete().eq("user_id", user.id);
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        isLoading,
        isOpen,
        setIsOpen,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        itemCount,
        subtotal,
        tax,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
