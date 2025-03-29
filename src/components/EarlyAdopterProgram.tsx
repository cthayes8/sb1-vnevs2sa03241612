import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Rocket, ArrowRight, MessageSquare, Zap, Star } from "lucide-react";

// Utility function to combine class names
const cn = (...classes: string[]) => classes.filter(Boolean).join(" ");

interface BenefitCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

function BenefitCard({ icon, title, description, delay }: BenefitCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      className="relative group"
    >
      <div className="h-full overflow-hidden bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
        <div className="p-6 flex flex-col h-full">
          <div className="mb-4 p-3 rounded-full bg-purple-50 w-fit group-hover:bg-purple-100 transition-colors duration-300">
            {React.cloneElement(icon as React.ReactElement, { className: "h-6 w-6 text-purple-600" })}
          </div>
          <h3 className="text-xl font-bold mb-2 text-gray-900">{title}</h3>
          <p className="text-gray-600 flex-grow">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}

interface BetaWaitlistProps {
  onCtaClick: () => void;
}

export function BetaWaitlist({ onCtaClick }: BetaWaitlistProps) {
  const benefits = [
    {
      icon: <Rocket />,
      title: "Priority Access",
      description:
        "Be first in line to experience our enterprise AI platform when we launch",
    },
    {
      icon: <MessageSquare />,
      title: "Direct Input",
      description:
        "Shape our enterprise solution with your valuable feedback and requirements",
    },
    {
      icon: <Zap />,
      title: "Enterprise Ready",
      description:
        "Get early access to enterprise-grade features and integrations",
    },
    {
      icon: <Star />,
      title: "VIP Support",
      description:
        "Receive dedicated support and strategic guidance during the beta phase",
    },
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,transparent,black,transparent)]" />

      <div className="relative z-10 container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-100 mb-4">
            <Sparkles className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">Coming Soon</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-cyan-600">
            Join Our Enterprise Beta
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Be among the first enterprises to leverage our advanced AI platform for telecom sales. Reserve your spot in our upcoming beta release.
          </p>
          <button
            onClick={onCtaClick}
            className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl group"
          >
            Request Beta Access
            <ArrowRight className="ml-2 h-5 w-5 inline-block transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-16"
        >
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Enterprise Beta Benefits
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <BenefitCard
                key={index}
                icon={benefit.icon}
                title={benefit.title}
                description={benefit.description}
                delay={index + 1}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
} 