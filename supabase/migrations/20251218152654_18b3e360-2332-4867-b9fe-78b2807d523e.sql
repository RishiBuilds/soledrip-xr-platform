-- Add 3D model column to products table
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS model_3d TEXT;

-- Create storage bucket for 3D models
INSERT INTO storage.buckets (id, name, public)
VALUES ('3d-models', '3d-models', true)
ON CONFLICT (id) DO NOTHING;

-- RLS policy for public read access to 3D models
CREATE POLICY "Anyone can view 3D models"
ON storage.objects
FOR SELECT
USING (bucket_id = '3d-models');

-- Admins can upload 3D models
CREATE POLICY "Admins can upload 3D models"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = '3d-models' AND public.has_role(auth.uid(), 'admin'));

-- Admins can update 3D models
CREATE POLICY "Admins can update 3D models"
ON storage.objects
FOR UPDATE
USING (bucket_id = '3d-models' AND public.has_role(auth.uid(), 'admin'));

-- Admins can delete 3D models
CREATE POLICY "Admins can delete 3D models"
ON storage.objects
FOR DELETE
USING (bucket_id = '3d-models' AND public.has_role(auth.uid(), 'admin'));