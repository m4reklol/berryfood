/*
  # Create menu storage bucket with proper RLS policies

  1. Storage Setup
    - Create 'menus' storage bucket if it doesn't exist
    - Set bucket to public for easy access to menu images
    
  2. Security Policies
    - Allow authenticated users to upload files to the menus bucket
    - Allow authenticated users to update/replace existing files
    - Allow public read access to all files in the bucket
    
  3. Notes
    - This enables the admin menu upload functionality
    - Files will be publicly accessible once uploaded
*/

-- Create the menus storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('menus', 'menus', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload files to the menus bucket
CREATE POLICY "Allow authenticated users to upload menu files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'menus');

-- Allow authenticated users to update/replace files in the menus bucket
CREATE POLICY "Allow authenticated users to update menu files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'menus');

-- Allow authenticated users to delete files in the menus bucket
CREATE POLICY "Allow authenticated users to delete menu files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'menus');

-- Allow public read access to all files in the menus bucket
CREATE POLICY "Allow public read access to menu files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'menus');