const sgMail = require('@sendgrid/mail');
const { createClient } = require('@supabase/supabase-js');
const { generateEmailTemplate } = require('../../src/emailTemplate.js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
  
// Initialize Supabase client with explicit environment variables
const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

exports.handler = async (event) => {
  // Get cookie from request headers
  const cookie = event.headers["Cookie"] || event.headers["cookie"];

  // Base headers without cookie
  const headersWithoutCookie = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${SENDGRID_API_KEY}`
  };

  // Full headers with cookie
  const headers = {
    ...headersWithoutCookie,
    cookie: cookie || ''
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Validate Supabase configuration
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.error('Missing Supabase configuration');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Server configuration error' })
      };
    }

    // Validate SendGrid configuration
    if (!SENDGRID_API_KEY) {
      console.error('Missing SendGrid API key');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Email service not configured' })
      };
    }

    let data;
    try {
      data = JSON.parse(event.body);
    } catch (e) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid request body' })
      };
    }

    const { name, email, company, phone } = data;

    // Validate required fields
    if (!name || !email || !company) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Name, email, and company are required' })
      };
    }

    // Validate email format
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid email format' })
      };
    }

    console.log('Attempting to insert into waitlist:', { name, email, company, phone });

    // Insert into waitlist
    const { error: insertError } = await supabase
      .from('waitlist')
      .insert([{ name, email, company, phone }]);

    if (insertError) {
      console.error('Database error:', insertError);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: insertError.message.includes('duplicate') 
            ? 'This email is already on the waitlist'
            : 'Failed to save to database'
        })
      };
    }

    // Send confirmation email
    try {
      // Initialize SendGrid with proper headers
      sgMail.setApiKey(SENDGRID_API_KEY);
      const msg = {
        to: email,
        from: {
          email: 'noreply@tlco.ai',
          name: 'TLCO AI'
        },
        subject: 'Welcome to the TLCO Beta Program',
        text: `Welcome to the future, ${name}! You're now part of an exclusive group of beta testers who will shape the future of telecom distribution. We'll keep you updated on the beta launch timeline and your early access details.`,
        html: generateEmailTemplate(name)
      };

      // Send email with proper headers
      await sgMail.send(msg);
      console.log('Confirmation email sent successfully to:', email);
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      // Return success but log the email error
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true,
          warning: 'Entry saved but confirmation email could not be sent'
        })
      };
    }

    // Everything succeeded
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    console.error('Server error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};