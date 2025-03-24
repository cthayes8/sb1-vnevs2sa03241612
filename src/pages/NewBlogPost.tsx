import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import ParticleBackground from '../components/ParticleBackground';

const NewBlogPost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    readTime: 5,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('You must be logged in to create a post');
      }

      const slug = generateSlug(formData.title);

      const { error } = await supabase
        .from('blog_posts')
        .insert([
          {
            title: formData.title,
            slug,
            excerpt: formData.excerpt,
            content: formData.content,
            author: formData.author,
            read_time: formData.readTime,
            published: true
          }
        ]);

      if (error) throw error;

      navigate(`/blog/${slug}`);
    } catch (error) {
      console.error('Error creating post:', error);
      setError(error instanceof Error ? error.message : 'Failed to create post');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <ParticleBackground />
      <div className="min-h-screen pt-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-tlco-dark via-tlco-dark/95 to-tlco-dark pointer-events-none" />
        <div className="absolute inset-0 bg-radial-gradient pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-montserrat font-bold mb-8 text-white">Create New Blog Post</h1>

            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-100">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  required
                  className="w-full bg-white/10 border-tlco-purple/30 rounded-lg focus:border-tlco-purple focus:ring focus:ring-tlco-purple/50 text-white"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="excerpt" className="block text-sm font-medium text-gray-300 mb-2">
                  Excerpt
                </label>
                <textarea
                  id="excerpt"
                  required
                  rows={3}
                  className="w-full bg-white/10 border-tlco-purple/30 rounded-lg focus:border-tlco-purple focus:ring focus:ring-tlco-purple/50 text-white"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-2">
                  Content (Markdown)
                </label>
                <textarea
                  id="content"
                  required
                  rows={15}
                  className="w-full bg-white/10 border-tlco-purple/30 rounded-lg focus:border-tlco-purple focus:ring focus:ring-tlco-purple/50 text-white font-mono"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="author" className="block text-sm font-medium text-gray-300 mb-2">
                  Author
                </label>
                <input
                  type="text"
                  id="author"
                  required
                  className="w-full bg-white/10 border-tlco-purple/30 rounded-lg focus:border-tlco-purple focus:ring focus:ring-tlco-purple/50 text-white"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="readTime" className="block text-sm font-medium text-gray-300 mb-2">
                  Read Time (minutes)
                </label>
                <input
                  type="number"
                  id="readTime"
                  required
                  min="1"
                  className="w-full bg-white/10 border-tlco-purple/30 rounded-lg focus:border-tlco-purple focus:ring focus:ring-tlco-purple/50 text-white"
                  value={formData.readTime}
                  onChange={(e) => setFormData({ ...formData, readTime: parseInt(e.target.value) })}
                />
              </div>

              <motion.button
                type="submit"
                className="w-full bg-tlco-purple text-white py-3 px-4 rounded-lg hover:animate-glow transition-all duration-300 disabled:opacity-50"
                whileHover={{ scale: submitting ? 1 : 1.02 }}
                whileTap={{ scale: submitting ? 1 : 0.98 }}
                disabled={submitting}
              >
                {submitting ? 'Creating Post...' : 'Create Post'}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default NewBlogPost;