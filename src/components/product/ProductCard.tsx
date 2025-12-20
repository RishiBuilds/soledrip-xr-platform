import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WishlistButton } from "@/components/product/WishlistButton";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.5 }}
      className="group relative"
    >
      <Link to={`/product/${product.slug}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted image-shine">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-linear-to-br from-muted to-muted/50">
              <span className="text-7xl opacity-30">👟</span>
            </div>
          )}

          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-linear-to-t from-background/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="absolute inset-0 bg-linear-to-b from-background/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-2">
            {product.is_new && (
              <Badge className="bg-accent text-accent-foreground font-semibold shadow-lg">NEW</Badge>
            )}
            {discount > 0 && (
              <Badge variant="destructive" className="font-semibold shadow-lg">-{discount}%</Badge>
            )}
          </div>

          {/* Wishlist button */}
          <div className="absolute right-3 top-3 opacity-0 transition-all duration-300 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0">
            <WishlistButton productId={product.id} variant="icon" />
          </div>

          {/* Quick view on hover */}
          <div className="absolute bottom-4 left-4 right-4 translate-y-6 opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
            <Button className="w-full font-semibold shadow-xl rounded-xl" size="sm">
              Quick View
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div className="mt-5 space-y-1.5">
          {product.brand && (
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {product.brand.name}
            </p>
          )}
          <h3 className="font-medium leading-tight transition-colors group-hover:text-primary line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-baseline gap-2.5 pt-1">
            <span className="text-lg font-bold">₹{product.price.toFixed(2)}</span>
            {product.original_price && (
              <span className="text-sm text-muted-foreground line-through">
                ₹{product.original_price.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}