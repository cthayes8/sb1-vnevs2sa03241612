import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Search, Zap, Users } from 'lucide-react';

interface StepProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

function Step({ icon, title, description, index }: StepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative flex flex-col items-center text-center group"
    >
      {/* Connector Line */}
      {index < 3 && (
        <div className="absolute left-1/2 top-16 w-full h-0.5 bg-gradient-to-r from-purple-100 to-cyan-100 hidden md:block" />
      )}
      
      {/* Icon */}
      <div className="relative z-10 mb-6">
        <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center border border-purple-100 group-hover:border-purple-200 transition-all duration-300">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-50 to-cyan-50 flex items-center justify-center">
            {React.cloneElement(icon as React.ReactElement, { className: "w-6 h-6 text-purple-600" })}
          </div>
        </div>
        <div className="absolute -inset-2 bg-gradient-to-r from-purple-200 to-cyan-200 opacity-0 group-hover:opacity-20 rounded-full blur transition duration-500" />
      </div>

      {/* Content */}
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
}

export function HowItWorks() {
  const steps = [
    {
      icon: <Bot />,
      title: "AI-Powered Assistant",
      description: "Leverage our enterprise-grade AI that understands complex telecom solutions and your business requirements"
    },
    {
      icon: <Search />,
      title: "Intelligent Analysis",
      description: "Get data-driven recommendations based on comprehensive market analysis and customer needs"
    },
    {
      icon: <Zap />,
      title: "Automated Workflows",
      description: "Streamline enterprise sales processes with intelligent automation and compliance checks"
    },
    {
      icon: <Users />,
      title: "Enterprise Success",
      description: "Drive business growth with AI-enhanced insights and enterprise-grade support"
    }
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 py-24">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,transparent,black,transparent)]" />
      
      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-cyan-600">
            Enterprise-Grade AI Platform
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform your telecom sales with our advanced AI technology and automated workflows
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <Step
              key={index}
              icon={step.icon}
              title={step.title}
              description={step.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 