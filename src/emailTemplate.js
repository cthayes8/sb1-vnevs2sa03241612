import { format } from 'date-fns';

export const generateEmailTemplate = (name) => {
  const currentYear = format(new Date(), 'yyyy');
  const displayName = name.split(' ')[0] || 'Pioneer';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to TLCO - The Future of Telecom</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #1a1a40;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.5;
      color: #ffffff;
    }
    
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: #1E1B4B;
      border-radius: 16px;
      overflow: hidden;
    }
    
    .header {
      padding: 32px;
      text-align: center;
      background: linear-gradient(180deg, #1E1B4B 0%, #2D2A5E 100%);
    }
    
    .logo {
      margin-bottom: 24px;
      color: #8A4FFF;
      font-size: 24px;
    }
    
    .launch-badge {
      display: inline-block;
      padding: 8px 16px;
      background: rgba(138, 79, 255, 0.1);
      border-radius: 100px;
      color: #8A4FFF;
      font-size: 14px;
      margin-bottom: 24px;
    }
    
    .content {
      padding: 32px;
      color: #E2E8F0;
    }
    
    .features {
      background: rgba(138, 79, 255, 0.05);
      border-radius: 12px;
      padding: 24px;
      margin: 24px 0;
    }
    
    .feature {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
      color: #E2E8F0;
    }
    
    .feature-icon {
      width: 24px;
      height: 24px;
      margin-right: 12px;
      color: #8A4FFF;
    }
    
    .benefits {
      margin: 24px 0;
    }
    
    .benefit {
      margin-bottom: 8px;
      padding-left: 24px;
      position: relative;
    }
    
    .benefit:before {
      content: "•";
      position: absolute;
      left: 8px;
      color: #8A4FFF;
    }
    
    .cta {
      text-align: center;
      margin: 32px 0;
    }
    
    .button {
      display: inline-block;
      padding: 12px 24px;
      background: #8A4FFF;
      color: white !important;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 500;
    }
    
    .investor-section {
      text-align: center;
      padding: 24px;
      border-top: 1px solid rgba(138, 79, 255, 0.1);
    }
    
    .investor-link {
      color: #8A4FFF;
      text-decoration: none;
    }
    
    .investor-link:hover {
      text-decoration: underline;
    }
    
    .footer {
      text-align: center;
      padding: 24px;
      color: #64748B;
      font-size: 14px;
    }
    
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; }
      .content { padding: 24px !important; }
      .header { padding: 24px !important; }
      .features { padding: 16px !important; }
      .button { width: 100% !important; }
    }
  </style>
</head>
<body style="background-color: #1a1a40;">
  <div class="container">
    <div class="header">
      <div class="logo">⚡️</div>
      <div class="launch-badge">Launching 2025</div>
      <h1 style="margin: 0 0 16px; color: #ffffff; font-size: 28px; line-height: 1.2;">
        Welcome to TLCO, ${displayName}! 🚀
      </h1>
      <p style="margin: 0; color: #94A3B8; font-size: 16px;">
        Thank you for joining our waitlist.<br>
        You're now part of an exclusive group that will be first to experience the future of telecom distribution.
      </p>
    </div>
    
    <div class="content">
      <div class="features">
        <div class="feature">
          <span class="feature-icon">⚡️</span>
          <span>Get instant quotes in seconds, not days</span>
        </div>
        <div class="feature">
          <span class="feature-icon">💬</span>
          <span>24/7 AI-powered support at your fingertips</span>
        </div>
        <div class="feature">
          <span class="feature-icon">💰</span>
          <span>Maximize commissions with TLCO GPT</span>
        </div>
        <div class="feature">
          <span class="feature-icon">📊</span>
          <span>Real-time closing AI analytics</span>
        </div>
      </div>

      <p style="color: #94A3B8;">
        We're working hard to revolutionize telecom distribution with AI. As a waitlist member, you'll be the first to:
      </p>

      <div class="benefits">
        <div class="benefit">Access our beta platform</div>
        <div class="benefit">Receive exclusive launch offers</div>
        <div class="benefit">Get priority onboarding support</div>
      </div>

      <div class="cta">
        <h2 style="margin: 0 0 16px; color: #ffffff; font-size: 20px;">Stay Connected</h2>
        <a href="https://tlco.ai" class="button" style="color: #ffffff; text-decoration: none;">Visit Our Website</a>
      </div>
    </div>

    <div class="investor-section">
      <h3 style="margin: 0 0 8px; color: #ffffff; font-size: 16px;">Interested in Investing?</h3>
      <p style="margin: 0; color: #94A3B8; font-size: 14px;">
        For investor inquiries, please contact us at 
        <a href="mailto:invest@tlco.ai" class="investor-link">invest@tlco.ai</a>
      </p>
    </div>

    <div class="footer">
      <p style="margin: 0;">
        © ${currentYear} TLCO. All rights reserved.<br>
        <small style="color: #475569;">You're receiving this email because you joined our waitlist.</small>
      </p>
    </div>
  </div>
</body>
</html>
`.trim();
};