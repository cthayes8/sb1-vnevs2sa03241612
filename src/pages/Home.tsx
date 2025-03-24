import React, { useState } from 'react';
import { MessageSquare, Clock, Coins, Share2, FileSpreadsheet, LineChart, UserPlus, Bot, CheckCircle, Users, Zap, BarChart, FileText, Smartphone, Database } from 'lucide-react';
import { motion } from 'framer-motion';
import CapabilityCard from '../components/CapabilityCard';
import ParticleBackground from '../components/ParticleBackground';
import ChatAnimation from '../components/ChatAnimation';
import QuoteAnimation from '../components/QuoteAnimation';
import Modal from '../components/Modal';
import WaitlistForm from '../components/WaitlistForm';

const Home = () => {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [email, setEmail] = useState('');

  const handleWaitlistClick = () => {
    setIsWaitlistOpen(true);
  };

  return (
    <>
      <ParticleBackground />
      
      {/* Hero Section */}
      <section className="min-h-screen relative pt-20 overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-tlco-dark/90 via-tlco-dark/80 to-tlco-dark/95 z-10"></div>
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover scale-105"
            poster="https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80"
          >
            <source
              src="https://static.videezy.com/system/resources/previews/000/051/920/original/4K_24.mp4"
              type="video/mp4"
            />
          </video>
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-6"
              >
                <div className="inline-block bg-gradient-to-r from-[#8c52ff]/20 to-tlco-cyan/20 backdrop-blur-sm px-6 py-2 rounded-full border border-[#8c52ff]/30">
                  <span className="text-lg font-montserrat font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#8c52ff] to-tlco-cyan">
                    Launching 2025
                  </span>
                </div>
              </motion.div>
              
              <h1 className="text-4xl md:text-5xl font-montserrat font-bold mb-6 text-white tracking-tight leading-tight">
                The Complete Telecom Sales Platform
              </h1>
              <p className="text-xl mb-8 text-gray-200 font-montserrat">
                Streamline your workflow with AI-powered quotes, certified device lookup, sales resources, and real-time market insights.
              </p>
              <button
                onClick={handleWaitlistClick}
                className="inline-block bg-[#8c52ff] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#7b45e6] transition-all duration-300"
              >
                Reserve your spot now
              </button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#8c52ff]/20 to-tlco-cyan/20 rounded-xl filter blur-3xl"></div>
              <ChatAnimation />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Platform Features Section */}
      <section className="py-20 relative bg-gradient-to-b from-tlco-dark via-tlco-dark/95 to-tlco-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-montserrat font-bold mb-4 text-[#8c52ff]">
              Your All-in-One Telecom Sales Platform
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Everything you need to close deals faster and maximize commissions in one powerful platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <CapabilityCard
              title="AI Sales Assistant"
              description="Get instant quotes and answers for every sales scenario with our AI-powered chat support, available 24/7."
              icon={Bot}
            />
            <CapabilityCard
              title="Certified Device Database"
              description="Access our comprehensive database of carrier-certified devices with detailed specifications and compatibility."
              icon={Smartphone}
            />
            <CapabilityCard
              title="Sales Resource Hub"
              description="One-stop access to sales collateral, case studies, presentations and training materials."
              icon={FileText}
            />
            <CapabilityCard
              title="Real-time Market Analytics"
              description="Stay ahead with live market trends, competitor analysis, and sales performance insights."
              icon={LineChart}
            />
            <CapabilityCard
              title="Plan Comparison Tools"
              description="Compare carrier plans side-by-side and find the perfect solution for your clients."
              icon={FileSpreadsheet}
            />
            <CapabilityCard
              title="Carrier Promotions"
              description="Stay updated with the latest carrier promotions and special offers in real-time."
              icon={Zap}
            />
          </div>
        </div>
      </section>

      {/* Early Adopter Program Section */}
      <section className="py-20 relative bg-gradient-to-b from-tlco-dark to-tlco-dark/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-montserrat font-bold mb-4 text-[#8c52ff]">
              Early Adopter Program
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Join the Early Adopter Program and secure your spot in line for the TLCO platform beta to transform your telecom sales.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              className="relative order-2 lg:order-1"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#8c52ff]/20 to-[#00C4B4]/20 rounded-xl filter blur-3xl"></div>
              <div className="relative bg-[#16162a] p-6 rounded-xl border border-[#8c52ff]/30">
                <QuoteAnimation />
              </div>
            </motion.div>

            <div className="space-y-8 order-1 lg:order-2">
              <motion.div
                className="bg-[#16162a] p-6 rounded-xl border border-[#8c52ff]/30"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#8c52ff] to-[#00C4B4] p-[1px]">
                    <div className="w-full h-full rounded-full bg-[#16162a] flex items-center justify-center">
                      <UserPlus className="w-6 h-6 text-[#00C4B4]" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-montserrat font-bold text-white mb-2">Join the Beta Program</h3>
                    <p className="text-gray-300">
                      Be among the first to experience our comprehensive telecom sales platform with AI-powered features.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="bg-[#16162a] p-6 rounded-xl border border-[#8c52ff]/30"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#8c52ff] to-[#00C4B4] p-[1px]">
                    <div className="w-full h-full rounded-full bg-[#16162a] flex items-center justify-center">
                      <Database className="w-6 h-6 text-[#00C4B4]" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-montserrat font-bold text-white mb-2">Complete Sales Toolkit</h3>
                    <p className="text-gray-300">
                      Access our full suite of tools including AI chat, device database, sales resources, and market analytics.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="bg-[#16162a] p-6 rounded-xl border border-[#8c52ff]/30"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#8c52ff] to-[#00C4B4] p-[1px]">
                    <div className="w-full h-full rounded-full bg-[#16162a] flex items-center justify-center">
                      <Zap className="w-6 h-6 text-[#00C4B4]" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-montserrat font-bold text-white mb-2">Boost Efficiency & Earnings</h3>
                    <p className="text-gray-300">
                      Close deals faster and increase commissions with our comprehensive platform and real-time insights.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="py-16 relative bg-gradient-to-r from-[#8c52ff]/20 via-tlco-cyan/20 to-[#8c52ff]/20">
        <div className="absolute inset-0 bg-tlco-dark/90 backdrop-blur-sm"></div>
        <motion.div 
          className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-montserrat font-bold mb-4 text-white">
            Ready to Transform Your Telecom Sales?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join our early adopter program and be the first to experience TLCO
          </p>
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-grow px-4 py-3 rounded-lg bg-white/10 border border-[#8c52ff]/30 text-white placeholder:text-gray-400 focus:outline-none focus:border-[#8c52ff] focus:ring-1 focus:ring-[#8c52ff]"
            />
            <motion.button
              onClick={handleWaitlistClick}
              className="bg-[#8c52ff] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#7b45e6] transition-all duration-300 whitespace-nowrap"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Become an Early Adopter
            </motion.button>
          </div>
        </motion.div>
      </section>

      <Modal isOpen={isWaitlistOpen} onClose={() => setIsWaitlistOpen(false)}>
        <WaitlistForm onClose={() => setIsWaitlistOpen(false)} initialEmail={email} />
      </Modal>
    </>
  );
};

export default Home;