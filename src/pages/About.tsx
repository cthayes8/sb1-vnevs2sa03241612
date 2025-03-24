import React from 'react';
import { Phone, Network } from 'lucide-react';
import { motion } from 'framer-motion';
import ParticleBackground from '../components/ParticleBackground';

const About = () => {
  return (
    <>
      <ParticleBackground />
      <div className="min-h-screen pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl font-orbitron font-bold mb-12 text-white">About TLCO</h1>
              
              <div className="space-y-8">
                <motion.div
                  className="glass-effect p-6 rounded-xl"
                  whileHover={{ scale: 1.02 }}
                >
                  <h2 className="text-2xl font-orbitron font-bold mb-3 text-tlco-purple">Our Mission</h2>
                  <p className="text-gray-300">
                    To redefine telecom distribution with AI-driven efficiency.
                  </p>
                </motion.div>
                
                <motion.div
                  className="glass-effect p-6 rounded-xl"
                  whileHover={{ scale: 1.02 }}
                >
                  <h2 className="text-2xl font-orbitron font-bold mb-3 text-tlco-purple">Our Vision</h2>
                  <p className="text-gray-300">
                    A future where agents close deals faster and smarter.
                  </p>
                </motion.div>
                
                <motion.div
                  className="glass-effect p-6 rounded-xl"
                  whileHover={{ scale: 1.02 }}
                >
                  <h2 className="text-2xl font-orbitron font-bold mb-3 text-tlco-purple">The TLCO Difference</h2>
                  <p className="text-gray-300">
                    Unlike traditional TSDs, TLCO uses AI to cut quote times from days to seconds, empowering agents to sell more.
                  </p>
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex justify-center"
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <Network className="h-64 w-64 text-tlco-purple" />
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;