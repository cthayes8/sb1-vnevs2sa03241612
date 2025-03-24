import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

const Header = () => {
  return (
    <header className="fixed w-full z-50">
      <nav className="bg-tlco-dark/95 backdrop-blur-md mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between border-b border-tlco-purple/20">
        <Link to="/" className="flex items-center space-x-3">
          <div className="h-10 w-10 flex items-center justify-center">
            <Zap className="h-8 w-8 text-[#8c52ff]" />
          </div>
          <span className="text-2xl font-orbitron font-bold text-white">TLCO</span>
        </Link>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-[#8c52ff] text-white px-3 sm:px-6 py-2 rounded-lg font-semibold hover:bg-[#7b45e6] transition-all duration-300 text-sm sm:text-base whitespace-nowrap"
          onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
        >
          <span className="hidden sm:inline">Become an Early Adopter</span>
          <span className="sm:hidden">Join Waitlist</span>
        </motion.button>
      </nav>
    </header>
  );
}

export default Header;