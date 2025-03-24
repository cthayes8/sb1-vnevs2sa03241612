import sgMail from '@sendgrid/mail';
import { generateEmailTemplate } from '../src/emailTemplate.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, company, phone } = req.body;

    if (!name || !email || !company) {
      return res.status(400).json({ error: 'Name, email, and company are required' });
    }

    // Set SendGrid API key
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to process subscription' });
  }
}