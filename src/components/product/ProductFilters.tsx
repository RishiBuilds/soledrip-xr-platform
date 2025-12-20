import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { Brand, Category, Size, Color, ProductFilters } from "@/types/product";

interface ProductFiltersProps {
  brands: Brand[];
  categories: Category[];
  sizes: Size[];
  colors: Color[];
  filters: ProductFilters;
  onFilterChange: (filters: ProductFilters) => void;
  onClearFilters: () => void;
}

export function ProductFiltersDesktop({
  brands,
  categories,
  sizes,
  colors,
  filters,
  onFilterChange,
  onClearFilters,
}: ProductFiltersProps) {
  const [priceRange, setPriceRange] = useState([filters.minPrice || 0, filters.maxPrice || 20000]);

  const hasActiveFilters = Object.values(filters).some((v) => v !== undefined && v !== "");

  return (
    <div className="hidden w-64 shrink-0 lg:block">
      <div className="sticky top-24 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl">FILTERS</h2>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={onClearFilters}>
              Clear All
            </Button>
          )}
        </div>

        <Accordion type="multiple" defaultValue={["categories", "brands", "price"]} className="space-y-2">
          {/* Categories */}
          <AccordionItem value="categories" className="border-none">
            <AccordionTrigger className="hover:no-underline">Categories</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                {categories.map((category) => (
                  <label key={category.id} className="flex cursor-pointer items-center gap-3">
                    <Checkbox
                      checked={filters.category === category.slug}
                      onCheckedChange={(checked) =>
                        onFilterChange({
                          ...filters,
                          category: checked ? category.slug : undefined,
                        })
                      }
                    />
                    <span className="text-sm">{category.name}</span>
                  </label>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Brands */}
          <AccordionItem value="brands" className="border-none">
            <AccordionTrigger className="hover:no-underline">Brands</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                {brands.map((brand) => (
                  <label key={brand.id} className="flex cursor-pointer items-center gap-3">
                    <Checkbox
                      checked={filters.brand === brand.slug}
                      onCheckedChange={(checked) =>
                        onFilterChange({
                          ...filters,
                          brand: checked ? brand.slug : undefined,
                        })
                      }
                    />
                    <span className="text-sm">{brand.name}</span>
                  </label>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Price Range */}
          <AccordionItem value="price" className="border-none">
            <AccordionTrigger className="hover:no-underline">Price Range</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 px-1">
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  onValueCommit={(value) =>
                    onFilterChange({
                      ...filters,
                      minPrice: value[0],
                      maxPrice: value[1],
                    })
                  }
                  max={20000}
                  step={500}
                  className="w-full"
                />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>₹{priceRange[0]}</span>
                  <span>₹{priceRange[1]}</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Sizes */}
          <AccordionItem value="sizes" className="border-none">
            <AccordionTrigger className="hover:no-underline">Sizes</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-3 gap-2">
                {sizes.map((size) => (
                  <Button
                    key={size.id}
                    variant={filters.size === size.id ? "default" : "outline"}
                    size="sm"
                    className="h-9"
                    onClick={() =>
                      onFilterChange({
                        ...filters,
                        size: filters.size === size.id ? undefined : size.id,
                      })
                    }
                  >
                    {size.value.replace("US ", "")}
                  </Button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Colors */}
          <AccordionItem value="colors" className="border-none">
            <AccordionTrigger className="hover:no-underline">Colors</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() =>
                      onFilterChange({
                        ...filters,
                        color: filters.color === color.id ? undefined : color.id,
                      })
                    }
                    className={`h-8 w-8 rounded-full border-2 transition-all ${
                      filters.color === color.id
                        ? "border-primary scale-110"
                        : "border-transparent hover:scale-105"
                    }`}
                    style={{ backgroundColor: color.hex_code }}
                    title={color.name}
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}

export function ProductFiltersMobile({
  brands,
  categories,
  sizes,
  colors,
  filters,
  onFilterChange,
  onClearFilters,
}: ProductFiltersProps) {
  const [open, setOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([filters.minPrice || 0, filters.maxPrice || 20000]);

  const activeFilterCount = Object.values(filters).filter((v) => v !== undefined && v !== "").length;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="lg:hidden">
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            Filters
            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" onClick={onClearFilters}>
                Clear All
              </Button>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Categories */}
          <div>
            <h3 className="mb-3 font-semibold">Categories</h3>
            <div className="space-y-3">
              {categories.map((category) => (
                <label key={category.id} className="flex cursor-pointer items-center gap-3">
                  <Checkbox
                    checked={filters.category === category.slug}
                    onCheckedChange={(checked) =>
                      onFilterChange({
                        ...filters,
                        category: checked ? category.slug : undefined,
                      })
                    }
                  />
                  <span>{category.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Brands */}
          <div>
            <h3 className="mb-3 font-semibold">Brands</h3>
            <div className="space-y-3">
              {brands.map((brand) => (
                <label key={brand.id} className="flex cursor-pointer items-center gap-3">
                  <Checkbox
                    checked={filters.brand === brand.slug}
                    onCheckedChange={(checked) =>
                      onFilterChange({
                        ...filters,
                        brand: checked ? brand.slug : undefined,
                      })
                    }
                  />
                  <span>{brand.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price */}
          <div>
            <h3 className="mb-3 font-semibold">Price Range</h3>
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              onValueCommit={(value) =>
                onFilterChange({
                  ...filters,
                  minPrice: value[0],
                  maxPrice: value[1],
                })
              }
              max={20000}
              step={500}
            />
            <div className="mt-2 flex justify-between text-sm text-muted-foreground">
              <span>₹{priceRange[0]}</span>
              <span>₹{priceRange[1]}</span>
            </div>
          </div>

          {/* Sizes */}
          <div>
            <h3 className="mb-3 font-semibold">Sizes</h3>
            <div className="grid grid-cols-4 gap-2">
              {sizes.map((size) => (
                <Button
                  key={size.id}
                  variant={filters.size === size.id ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    onFilterChange({
                      ...filters,
                      size: filters.size === size.id ? undefined : size.id,
                    })
                  }
                >
                  {size.value.replace("US ", "")}
                </Button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div>
            <h3 className="mb-3 font-semibold">Colors</h3>
            <div className="flex flex-wrap gap-3">
              {colors.map((color) => (
                <button
                  key={color.id}
                  onClick={() =>
                    onFilterChange({
                      ...filters,
                      color: filters.color === color.id ? undefined : color.id,
                    })
                  }
                  className={`h-10 w-10 rounded-full border-2 transition-all ${
                    filters.color === color.id
                      ? "border-primary scale-110"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: color.hex_code }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-6 right-6">
          <Button className="w-full" onClick={() => setOpen(false)}>
            View Results
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
