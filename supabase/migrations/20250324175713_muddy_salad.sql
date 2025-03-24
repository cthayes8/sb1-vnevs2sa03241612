/*
  # Update blog posts with new author and add more posts

  1. Changes
    - Update existing posts with new author
    - Add more sample posts
    - Maintain existing structure and policies
*/

-- Update existing posts with new author
UPDATE blog_posts
SET author = 'Meredith Jones'
WHERE author = 'demo@tlco.ai';

-- Add more sample posts
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
  'Maximizing ROI with Enterprise IoT Solutions',
  'maximizing-roi-enterprise-iot',
  'Learn how to leverage IoT technology to drive business value and increase operational efficiency.',
  '# Maximizing ROI with Enterprise IoT Solutions

## The IoT Revolution

Enterprise IoT is transforming how businesses operate, collect data, and make decisions. This comprehensive guide explores proven strategies for maximizing your return on IoT investments.

## Key Implementation Strategies

1. Start with clear objectives
2. Choose the right connectivity solutions
3. Implement robust security measures
4. Scale gradually based on results

## Best Practices

- Focus on measurable outcomes
- Ensure proper device management
- Maintain data security
- Regular performance monitoring

## Success Stories

Learn from companies that have successfully implemented IoT solutions and achieved significant ROI.',
  'Meredith Jones',
  7,
  true
),
(
  'Private 5G Networks: A Game Changer for Industry 4.0',
  'private-5g-networks-industry',
  'Discover how private 5G networks are revolutionizing industrial operations and enabling smart manufacturing.',
  '# Private 5G Networks: A Game Changer for Industry 4.0

## Understanding Private 5G

Private 5G networks offer unprecedented control, security, and performance for industrial applications. This guide explores the benefits and implementation strategies.

## Key Advantages

1. Ultra-reliable connectivity
2. Enhanced security
3. Customized coverage
4. Dedicated bandwidth

## Implementation Guide

- Network planning
- Spectrum considerations
- Security measures
- Integration strategies

## Real-World Applications

Explore how leading manufacturers are leveraging private 5G networks.',
  'Meredith Jones',
  9,
  true
);