import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Book, Calendar, User, Plus } from 'lucide-react';
import { format } from 'date-fns';
import ParticleBackground from '../components/ParticleBackground';
import { supabase, testConnection } from '../lib/supabase';
import type { BlogPost } from '../types';

const POSTS_PER_PAGE = 6;

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const init = async () => {
      // Test connection first
      const connected = await testConnection();
      setIsConnected(connected);
      
      if (!connected) {
        setError('Unable to connect to the database. Please try again later.');
        setLoading(false);
        return;
      }

      // Check authentication
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);

      // Fetch posts
      fetchPosts();
    };

    init();
  }, [page]);

  const fetchPosts = async () => {
    try {
      setError(null);
      console.log('Fetching posts...');
      
      const { data, error: supabaseError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .range((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE - 1);

      console.log('Fetched data:', data);
      console.log('Error if any:', supabaseError);

      if (supabaseError) {
        throw supabaseError;
      }

      if (data) {
        if (page === 1) {
          setPosts(data);
        } else {
          setPosts(prev => [...prev, ...data]);
        }
        setHasMore(data.length === POSTS_PER_PAGE);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch posts');
      setPosts([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ParticleBackground />
      <div className="min-h-screen pt-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-tlco-dark via-tlco-dark/95 to-tlco-dark pointer-events-none" />
        <div className="absolute inset-0 bg-radial-gradient pointer-events-none" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-tlco-purple/20 via-tlco-cyan/20 to-tlco-purple/20 blur-xl" />
              <div className="relative">
                <h1 className="text-4xl md:text-5xl font-montserrat font-bold text-white mb-6">
                  Insights on AI-Powered Telecom Distribution
                </h1>
                <p className="text-xl text-gray-300">
                  Stay updated with the latest trends, insights, and best practices in telecom distribution.
                </p>
                {isAuthenticated && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-8"
                  >
                    <Link
                      to="/blog/new"
                      className="inline-flex items-center gap-2 bg-tlco-purple text-white px-6 py-3 rounded-lg hover:bg-tlco-purple/90 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Create New Post</span>
                    </Link>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>

          {error ? (
            <div className="text-center p-8 bg-red-500/10 rounded-lg border border-red-500/30">
              <p className="text-red-200">{error}</p>
            </div>
          ) : loading ? (
            <div className="text-center text-gray-300">Loading posts...</div>
          ) : posts.length === 0 ? (
            <div className="text-center text-gray-300">
              No posts found. {isAuthenticated && 'Create your first post!'}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post, index) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-tlco-purple/10 to-tlco-cyan/10 rounded-xl transform group-hover:scale-105 transition-transform duration-300 blur-xl" />
                    
                    <div className="relative bg-[#16162a] rounded-xl overflow-hidden border border-tlco-purple/20 backdrop-blur-lg">
                      <div className="absolute inset-0 bg-gradient-to-r from-tlco-purple/5 to-tlco-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className="p-6 flex flex-col h-full relative z-10">
                        <h2 className="text-xl font-montserrat font-bold mb-4 text-white group-hover:text-tlco-purple transition-colors">
                          <Link to={`/blog/${post.slug}`} className="hover:text-tlco-purple transition-colors">
                            {post.title}
                          </Link>
                        </h2>
                        
                        <p className="text-gray-300 mb-6 flex-grow">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>{post.author}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{format(new Date(post.created_at), 'MMM d, yyyy')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Book className="w-4 h-4" />
                            <span>{post.read_time} min read</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>

              {hasMore && (
                <div className="mt-12 text-center">
                  <motion.button
                    onClick={() => setPage(p => p + 1)}
                    className="bg-tlco-purple text-white px-6 py-3 rounded-lg hover:animate-glow transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Load More Posts
                  </motion.button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Blog;