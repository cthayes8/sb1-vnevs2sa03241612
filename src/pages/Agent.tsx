import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

const CORRECT_PASSWORD = '$4R-ln4u47[?';

const Agent = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if accessed from dashboard
    const fromDashboard = localStorage.getItem('isAuthenticated') === 'true';
    if (fromDashboard) {
      setIsAuthenticated(true);
    }
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password');
      setTimeout(() => setError(''), 3000);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-card p-8 rounded-lg shadow-xl border border-border"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground text-center mb-2">Secure Access</h1>
          <p className="text-muted-foreground text-center mb-6">Enter your password to access TLCO GPT Assistant.</p>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Enter password"
                className="w-full bg-background border border-input rounded-lg p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-destructive text-sm text-center"
              >
                {error}
              </motion.p>
            )}
            <motion.button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Enter
            </motion.button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full h-[calc(100vh-64px)] overflow-hidden bg-background">
        <iframe
          src="https://www.chatbase.co/chatbot-iframe/iBXm1YP4YB9NiA1oGLMdx"
          width="100%"
          style={{ height: '100%', minHeight: '700px' }}
          frameBorder="0"
          title="TLCO AI Assistant"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          referrerPolicy="origin"
          loading="lazy"
          allow="microphone; camera"
        />
      </div>
    </div>
  );
};

export default Agent;