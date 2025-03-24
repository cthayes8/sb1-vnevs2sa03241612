import sgMail from '@sendgrid/mail';
import { createClient } from '@supabase/supabase-js';
import { generateEmailTemplate } from '../src/emailTemplate.js';

console.log("process.env.VITE_SUPABASE_URL line 5", process.env.VITE_SUPABASE_URL)
console.log("import.meta.env.VITE_SUPABASE_ANON_KEY", import.meta.env.VITE_SUPABASE_ANON_KEY)

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { name, email, company, phone } = JSON.parse(event.body);

    // Validate required fields
    if (!name || !email || !company) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Name, email, and company are required' })
      };
    }

    // Validate email format
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid email format' })
      };
    }

    // Check for existing email
    const { data: existingUser } = await supabase
      .from('waitlist')
      .select('email')
      .eq('email', email)
      .single();

    if (existingUser) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'This email is already on the waitlist' })
      };
    }

    // Insert into waitlist
    const { error: insertError } = await supabase
      .from('waitlist')
      .insert([{ name, email, company, phone }]);

    if (insertError) {
      console.error('Database error:', insertError);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to add to waitlist' })
      };
    }

    // Send confirmation email
    try {
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
    } catch (emailError) {
      console.error('SendGrid error:', emailError);
      // Don't fail the request if email fails
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    console.error('Server error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Failed to process request'
        "VITE_SUPABASE_URL1": process.env.VITE_SUPABASE_URL
      })
    };
  }
};