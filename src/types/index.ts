export type CarrierId = 'att' | 'verizon' | 'tmobile';

export interface WaitlistFormData {
  name: string;
  email: string;
  company: string;
  phone: string;
  source: string;
}

export interface CardProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp?: number;
  file?: {
    name: string;
    url: string;
    type: string;
  };
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  read_time: number;
  created_at: string;
  published: boolean;
}

export interface ChatHistory {
  id: string;
  date: Date;
  createdAt: number;
  preview: string;
  messages: ChatMessage[];
}

// Google Analytics
declare global {
  interface Window {
    gtag: (
      command: 'event',
      action: string,
      params: {
        [key: string]: any;
      }
    ) => void;
  }
}