import React from 'react';
import { motion } from 'framer-motion';
import { CardProps } from '../types';

const CapabilityCard: React.FC<CardProps> = ({ title, description, icon: Icon }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="relative overflow-hidden rounded-2xl h-full"
    >
      {/* Gradient border effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-tlco-purple via-tlco-cyan to-tlco-purple animate-gradient rounded-2xl p-[1px]">
        <div className="absolute inset-0 bg-tlco-dark rounded-2xl" />
      </div>
      
      {/* Card content */}
      <div className="relative bg-[#16162a] p-8 rounded-2xl h-full flex flex-col border border-tlco-purple/20">
        {/* Icon container with gradient background */}
        <div className="relative w-16 h-16 mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-tlco-purple to-tlco-cyan rounded-full opacity-20 blur-md" />
          <div className="relative flex items-center justify-center w-full h-full bg-tlco-dark/50 rounded-full border border-tlco-purple/30">
            <Icon className="h-8 w-8 text-tlco-cyan" />
          </div>
        </div>

        <h3 className="text-xl font-montserrat font-bold mb-4 text-white">{title}</h3>
        <p className="text-gray-300 leading-relaxed flex-grow">{description}</p>

        {/* Hover glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-tlco-purple/0 via-tlco-cyan/10 to-tlco-purple/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </motion.div>
  );
};

export default CapabilityCard;