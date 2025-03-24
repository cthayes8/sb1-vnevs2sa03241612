import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Check } from 'lucide-react';

const ChatAnimation = () => {
  return (
    <div className="w-full max-w-md">
      <div className="space-y-4">
        <Message 
          text="I need a quote for 25 lines with unlimited data and hotspot for a construction company."
          delay={0.5}
          isUser
        />
        <Message 
          text="I'll help you get a quote for your construction company. Based on their needs, here's what I recommend:"
          delay={1.5}
        />
        <Message 
          text="AT&T Business Unlimited Elite
• 25 lines at $40/line per month
• Truly unlimited 5G/4G LTE data
• 40GB hotspot per line
• Advanced Mobile Security
• ActiveArmor protection included
Total Monthly: $1,000"
          delay={2.5}
        />
        <Message 
          text="Can you also show me T-Mobile's comparable plan?"
          delay={3.5}
          isUser
        />
        <Message 
          text="Here's T-Mobile's Business Advanced plan:
• 25 lines at $35/line per month
• Unlimited 5G/4G LTE data
• 100GB Premium Data
• 50GB hotspot per line
• Microsoft 365 included
Total Monthly: $875"
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
        <div className={`p-3 rounded-xl ${isUser ? 'bg-[#8c52ff] text-white' : 'bg-[#2D3748] text-white'}`}>
          <p className="whitespace-pre-line text-sm">{text}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatAnimation;