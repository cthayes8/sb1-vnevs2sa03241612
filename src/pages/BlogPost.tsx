import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Calendar, Book, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { marked } from 'marked';
import { supabase } from '../lib/supabase';
import type { BlogPost } from '../types';
import ParticleBackground from '../components/ParticleBackground';

const BlogPostPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if (error) throw error;
      setPost(data);
    } catch (error) {
      console.error('Error fetching post:', error);
      navigate('/blog');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-white">Post not found</div>
      </div>
    );
  }

  return (
    <>
      <ParticleBackground />
      <div className="min-h-screen pt-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-tlco-dark via-tlco-dark/95 to-tlco-dark pointer-events-none" />
        <div className="absolute inset-0 bg-radial-gradient pointer-events-none" />
        
        <article className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.button
            onClick={() => navigate('/blog')}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Blog</span>
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <header className="mb-12">
              <h1 className="text-4xl md:text-5xl font-montserrat font-bold mb-6 text-white">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-gray-400">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{format(new Date(post.created_at), 'MMMM d, yyyy')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Book className="w-5 h-5" />
                  <span>{post.read_time} min read</span>
                </div>
              </div>
            </header>

            <div className="prose prose-invert prose-lg max-w-none">
              <div 
                dangerouslySetInnerHTML={{ __html: marked(post.content) }}
                className="text-gray-300 leading-relaxed"
              />
            </div>
          </motion.div>
        </article>
      </div>
    </>
  );
};

export default BlogPostPage;