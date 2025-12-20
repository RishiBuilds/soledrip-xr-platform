import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Grid3X3, LayoutList, SlidersHorizontal } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductFiltersDesktop, ProductFiltersMobile } from "@/components/product/ProductFilters";
import { ProductGridSkeleton } from "@/components/ui/ProductSkeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProducts, useBrands, useCategories, useSizes, useColors } from "@/hooks/useProducts";
import type { ProductFilters } from "@/types/product";

export default function ShopPage() {
  const [filters, setFilters] = useState<ProductFilters>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: products, isLoading: productsLoading } = useProducts(filters);
  const { data: brands = [] } = useBrands();
  const { data: categories = [] } = useCategories();
  const { data: sizes = [] } = useSizes();
  const { data: colors = [] } = useColors();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, search: searchQuery });
  };

  const handleFilterChange = (newFilters: ProductFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchQuery("");
  };

  const handleSortChange = (value: string) => {
    setFilters({ ...filters, sortBy: value as ProductFilters["sortBy"] });
  };

  return (
    <Layout>
      {/* Header */}
      <section className="relative overflow-hidden border-b border-border bg-muted/30 py-12 lg:py-16">
        <div className="absolute inset-0 bg-[image:var(--gradient-hero)] opacity-50" />
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />
        <div className="container-custom relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Explore Our Collection
            </span>
            <h1 className="mt-2 font-display text-5xl tracking-tight lg:text-6xl">SHOP ALL</h1>
            <p className="mt-3 max-w-lg text-lg text-muted-foreground">
              Discover our full collection of premium footwear
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container-custom py-10 lg:py-12">
        <div className="flex gap-10">
          {/* Desktop Filters */}
          <ProductFiltersDesktop
            brands={brands}
            categories={categories}
            sizes={sizes}
            colors={colors}
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />

          {/* Products Area */}
          <div className="flex-1">
            {/* Toolbar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                {/* Mobile Filters */}
                <ProductFiltersMobile
                  brands={brands}
                  categories={categories}
                  sizes={sizes}
                  colors={colors}
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                />

                {/* Search */}
                <form onSubmit={handleSearch} className="relative flex-1 sm:w-72">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-11 h-11 rounded-xl bg-muted/50 border-transparent focus:border-primary/50 focus:bg-background transition-all"
                  />
                </form>
              </div>

              <div className="flex items-center gap-3">
                {/* Results count */}
                <span className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{products?.length || 0}</span> products
                </span>

                {/* Sort */}
                <Select value={filters.sortBy || ""} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-44 h-11 rounded-xl bg-muted/50 border-transparent">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    <SelectItem value="name">Name: A-Z</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Toggle */}
                <div className="hidden items-center gap-1 rounded-xl bg-muted/50 p-1.5 sm:flex">
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="icon"
                    className="h-8 w-8 rounded-lg"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="icon"
                    className="h-8 w-8 rounded-lg"
                    onClick={() => setViewMode("list")}
                  >
                    <LayoutList className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Products Grid */}
            {productsLoading ? (
              <ProductGridSkeleton count={8} />
            ) : products && products.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-2 gap-5 md:grid-cols-3 lg:gap-7"
                    : "space-y-5"
                }
              >
                {products.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-muted">
                  <span className="text-5xl">👟</span>
                </div>
                <h3 className="mt-6 font-display text-2xl">No products found</h3>
                <p className="mt-2 max-w-sm text-muted-foreground">
                  Try adjusting your filters or search terms to find what you're looking for
                </p>
                <Button className="mt-8 rounded-xl" onClick={handleClearFilters}>
                  Clear All Filters
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}