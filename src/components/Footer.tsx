import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Instagram, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const socialLinks = [
    {
      icon: Linkedin,
      href: 'https://linkedin.com',
      label: 'LinkedIn'
    },
    {
      icon: () => (
        <svg
          viewBox="0 0 24 24"
          width="24"
          height="24"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
          <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
        </svg>
      ),
      href: 'https://x.com/TLCO_AI',
      label: 'X (Twitter)'
    },
    {
      icon: Instagram,
      href: 'https://instagram.com',
      label: 'Instagram'
    }
  ];

  return (
    <footer className="py-8 bg-tlco-dark border-t border-tlco-purple/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-8">
          <div className="flex items-center space-x-6">
            {socialLinks.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-tlco-purple transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label={social.label}
              >
                <social.icon className="w-6 h-6" />
              </motion.a>
            ))}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to="/blog" 
                className="text-gray-400 hover:text-tlco-purple transition-colors duration-300 flex items-center space-x-2"
                aria-label="Blog"
              >
                <BookOpen className="w-6 h-6" />
                <span className="text-sm font-medium">Blog</span>
              </Link>
            </motion.div>
          </div>

          <div className="text-center border-t border-tlco-purple/20 pt-8 max-w-lg mx-auto">
            <h3 className="text-white font-semibold mb-2">Investor Inquiries</h3>
            <p className="text-gray-400 mb-2">
              Interested in joining our journey to revolutionize telecom distribution?
            </p>
            <a 
              href="mailto:invest@tlco.ai" 
              className="text-tlco-purple hover:text-tlco-cyan transition-colors duration-300"
            >
              invest@tlco.ai
            </a>
          </div>

          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} TLCO. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;