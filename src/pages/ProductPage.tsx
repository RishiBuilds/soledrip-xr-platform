import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Truck, Shield, RefreshCw, Check } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { WishlistButton } from "@/components/product/WishlistButton";
import { ProductViewer } from "@/components/product/ProductViewer";
import { useProduct } from "@/hooks/useProducts";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading } = useProduct(slug || "");
  const { toast } = useToast();
  const { addItem, setIsOpen } = useCart();

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Get unique sizes and colors from variants
  const { availableSizes, availableColors } = useMemo(() => {
    if (!product?.variants) return { availableSizes: [], availableColors: [] };

    const sizesMap = new Map();
    const colorsMap = new Map();

    product.variants.forEach((v) => {
      if (v.size && v.stock > 0) {
        sizesMap.set(v.size.id, v.size);
      }
      if (v.color && v.stock > 0) {
        colorsMap.set(v.color.id, v.color);
      }
    });

    return {
      availableSizes: Array.from(sizesMap.values()).sort((a, b) => a.sort_order - b.sort_order),
      availableColors: Array.from(colorsMap.values()),
    };
  }, [product?.variants]);

  // Check stock for selected combination
  const selectedVariant = useMemo(() => {
    if (!product?.variants || !selectedSize) return null;
    return product.variants.find(
      (v) =>
        v.size?.id === selectedSize &&
        (selectedColor ? v.color?.id === selectedColor : true) &&
        v.stock > 0
    );
  }, [product?.variants, selectedSize, selectedColor]);

  const handleAddToCart = async () => {
    if (!selectedSize) {
      toast({
        title: "Select a size",
        description: "Please select a size before adding to cart.",
        variant: "destructive",
      });
      return;
    }

    if (!product || !selectedVariant) return;

    const selectedSizeObj = availableSizes.find(s => s.id === selectedSize);
    const selectedColorObj = availableColors.find(c => c.id === selectedColor);

    await addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      image: product.images?.[0] || "",
      price: product.price,
      size: selectedSizeObj?.value || null,
      color: selectedColorObj?.name || null,
      quantity,
      stock: selectedVariant.stock,
    });

    setIsOpen(true);
  };

  const discount = product?.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  if (isLoading) {
    return (
      <Layout>
        <div className="container-custom py-10">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
            <Skeleton className="aspect-square rounded-3xl" />
            <div className="space-y-5">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-14 w-3/4" />
              <Skeleton className="h-8 w-1/4" />
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container-custom flex flex-col items-center justify-center py-28 text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-muted">
            <span className="text-5xl">😕</span>
          </div>
          <h1 className="mt-6 font-display text-4xl">Product Not Found</h1>
          <p className="mt-3 text-muted-foreground">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild className="mt-8 rounded-xl" size="lg">
            <Link to="/shop">Back to Shop</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="border-b border-border bg-muted/30">
        <div className="container-custom py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <span className="text-border">/</span>
            <Link to="/shop" className="hover:text-foreground transition-colors">Shop</Link>
            <span className="text-border">/</span>
            <span className="text-foreground font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container-custom py-10 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Product Viewer (Images + 3D) */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ProductViewer
              images={product.images || []}
              model3dUrl={product.model_3d}
              productName={product.name}
              isNew={product.is_new}
              discount={discount}
            />
          </motion.div>

          {/* Product Info */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col"
          >
            {/* Brand */}
            {product.brand && (
              <Link
                to={`/shop?brand=${product.brand.slug}`}
                className="text-sm font-semibold uppercase tracking-wider text-primary hover:underline"
              >
                {product.brand.name}
              </Link>
            )}

            {/* Name */}
            <h1 className="mt-3 font-display text-4xl tracking-tight lg:text-5xl">
              {product.name}
            </h1>

            {/* Price */}
            <div className="mt-5 flex items-baseline gap-3">
              <span className="text-4xl font-bold">₹{product.price.toFixed(2)}</span>
              {product.original_price && (
                <span className="text-xl text-muted-foreground line-through">
                  ₹{product.original_price.toFixed(2)}
                </span>
              )}
              {discount > 0 && (
                <Badge variant="destructive" className="ml-2">Save {discount}%</Badge>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="mt-6 text-muted-foreground leading-relaxed">{product.description}</p>
            )}

            {/* Color Selection */}
            {availableColors.length > 0 && (
              <div className="mt-8">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
                  Color: <span className="text-muted-foreground font-normal normal-case">{availableColors.find((c) => c.id === selectedColor)?.name || "Select"}</span>
                </h3>
                <div className="flex flex-wrap gap-3">
                  {availableColors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color.id)}
                      className={`relative h-12 w-12 rounded-xl border-2 transition-all ${
                        selectedColor === color.id
                          ? "border-primary scale-110 shadow-lg"
                          : "border-transparent hover:scale-105"
                      }`}
                      style={{ backgroundColor: color.hex_code }}
                      title={color.name}
                    >
                      {selectedColor === color.id && (
                        <Check className="absolute inset-0 m-auto h-5 w-5 text-white drop-shadow-md" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            <div className="mt-8">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wider">Size</h3>
                <button className="text-sm font-medium text-primary hover:underline">Size Guide</button>
              </div>
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                {availableSizes.map((size) => (
                  <Button
                    key={size.id}
                    variant={selectedSize === size.id ? "default" : "outline"}
                    className={`h-12 rounded-xl font-semibold transition-all ${
                      selectedSize === size.id ? "shadow-lg" : ""
                    }`}
                    onClick={() => setSelectedSize(size.id)}
                  >
                    {size.value.replace("US ", "")}
                  </Button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mt-8">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Quantity</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center rounded-xl border border-border">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12 rounded-l-xl rounded-r-none"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-14 text-center text-lg font-semibold">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12 rounded-r-xl rounded-l-none"
                    onClick={() => setQuantity((q) => q + 1)}
                    disabled={selectedVariant ? quantity >= selectedVariant.stock : false}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {selectedVariant && (
                  <span className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{selectedVariant.stock}</span> in stock
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex gap-3">
              <Button 
                size="lg" 
                className="flex-1 h-14 text-base font-semibold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all" 
                onClick={handleAddToCart}
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <WishlistButton 
                productId={product.id} 
                variant="icon" 
                className="h-14 w-14 rounded-xl border-2"
              />
            </div>

            {/* Features */}
            <div className="mt-10 grid gap-4 border-t border-border pt-10 sm:grid-cols-3">
              {[
                { icon: Truck, title: "Free Shipping", desc: "Orders over ₹5000" },
                { icon: RefreshCw, title: "Easy Returns", desc: "30-day policy" },
                { icon: Shield, title: "Secure Payment", desc: "SSL encrypted" },
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                    <feature.icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{feature.title}</p>
                    <p className="text-xs text-muted-foreground">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}