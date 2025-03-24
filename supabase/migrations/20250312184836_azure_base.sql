/*
  # Add management policies for blog posts

  1. Changes
    - Add policies for updating and deleting blog posts
    - Only authenticated users can update/delete their own posts
    - Posts can only be updated/deleted if they belong to the authenticated user

  2. Security
    - Add RLS policies for UPDATE and DELETE operations
    - Restrict operations to post authors only
*/

-- Allow authenticated users to update their own posts
CREATE POLICY "Users can update their own posts"
  ON blog_posts
  FOR UPDATE
  TO authenticated
  USING (author = auth.jwt() ->> 'email')
  WITH CHECK (author = auth.jwt() ->> 'email');

-- Allow authenticated users to delete their own posts
CREATE POLICY "Users can delete their own posts"
  ON blog_posts
  FOR DELETE
  TO authenticated
  USING (author = auth.jwt() ->> 'email');