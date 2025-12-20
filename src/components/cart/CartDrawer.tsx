import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, ArrowRight} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

export function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, subtotal, tax, total, itemCount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    setIsOpen(false);
    if (!user) {
      navigate("/auth?redirect=/cart");
    } else {
      navigate("/cart");
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="flex w-full flex-col sm:max-w-lg p-0">
        <SheetHeader className="px-6 py-5 border-b border-border">
          <SheetTitle className="flex items-center gap-3 font-display text-xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <ShoppingBag className="h-5 w-5 text-primary" />
            </div>
            Your Cart ({itemCount})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center px-6">
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-muted">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="mt-6 font-display text-xl">Your cart is empty</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Add some items to get started
            </p>
            <Button className="mt-8 rounded-xl font-semibold" onClick={() => { setIsOpen(false); navigate("/shop"); }}>
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-4 py-5 border-b border-border last:border-0"
                  >
                    {/* Image */}
                    <Link
                      to={`/product/${item.productId}`}
                      onClick={() => setIsOpen(false)}
                      className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-muted"
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <span className="text-4xl opacity-30">👟</span>
                        </div>
                      )}
                    </Link>

                    {/* Details */}
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between">
                        <div>
                          <Link
                            to={`/product/${item.productId}`}
                            onClick={() => setIsOpen(false)}
                            className="font-semibold hover:text-primary transition-colors"
                          >
                            {item.name}
                          </Link>
                          <div className="mt-1.5 flex flex-wrap gap-2 text-xs">
                            {item.size && (
                              <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 font-medium text-muted-foreground">
                                {item.size}
                              </span>
                            )}
                            {item.color && (
                              <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 font-medium text-muted-foreground">
                                {item.color}
                              </span>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="mt-auto flex items-center justify-between pt-3">
                        {/* Quantity */}
                        <div className="flex items-center rounded-lg border border-border">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-l-lg rounded-r-none"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-9 text-center text-sm font-semibold">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-r-lg rounded-l-none"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        {/* Price */}
                        <span className="text-lg font-bold">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="border-t border-border bg-muted/30 px-6 py-6">
              {/* Summary */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Tax (8%)</span>
                  <span className="font-medium">₹{tax.toFixed(2)}</span>
                </div>
                <Separator className="my-3" />
                <div className="flex items-center justify-between font-display text-xl">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              <Button 
                className="mt-6 w-full h-14 rounded-xl font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all" 
                onClick={handleCheckout}
              >
                Proceed to Checkout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                className="mt-3 w-full rounded-xl font-semibold"
                onClick={() => { setIsOpen(false); navigate("/shop"); }}
              >
                Continue Shopping
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}