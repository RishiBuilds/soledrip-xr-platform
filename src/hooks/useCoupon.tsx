import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

// Validation schema for coupon code
const couponCodeSchema = z.string()
  .trim()
  .min(1, "Please enter a coupon code")
  .max(50, "Coupon code is too long")
  .regex(/^[A-Za-z0-9]+$/, "Coupon code can only contain letters and numbers");

export interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  min_order_amount: number;
  max_discount_amount: number | null;
}

export interface AppliedCoupon extends Coupon {
  discountAmount: number;
}

interface ValidateCouponParams {
  code: string;
  orderSubtotal: number;
}

export function useCoupon() {
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateCoupon = useMutation({
    mutationFn: async ({ code, orderSubtotal }: ValidateCouponParams): Promise<AppliedCoupon> => {
      // Client-side validation
      const parseResult = couponCodeSchema.safeParse(code);
      if (!parseResult.success) {
        throw new Error(parseResult.error.issues[0].message);
      }

      const normalizedCode = parseResult.data.toUpperCase();

      // Fetch coupon from database
      const { data: coupon, error: fetchError } = await supabase
        .from("coupons")
        .select("*")
        .eq("code", normalizedCode)
        .eq("is_active", true)
        .single();

      if (fetchError || !coupon) {
        throw new Error("Invalid coupon code");
      }

      // Check if coupon has started
      if (coupon.starts_at && new Date(coupon.starts_at) > new Date()) {
        throw new Error("This coupon is not yet active");
      }

      // Check if coupon has expired
      if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
        throw new Error("This coupon has expired");
      }

      // Check usage limit
      if (coupon.usage_limit && coupon.used_count != null && coupon.used_count >= coupon.usage_limit) {
        throw new Error("This coupon has reached its usage limit");
      }

      // Check minimum order amount
      if (coupon.min_order_amount && orderSubtotal < coupon.min_order_amount) {
        throw new Error(`Minimum order amount is ₹${coupon.min_order_amount.toFixed(2)}`);
      }

      // Calculate discount
      let discountAmount: number;
      if (coupon.discount_type === "percentage") {
        discountAmount = (orderSubtotal * coupon.discount_value) / 100;
        // Apply max discount cap
        if (coupon.max_discount_amount) {
          discountAmount = Math.min(discountAmount, coupon.max_discount_amount);
        }
      } else {
        discountAmount = coupon.discount_value;
      }

      // Ensure discount doesn't exceed order subtotal
      discountAmount = Math.min(discountAmount, orderSubtotal);

      return {
        id: coupon.id,
        code: coupon.code,
        description: coupon.description,
        discount_type: coupon.discount_type as "percentage" | "fixed",
        discount_value: coupon.discount_value,
        min_order_amount: coupon.min_order_amount || 0,
        max_discount_amount: coupon.max_discount_amount,
        discountAmount,
      };
    },
    onSuccess: (data) => {
      setAppliedCoupon(data);
      setError(null);
    },
    onError: (err: Error) => {
      setError(err.message);
      setAppliedCoupon(null);
    },
  });

  const applyCoupon = (code: string, orderSubtotal: number) => {
    setError(null);
    return validateCoupon.mutateAsync({ code, orderSubtotal });
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setError(null);
  };

  const calculateDiscount = (subtotal: number): number => {
    if (!appliedCoupon) return 0;

    let discount: number;
    if (appliedCoupon.discount_type === "percentage") {
      discount = (subtotal * appliedCoupon.discount_value) / 100;
      if (appliedCoupon.max_discount_amount) {
        discount = Math.min(discount, appliedCoupon.max_discount_amount);
      }
    } else {
      discount = appliedCoupon.discount_value;
    }

    return Math.min(discount, subtotal);
  };

  return {
    appliedCoupon,
    error,
    isValidating: validateCoupon.isPending,
    applyCoupon,
    removeCoupon,
    calculateDiscount,
  };
}
