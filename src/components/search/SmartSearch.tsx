import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, X, Package, Tag, Folder } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearchSuggestions } from "@/hooks/useRecommendations";
import { useDebounce } from "@/hooks/useDebounce";

interface SmartSearchProps {
  className?: string;
  onClose?: () => void;
}

export function SmartSearch({ className, onClose }: SmartSearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const { data: suggestions } = useSearchSuggestions(debouncedQuery);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const hasSuggestions =
    suggestions &&
    (suggestions.products.length > 0 ||
      suggestions.brands.length > 0 ||
      suggestions.categories.length > 0);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      setQuery("");
      onClose?.();
    }
  };

  const handleSelect = () => {
    setIsOpen(false);
    setQuery("");
    onClose?.();
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="search"
          placeholder="Search shoes, brands..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-10 h-11 rounded-xl border-muted bg-muted/50 focus:bg-background"
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </form>

      <AnimatePresence>
        {isOpen && hasSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 z-50 mt-2 rounded-xl border border-border bg-background shadow-xl overflow-hidden"
          >
            {/* Products */}
            {suggestions.products.length > 0 && (
              <div className="p-3">
                <div className="flex items-center gap-2 px-2 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <Package className="h-3.5 w-3.5" />
                  Products
                </div>
                <div className="space-y-1">
                  {suggestions.products.map((product) => (
                    <Link
                      key={product.id}
                      to={`/product/${product.slug}`}
                      onClick={handleSelect}
                      className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-muted transition-colors"
                    >
                      {product.images?.[0] && (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{product.name}</p>
                        <p className="text-sm text-primary font-semibold">
                          ₹{product.price.toFixed(2)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Brands */}
            {suggestions.brands.length > 0 && (
              <div className="border-t border-border p-3">
                <div className="flex items-center gap-2 px-2 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <Tag className="h-3.5 w-3.5" />
                  Brands
                </div>
                <div className="flex flex-wrap gap-2">
                  {suggestions.brands.map((brand) => (
                    <Link
                      key={brand.id}
                      to={`/shop?brand=${brand.slug}`}
                      onClick={handleSelect}
                      className="rounded-full bg-muted px-3 py-1.5 text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      {brand.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Categories */}
            {suggestions.categories.length > 0 && (
              <div className="border-t border-border p-3">
                <div className="flex items-center gap-2 px-2 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <Folder className="h-3.5 w-3.5" />
                  Categories
                </div>
                <div className="flex flex-wrap gap-2">
                  {suggestions.categories.map((category) => (
                    <Link
                      key={category.id}
                      to={`/shop?category=${category.slug}`}
                      onClick={handleSelect}
                      className="rounded-full bg-muted px-3 py-1.5 text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* View all results */}
            <div className="border-t border-border p-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-primary"
                onClick={handleSubmit}
              >
                <Search className="mr-2 h-4 w-4" />
                Search for "{query}"
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
