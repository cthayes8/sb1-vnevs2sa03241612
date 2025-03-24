import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Check } from 'lucide-react';

const QuoteAnimation = () => {
  return (
    <div className="w-full max-w-md">
      <div className="space-y-4">
        <Message 
          text="What's the current promotion for AT&T Business Fiber 2000?"
          delay={0.5}
          isUser
        />
        <Message 
          text="Here are the current AT&T Business Fiber 2000 promotions:"
          delay={1.5}
        />
        <Message 
          text="Business Fiber 2000
• $550/month
• $700 reward card
• Free professional installation
• 36-month agreement
• 99.9% reliability guarantee"
          delay={2.5}
        />
        <Message 
          text="Can you add FirstNet details for their field teams?"
          delay={3.5}
          isUser
        />
        <Message 
          text="FirstNet Bundle Offer:
• 25% off Business Fiber
• $0 activation on FirstNet lines
• Unlimited smartphone for $39.99
• 100GB hotspot for $40/month
• Priority network access"
          delay={4.5}
        />
      </div>
    </div>
  );
};

interface MessageProps {
  text: string;
  delay: number;
  isUser?: boolean;
}

const Message: React.FC<MessageProps> = ({ text, delay, isUser }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: isUser ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex items-start space-x-2 max-w-[85%] ${isUser ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-[#8c52ff]' : 'bg-[#00C4B4]'}`}>
          {isUser ? (
            <Check className="w-4 h-4 text-white" />
          ) : (
            <MessageSquare className="w-4 h-4 text-white" />
          )}
        </div>
        <div className={`p-3 rounded-xl ${isUser ? 'bg-[#8c52ff]' : 'bg-[#1E1B4B]'} text-white`}>
          <p className="whitespace-pre-line text-sm">{text}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default QuoteAnimation;