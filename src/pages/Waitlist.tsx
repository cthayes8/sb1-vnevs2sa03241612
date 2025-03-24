import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { WaitlistFormData } from '../types';
import ParticleBackground from '../components/ParticleBackground';

const Waitlist = () => {
  const [formData, setFormData] = useState<WaitlistFormData>({
    name: '',
    email: '',
    company: '',
    phone: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div 
            className="glass-effect p-8 rounded-xl text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h2 className="text-2xl font-orbitron font-bold text-tlco-purple mb-4">
              Thanks for joining the TLCO waitlist!
            </h2>
            <p className="text-gray-300">We'll contact you soon.</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <>
      <ParticleBackground />
      <div className="min-h-screen pt-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl font-orbitron font-bold mb-8 text-center">Join Our Waitlist</h1>
            
            <form onSubmit={handleSubmit} className="glass-effect p-8 rounded-xl space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  className="w-full bg-white/10 border-tlco-purple/30 rounded-lg focus:border-tlco-purple focus:ring focus:ring-tlco-purple/50 text-white"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  className="w-full bg-white/10 border-tlco-purple/30 rounded-lg focus:border-tlco-purple focus:ring focus:ring-tlco-purple/50 text-white"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
                  Company Name (Optional)
                </label>
                <input
                  type="text"
                  id="company"
                  className="w-full bg-white/10 border-tlco-purple/30 rounded-lg focus:border-tlco-purple focus:ring focus:ring-tlco-purple/50 text-white"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="w-full bg-white/10 border-tlco-purple/30 rounded-lg focus:border-tlco-purple focus:ring focus:ring-tlco-purple/50 text-white"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <motion.button
                type="submit"
                className="w-full bg-tlco-purple text-white py-3 px-4 rounded-lg hover:animate-glow transition-all duration-300 font-orbitron"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Join Waitlist
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Waitlist;