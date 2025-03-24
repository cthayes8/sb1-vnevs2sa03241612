/*
  # Fix blog posts table

  1. Changes
    - Drop and recreate blog_posts table with correct structure
    - Add proper indexes and constraints
    - Add RLS policies for proper access control

  2. Security
    - Enable RLS
    - Add policies for public read access
    - Add policies for authenticated user management
*/

-- Drop existing table if exists
DROP TABLE IF EXISTS blog_posts CASCADE;

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text NOT NULL,
  content text NOT NULL,
  author text NOT NULL,
  read_time integer NOT NULL DEFAULT 5,
  created_at timestamptz DEFAULT now(),
  published boolean DEFAULT false
);

-- Create indexes
CREATE INDEX blog_posts_slug_idx ON blog_posts(slug);
CREATE INDEX blog_posts_published_idx ON blog_posts(published);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public can view published posts"
  ON blog_posts
  FOR SELECT
  TO public
  USING (published = true);

CREATE POLICY "Authenticated users can create posts"
  ON blog_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their own posts"
  ON blog_posts
  FOR UPDATE
  TO authenticated
  USING (author = auth.jwt() ->> 'email')
  WITH CHECK (author = auth.jwt() ->> 'email');

CREATE POLICY "Users can delete their own posts"
  ON blog_posts
  FOR DELETE
  TO authenticated
  USING (author = auth.jwt() ->> 'email');

-- Insert sample blog posts
INSERT INTO blog_posts (
  title,
  slug,
  excerpt,
  content,
  author,
  read_time,
  published
) VALUES
(
  'The Future of 5G in Enterprise Mobility',
  'future-of-5g-enterprise-mobility',
  'Explore how 5G technology is transforming enterprise mobility and creating new opportunities for businesses.',
  '# The Future of 5G in Enterprise Mobility

## Introduction

5G technology is revolutionizing the way businesses operate, enabling unprecedented levels of connectivity, speed, and reliability. This post explores the key benefits and opportunities that 5G brings to enterprise mobility.

## Key Benefits

1. Ultra-low latency
2. Massive device connectivity
3. Enhanced mobile broadband
4. Network slicing capabilities

## Use Cases

- Remote operations
- IoT deployments
- Edge computing
- Real-time analytics

## Getting Started

Contact our team to learn how you can leverage 5G for your business transformation journey.',
  'demo@tlco.ai',
  8,
  true
),
(
  'Choosing the Right Business Mobile Plan',
  'choosing-right-business-mobile-plan',
  'A comprehensive guide to selecting the perfect mobile plan for your business needs.',
  '# Choosing the Right Business Mobile Plan

## Understanding Your Needs

Before selecting a business mobile plan, consider:

1. Number of lines needed
2. Data usage requirements
3. International calling needs
4. Device requirements

## Plan Types

### Unlimited Plans
- Best for heavy data users
- Multiple tiers available
- Built-in mobile hotspot

### Pooled Data Plans
- Shared data across devices
- Predictable monthly costs
- Flexible allocation

## Making the Decision

Consider these factors:
- Budget constraints
- Growth projections
- Security requirements
- Support needs

Contact us for a personalized recommendation.',
  'demo@tlco.ai',
  6,
  true
);