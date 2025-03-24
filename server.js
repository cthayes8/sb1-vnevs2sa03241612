import express from 'express';
import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createClient } from '@supabase/supabase-js';
import cors from 'cors';
import compression from 'compression';
import { generateEmailTemplate } from './src/emailTemplate.js';
import { createServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Enable compression
app.use(compression());

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

app.use(cors());
app.use(express.json());

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Create Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.VITE_SUPABASE_ANON_KEY || ''
);

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

app.post('/api/waitlist', async (req, res) => {
  try {
    const { name, email, company, phone } = req.body;

    // Validate required fields
    if (!name || !email || !company) {
      return res.status(400).json({ 
        success: false,
        error: 'Name, email, and company are required' 
      });
    }

    // Validate email format
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid email format' 
      });
    }

    // Check for existing email
    const { data: existingUser } = await supabase
      .from('waitlist')
      .select('email')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'This email is already on the waitlist'
      });
    }

    // Insert into waitlist
    const { error: insertError } = await supabase
      .from('waitlist')
      .insert([{ name, email, company, phone }]);

    if (insertError) {
      console.error('Database error:', insertError);
      return res.status(500).json({
        success: false,
        error: 'Failed to add to waitlist'
      });
    }

    // Send confirmation email
    try {
      const msg = {
        to: email,
        from: {
          email: 'noreply@tlco.ai',
          name: 'TLCO AI'
        },
        subject: 'Welcome to TLCO - The Future of Telecom Distribution 🚀',
        html: generateEmailTemplate(name),
        text: `Welcome to TLCO, ${name}! Thank you for joining our waitlist. You'll be among the first to experience the future of telecom distribution.`
      };

      await sgMail.send(msg);
      console.log('Confirmation email sent to:', email);
    } catch (emailError) {
      console.error('SendGrid error:', emailError);
      // Don't fail the request if email fails
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process request' 
    });
  }
});

const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  // Serve static files with caching
  app.use(express.static(join(__dirname, 'dist'), {
    maxAge: '1y',
    etag: true,
    lastModified: true
  }));

  // Handle all routes for SPA
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, 'dist', 'index.html'));
  });
} else {
  const viteDevServer = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  
  app.use(viteDevServer.middlewares);
  
  app.use('*', async (req, res, next) => {
    try {
      let template = await viteDevServer.transformIndexHtml(req.originalUrl, '');
      res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
    } catch (e) {
      next(e);
    }
  });
}

// Function to find an available port
const findAvailablePort = async (startPort) => {
  const net = await import('net');
  
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        server.close();
        resolve(findAvailablePort(startPort + 1));
      } else {
        reject(err);
      }
    });
    
    server.listen(startPort, () => {
      server.close();
      resolve(startPort);
    });
  });
};

// Start the server with automatic port selection
const startServer = async () => {
  try {
    const defaultPort = parseInt(process.env.PORT || '3001', 10);
    const port = await findAvailablePort(defaultPort);
    
    app.listen(port, () => {
      console.log(`Server running in ${isProd ? 'production' : 'development'} mode on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();