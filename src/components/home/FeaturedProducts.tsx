import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGridSkeleton } from "@/components/ui/ProductSkeleton";
import { useFeaturedProducts } from "@/hooks/useProducts";

export function FeaturedProducts() {
  const { data: products, isLoading } = useFeaturedProducts();

  return (
    <section className="section-padding relative overflow-hidden">
      {/* Subtle background accent */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-muted/30 to-transparent" />
      
      <div className="container-custom relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Flame className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                Hot Right Now
              </span>
            </div>
            <h2 className="font-display text-5xl tracking-tight lg:text-6xl">
              TRENDING NOW
            </h2>
            <p className="mt-3 max-w-md text-muted-foreground">
              The most popular kicks this season. Curated for the style-conscious.
            </p>
          </div>
          <Button asChild variant="outline" size="lg" className="hidden rounded-xl border-2 font-semibold sm:flex hover:bg-foreground hover:text-background transition-all duration-300">
            <Link to="/shop">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        <div className="mt-12">
          {isLoading ? (
            <ProductGridSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-7">
              {products?.slice(0, 8).map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          )}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 text-center sm:hidden"
        >
          <Button asChild size="lg" className="rounded-xl font-semibold">
            <Link to="/shop">
              View All Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}