import React, { useState } from 'react';
import { MessageSquare, Clock, Coins, Share2, FileSpreadsheet, LineChart, UserPlus, Bot, CheckCircle, Users, Zap, BarChart, FileText, Smartphone, Database } from 'lucide-react';
import { motion } from 'framer-motion';
import ParticleBackground from '../components/ParticleBackground';
import { HeroWithChat } from '../components/HeroWithChat';
import QuoteAnimation from '../components/QuoteAnimation';
import Modal from '../components/Modal';
import WaitlistForm from '../components/WaitlistForm';
import { FeaturesGrid } from '../components/FeaturesGrid';
import { BetaWaitlist } from '../components/EarlyAdopterProgram';
import { HowItWorks } from '../components/HowItWorks';

const Home = () => {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [email, setEmail] = useState('');

  const handleWaitlistClick = () => {
    setIsWaitlistOpen(true);
  };

  return (
    <>
      <ParticleBackground />
      
      {/* Hero Section - Showcase the AI */}
      <section className="relative">
        <HeroWithChat />
      </section>

      {/* Features Section - What the platform offers */}
      <section className="relative">
        <FeaturesGrid />
      </section>

      {/* How It Works - Process explanation */}
      <section className="relative">
        <HowItWorks />
      </section>

      {/* Beta Waitlist - Single clear CTA */}
      <section className="relative">
        <BetaWaitlist onCtaClick={handleWaitlistClick} />
      </section>

      {/* Waitlist Modal */}
      <Modal isOpen={isWaitlistOpen} onClose={() => setIsWaitlistOpen(false)}>
        <WaitlistForm onClose={() => setIsWaitlistOpen(false)} initialEmail={email} />
      </Modal>
    </>
  );
};

export default Home;