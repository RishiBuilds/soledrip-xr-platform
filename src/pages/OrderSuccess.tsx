import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

export default function OrderSuccessPage() {
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    // Clear cart after successful order
    clearCart();
  }, []);

  return (
    <Layout>
      <div className="container-custom flex min-h-[70vh] items-center justify-center py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-success/10"
          >
            <CheckCircle className="h-12 w-12 text-success" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="mt-6 font-display text-4xl">ORDER CONFIRMED!</h1>
            <p className="mt-4 text-muted-foreground">
              Thank you for your purchase. We've received your order and will begin
              processing it shortly.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 rounded-xl border border-border bg-card p-6"
          >
            <div className="flex items-center justify-center gap-3 text-muted-foreground">
              <Package className="h-5 w-5" />
              <span>Order confirmation sent to your email</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center"
          >
            <Button asChild size="lg">
              <Link to="/profile?tab=orders">
                View Orders
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/shop">Continue Shopping</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
}
