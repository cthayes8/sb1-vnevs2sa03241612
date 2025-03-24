import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { WaitlistFormData } from '../types';
import { sendWaitlistEmail } from '../utils/email';

interface WaitlistFormProps {
  onClose: () => void;
  initialEmail?: string;
}

const WaitlistForm: React.FC<WaitlistFormProps> = ({ onClose, initialEmail = '' }) => {
  const [formData, setFormData] = useState<WaitlistFormData>({
    name: '',
    email: initialEmail,
    company: '',
    phone: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const success = await sendWaitlistEmail(formData);
      if (success) {
        setSubmitted(true);
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div 
        className="bg-[#16162a] p-8 rounded-xl text-center border border-tlco-purple/30"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <h2 className="text-2xl font-montserrat font-bold text-white mb-4">
          Welcome to TLCO's Early Adopter Program!
        </h2>
        <p className="text-gray-300">Check your email for confirmation and next steps.</p>
      </motion.div>
    );
  }

  return (
    <div className="bg-[#16162a] p-8 rounded-xl border border-tlco-purple/30">
      <div className="bg-gradient-to-r from-tlco-purple/20 to-tlco-cyan/20 absolute inset-0 rounded-xl -z-10"></div>
      <h2 className="text-3xl font-montserrat font-bold mb-2 text-white text-center">Join Our Early Adopter Program</h2>
      <p className="text-gray-300 text-center mb-8">Be among the first to shape the future of telecom distribution</p>
      
      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-100 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
            Name *
          </label>
          <input
            type="text"
            id="name"
            required
            placeholder="Enter your full name"
            className="w-full bg-[#1a1a2e] border-tlco-purple/30 rounded-lg focus:border-tlco-purple focus:ring focus:ring-tlco-purple/50 text-white placeholder:text-gray-500"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={isSubmitting}
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
            placeholder="your@email.com"
            className="w-full bg-[#1a1a2e] border-tlco-purple/30 rounded-lg focus:border-tlco-purple focus:ring focus:ring-tlco-purple/50 text-white placeholder:text-gray-500"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
            Company Name *
          </label>
          <input
            type="text"
            id="company"
            required
            placeholder="Your company name"
            className="w-full bg-[#1a1a2e] border-tlco-purple/30 rounded-lg focus:border-tlco-purple focus:ring focus:ring-tlco-purple/50 text-white placeholder:text-gray-500"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
            Phone Number (Optional)
          </label>
          <input
            type="tel"
            id="phone"
            placeholder="(123) 456-7890"
            className="w-full bg-[#1a1a2e] border-tlco-purple/30 rounded-lg focus:border-tlco-purple focus:ring focus:ring-tlco-purple/50 text-white placeholder:text-gray-500"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            disabled={isSubmitting}
          />
        </div>

        <motion.button
          type="submit"
          className="w-full bg-tlco-purple text-white py-3 px-4 rounded-lg hover:animate-glow transition-all duration-300 font-montserrat font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
          whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Join Early Adopter Program'}
        </motion.button>
      </form>
    </div>
  );
};

export default WaitlistForm;