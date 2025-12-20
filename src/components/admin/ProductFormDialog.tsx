import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBrands, useCategories } from "@/hooks/useProducts";
import { useCreateProduct, useUpdateProduct } from "@/hooks/useAdminData";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X, Box, Loader2 } from "lucide-react";

// Validation schema
const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be positive"),
  original_price: z.coerce.number().optional().nullable(),
  category_id: z.string().optional(),
  brand_id: z.string().optional(),
  images: z.string().optional(),
  featured: z.boolean().default(false),
  is_new: z.boolean().default(false),
  model_3d: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: any;
}

export function ProductFormDialog({
  open,
  onOpenChange,
  product,
}: ProductFormDialogProps) {
  const { data: brands } = useBrands();
  const { data: categories } = useCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const [uploading3D, setUploading3D] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      price: 0,
      original_price: null,
      category_id: "",
      brand_id: "",
      images: "",
      featured: false,
      is_new: false,
      model_3d: "",
    },
  });

  // Reset form when product changes or dialog opens
  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name || "",
        slug: product.slug || "",
        description: product.description || "",
        price: product.price || 0,
        original_price: product.original_price || null,
        category_id: product.category_id || "",
        brand_id: product.brand_id || "",
        images: Array.isArray(product.images) ? product.images.join(", ") : "",
        featured: product.featured || false,
        is_new: product.is_new || false,
        model_3d: product.model_3d || "",
      });
    } else {
      form.reset({
        name: "",
        slug: "",
        description: "",
        price: 0,
        original_price: null,
        category_id: "",
        brand_id: "",
        images: "",
        featured: false,
        is_new: false,
        model_3d: "",
      });
    }
  }, [product, open, form]);

  // Generate URL-friendly slug
  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  // Handle 3D model file upload
  const handle3DModelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validExtensions = [".glb", ".gltf"];
    const fileExt = file.name.toLowerCase().substring(file.name.lastIndexOf("."));
    
    if (!validExtensions.includes(fileExt)) {
      toast.error("Please upload a GLB or GLTF file");
      return;
    }

    // Validate file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      toast.error("File size must be under 50MB");
      return;
    }

    setUploading3D(true);
    
    try {
      // Create unique filename
      const timestamp = Date.now();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const fileName = `${timestamp}-${sanitizedName}`;
      
      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from("3d-models")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("3d-models")
        .getPublicUrl(data.path);

      form.setValue("model_3d", urlData.publicUrl);
      toast.success("3D model uploaded successfully");
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload 3D model");
    } finally {
      setUploading3D(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Remove 3D model
  const remove3DModel = () => {
    form.setValue("model_3d", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Submit form
  const onSubmit = async (data: ProductFormValues) => {
    try {
      const productData = {
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        price: data.price,
        original_price: data.original_price || null,
        category_id: data.category_id || null,
        brand_id: data.brand_id || null,
        images: data.images
          ? data.images.split(",").map((url) => url.trim()).filter(Boolean)
          : [],
        featured: data.featured,
        is_new: data.is_new,
        model_3d: data.model_3d || null,
      };

      if (product?.id) {
        await updateProduct.mutateAsync({ id: product.id, ...productData });
        toast.success("Product updated successfully");
      } else {
        await createProduct.mutateAsync(productData);
        toast.success("Product created successfully");
      }
      
      onOpenChange(false);
      form.reset();
    } catch (error: any) {
      console.error("Save error:", error);
      toast.error(error.message || "Failed to save product");
    }
  };

  const current3DModel = form.watch("model_3d");
  const isSubmitting = createProduct.isPending || updateProduct.isPending || uploading3D;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {product ? "Edit Product" : "Add New Product"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Product Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter product name"
                      onChange={(e) => {
                        field.onChange(e);
                        // Auto-generate slug for new products
                        if (!product) {
                          form.setValue("slug", generateSlug(e.target.value));
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Slug */}
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="product-url-slug" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter product description"
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price Fields */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (₹) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="original_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Original Price (₹)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="Optional"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Category and Brand */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories?.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="brand_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select brand" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {brands?.map((brand) => (
                          <SelectItem key={brand.id} value={brand.id}>
                            {brand.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Image URLs */}
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URLs</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter image URLs separated by commas"
                      rows={2}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 3D Model Upload */}
            <FormField
              control={form.control}
              name="model_3d"
              render={() => (
                <FormItem>
                  <FormLabel>3D Model (GLB/GLTF)</FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      {current3DModel ? (
                        <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/50 p-3">
                          <Box className="h-8 w-8 shrink-0 text-primary" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">3D Model attached</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {current3DModel}
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={remove3DModel}
                            className="shrink-0"
                            disabled={uploading3D}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div
                          className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 p-6 cursor-pointer hover:border-primary/50 transition-colors"
                          onClick={() => !uploading3D && fileInputRef.current?.click()}
                        >
                          {uploading3D ? (
                            <>
                              <Loader2 className="h-8 w-8 animate-spin text-primary" />
                              <p className="text-sm text-muted-foreground">
                                Uploading...
                              </p>
                            </>
                          ) : (
                            <>
                              <Upload className="h-8 w-8 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">
                                Click to upload GLB or GLTF file
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Max 50MB
                              </p>
                            </>
                          )}
                        </div>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".glb,.gltf"
                        onChange={handle3DModelUpload}
                        className="hidden"
                        disabled={uploading3D}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Feature Toggles */}
            <div className="flex gap-6">
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 space-y-0">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="cursor-pointer">Featured</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_new"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 space-y-0">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="cursor-pointer">New Arrival</FormLabel>
                  </FormItem>
                )}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {product ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>{product ? "Update Product" : "Create Product"}</>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}