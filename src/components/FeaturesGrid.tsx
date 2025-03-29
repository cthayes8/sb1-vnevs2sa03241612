import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Zap, Database, LineChart, Shield, Users } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

function FeatureCard({ icon, title, description, index }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
    >
      <div className="relative h-full overflow-hidden rounded-2xl bg-white p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-cyan-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Content */}
        <div className="relative z-10">
          <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/10 to-cyan-500/10 group-hover:from-purple-500/20 group-hover:to-cyan-500/20 transition-colors duration-300">
            {React.cloneElement(icon as React.ReactElement, { className: "h-6 w-6 text-purple-600" })}
          </div>
          <h3 className="mb-3 text-xl font-bold text-gray-900">{title}</h3>
          <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function FeaturesGrid() {
  const features = [
    {
      icon: <Bot />,
      title: "AI Workflow Automation",
      description: "Automate complex telecom sales workflows with our advanced AI, reducing manual tasks and increasing efficiency."
    },
    {
      icon: <Zap />,
      title: "Intelligent Recommendations",
      description: "Get real-time, data-driven product and solution recommendations tailored to each customer's needs."
    },
    {
      icon: <Database />,
      title: "Enterprise Integration",
      description: "Seamlessly integrate with your existing enterprise systems and databases for unified workflow management."
    },
    {
      icon: <LineChart />,
      title: "Advanced Analytics",
      description: "Access comprehensive analytics and insights to optimize your sales performance and strategy."
    },
    {
      icon: <Shield />,
      title: "Enterprise Security",
      description: "Bank-grade security protocols ensure your data and customer information remain protected."
    },
    {
      icon: <Users />,
      title: "Team Collaboration",
      description: "Enable seamless collaboration across sales teams with shared insights and unified workflows."
    }
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white py-24">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,transparent,black,transparent)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-base font-semibold text-purple-600">Enterprise Features</h2>
            <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Advanced AI for Telecom Sales
            </p>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
              Transform your telecom sales process with enterprise-grade AI technology and intelligent automation
            </p>
          </motion.div>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 