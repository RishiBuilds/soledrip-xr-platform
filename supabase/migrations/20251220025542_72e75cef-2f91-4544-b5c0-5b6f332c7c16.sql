-- Create product_views table for tracking recently viewed and trending
CREATE TABLE public.product_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.product_views ENABLE ROW LEVEL SECURITY;

-- Anyone can insert views (for anonymous tracking)
CREATE POLICY "Anyone can insert product views"
ON public.product_views
FOR INSERT
WITH CHECK (true);

-- Users can view their own views
CREATE POLICY "Users can view their own product views"
ON public.product_views
FOR SELECT
USING ((auth.uid() = user_id) OR (user_id IS NULL AND session_id IS NOT NULL));

-- Create index for efficient querying
CREATE INDEX idx_product_views_product_id ON public.product_views(product_id);
CREATE INDEX idx_product_views_user_id ON public.product_views(user_id);
CREATE INDEX idx_product_views_viewed_at ON public.product_views(viewed_at DESC);

-- Add related_category to help with recommendations
CREATE INDEX idx_products_category_id ON public.products(category_id);
CREATE INDEX idx_products_brand_id ON public.products(brand_id);