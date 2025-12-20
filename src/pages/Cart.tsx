import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Loader2, CreditCard, Shield, Truck } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal, tax, total, itemCount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [promoCode, setPromoCode] = useState("");

  const handleCheckout = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to checkout.",
        variant: "destructive",
      });
      navigate("/auth?redirect=/cart");
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add some items to your cart first.",
        variant: "destructive",
      });
      return;
    }

    setIsCheckingOut(true);

    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          items: items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            name: item.name,
            image: item.image,
            price: item.price,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
          })),
          successUrl: `${window.location.origin}/order-success`,
          cancelUrl: `${window.location.origin}/cart`,
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast({
        title: "Checkout failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container-custom flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex h-28 w-28 items-center justify-center rounded-3xl bg-muted"
          >
            <ShoppingBag className="h-14 w-14 text-muted-foreground" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-8 font-display text-4xl"
          >
            Your Cart is Empty
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-3 text-muted-foreground"
          >
            Looks like you haven't added anything yet
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button className="mt-10 h-14 px-10 rounded-xl font-semibold shadow-lg shadow-primary/25" size="lg" onClick={() => navigate("/shop")}>
              Start Shopping
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <section className="relative overflow-hidden border-b border-border bg-muted/30 py-10 lg:py-12">
        <div className="absolute inset-0 bg-[image:var(--gradient-hero)] opacity-50" />
        <div className="container-custom relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Review Your Items
            </span>
            <h1 className="mt-2 font-display text-5xl tracking-tight lg:text-6xl">SHOPPING CART</h1>
            <p className="mt-3 text-lg text-muted-foreground">{itemCount} item{itemCount !== 1 && 's'} in your cart</p>
          </motion.div>
        </div>
      </section>

      <div className="container-custom py-10 lg:py-12">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-border bg-card shadow-lg overflow-hidden"
            >
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex gap-5 p-6 ${index !== items.length - 1 ? "border-b border-border" : ""}`}
                >
                  {/* Image */}
                  <div className="h-32 w-32 shrink-0 overflow-hidden rounded-2xl bg-muted">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-5xl opacity-30">👟</span>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
                          {item.size && (
                            <span className="inline-flex items-center rounded-lg bg-muted px-2.5 py-1 font-medium">
                              Size: {item.size}
                            </span>
                          )}
                          {item.color && (
                            <span className="inline-flex items-center rounded-lg bg-muted px-2.5 py-1 font-medium">
                              {item.color}
                            </span>
                          )}
                        </div>
                        <p className="mt-3 text-xl font-bold">₹{item.price.toFixed(2)}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-4">
                      {/* Quantity */}
                      <div className="flex items-center rounded-xl border border-border">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-l-xl rounded-r-none"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center font-semibold">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-r-xl rounded-l-none"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Line Total */}
                      <span className="text-xl font-bold">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="sticky top-24 rounded-3xl border border-border bg-card p-8 shadow-lg"
            >
              <h2 className="font-display text-2xl">ORDER SUMMARY</h2>

              {/* Promo Code */}
              <div className="mt-8">
                <label className="text-sm font-semibold">Promo Code</label>
                <div className="mt-2 flex gap-2">
                  <Input
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter code"
                    className="h-12 rounded-xl bg-muted/50 border-transparent focus:border-primary/50"
                  />
                  <Button variant="outline" className="h-12 rounded-xl font-semibold px-6">Apply</Button>
                </div>
              </div>

              <Separator className="my-8" />

              {/* Totals */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-semibold text-success">Free</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tax (8%)</span>
                  <span className="font-semibold">₹{tax.toFixed(2)}</span>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="flex items-center justify-between font-display text-2xl">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>

              <Button
                className="mt-8 w-full h-14 text-base font-semibold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
                onClick={handleCheckout}
                disabled={isCheckingOut}
              >
                {isCheckingOut ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <CreditCard className="mr-2 h-5 w-5" />
                    Checkout
                  </>
                )}
              </Button>

              {/* Trust badges */}
              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  <span>Secure checkout powered by Stripe</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Truck className="h-4 w-4" />
                  <span>Free shipping on orders over $100</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}