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
  <title>Welcome to the TLCO Beta Program</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #ffffff;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.5;
      color: #1a1a1a;
    }
    
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid #e5e7eb;
    }
    
    .header {
      padding: 32px;
      text-align: center;
      background: linear-gradient(135deg, #f3f4f6 0%, #ffffff 100%);
    }
    
    .logo {
      margin-bottom: 24px;
      color: #6366f1;
      font-size: 24px;
    }
    
    .beta-badge {
      display: inline-block;
      padding: 8px 16px;
      background: rgba(99, 102, 241, 0.1);
      border-radius: 100px;
      color: #6366f1;
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 24px;
    }
    
    .content {
      padding: 32px;
      color: #374151;
    }
    
    .next-steps {
      background: #f9fafb;
      border-radius: 12px;
      padding: 24px;
      margin: 24px 0;
    }
    
    .step {
      display: flex;
      align-items: flex-start;
      margin-bottom: 16px;
      padding-left: 32px;
      position: relative;
    }
    
    .step-number {
      position: absolute;
      left: 0;
      width: 24px;
      height: 24px;
      background: #6366f1;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 600;
      margin-right: 12px;
    }
    
    .benefits {
      margin: 24px 0;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }
    
    .benefit {
      background: #f3f4f6;
      padding: 16px;
      border-radius: 8px;
      text-align: center;
    }
    
    .benefit-icon {
      font-size: 24px;
      margin-bottom: 8px;
      color: #6366f1;
    }
    
    .cta {
      text-align: center;
      margin: 32px 0;
    }
    
    .button {
      display: inline-block;
      padding: 12px 24px;
      background: #6366f1;
      color: white !important;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 500;
      transition: all 0.2s;
    }
    
    .button:hover {
      background: #4f46e5;
    }
    
    .timeline {
      margin: 32px 0;
      padding: 24px;
      background: #f9fafb;
      border-radius: 12px;
    }
    
    .timeline-item {
      display: flex;
      margin-bottom: 16px;
      padding-left: 24px;
      position: relative;
    }
    
    .timeline-item:before {
      content: "";
      position: absolute;
      left: 0;
      top: 8px;
      width: 8px;
      height: 8px;
      background: #6366f1;
      border-radius: 50%;
    }
    
    .footer {
      text-align: center;
      padding: 24px;
      color: #6b7280;
      font-size: 14px;
      border-top: 1px solid #e5e7eb;
    }
    
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; }
      .content { padding: 24px !important; }
      .header { padding: 24px !important; }
      .benefits { grid-template-columns: 1fr !important; }
      .button { width: 100% !important; }
    }
  </style>
</head>
<body style="background-color: #f3f4f6;">
  <div class="container">
    <div class="header">
      <div class="logo">⚡️</div>
      <div class="beta-badge">Beta Program</div>
      <h1 style="margin: 0 0 16px; color: #111827; font-size: 28px; line-height: 1.2;">
        Welcome to the Future, ${displayName}!
      </h1>
      <p style="margin: 0; color: #4b5563; font-size: 16px;">
        You're now part of an exclusive group of beta testers who will shape the future of telecom distribution.
      </p>
    </div>
    
    <div class="content">
      <div class="next-steps">
        <h2 style="margin: 0 0 16px; color: #111827; font-size: 18px;">What's Next?</h2>
        
        <div class="step">
          <div class="step-number">1</div>
          <div>
            <strong>Watch for Updates</strong>
            <p style="margin: 4px 0 0; color: #6b7280;">We'll send you exclusive updates about the beta launch timeline.</p>
          </div>
        </div>
        
        <div class="step">
          <div class="step-number">2</div>
          <div>
            <strong>Get Early Access</strong>
            <p style="margin: 4px 0 0; color: #6b7280;">You'll be among the first to access our platform when it's ready.</p>
          </div>
        </div>
        
        <div class="step">
          <div class="step-number">3</div>
          <div>
            <strong>Share Feedback</strong>
            <p style="margin: 4px 0 0; color: #6b7280;">Your input will help shape the future of our platform.</p>
          </div>
        </div>
      </div>

      <div class="timeline">
        <h2 style="margin: 0 0 16px; color: #111827; font-size: 18px;">Beta Program Timeline</h2>
        
        <div class="timeline-item">
          <div>
            <strong>Phase 1: Early Preview</strong>
            <p style="margin: 4px 0 0; color: #6b7280;">Get exclusive first looks at our platform features</p>
          </div>
        </div>
        
        <div class="timeline-item">
          <div>
            <strong>Phase 2: Beta Testing</strong>
            <p style="margin: 4px 0 0; color: #6b7280;">Hands-on access to test core functionality</p>
          </div>
        </div>
        
        <div class="timeline-item">
          <div>
            <strong>Phase 3: Launch</strong>
            <p style="margin: 4px 0 0; color: #6b7280;">Be first to use the full platform with special perks</p>
          </div>
        </div>
      </div>

      <div class="benefits">
        <div class="benefit">
          <div class="benefit-icon">🚀</div>
          <strong>Priority Access</strong>
          <p style="margin: 4px 0 0; color: #6b7280;">Skip the queue when we launch</p>
        </div>
        
        <div class="benefit">
          <div class="benefit-icon">💎</div>
          <strong>Special Pricing</strong>
          <p style="margin: 4px 0 0; color: #6b7280;">Exclusive beta tester rates</p>
        </div>
        
        <div class="benefit">
          <div class="benefit-icon">🎯</div>
          <strong>Direct Input</strong>
          <p style="margin: 4px 0 0; color: #6b7280;">Shape product features</p>
        </div>
        
        <div class="benefit">
          <div class="benefit-icon">🎓</div>
          <strong>Early Training</strong>
          <p style="margin: 4px 0 0; color: #6b7280;">Get a head start</p>
        </div>
      </div>

      <div class="cta">
        <a href="https://tlco.ai/beta" class="button">Visit Beta Portal</a>
      </div>
    </div>

    <div class="footer">
      <p style="margin: 0;">
        © ${currentYear} TLCO. All rights reserved.<br>
        <small style="color: #6b7280;">You're receiving this email because you joined our beta program.</small>
      </p>
    </div>
  </div>
</body>
</html>
`.trim();
};