import sgMail from '@sendgrid/mail';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Set SendGrid API key
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: 'subscriptions@tlco.ai',
      from: 'noreply@tlco.ai',
      subject: 'New Blog Subscription',
      text: `New blog subscription request from: ${email}`,
    };

    await sgMail.send(msg);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to process subscription' });
  }
}