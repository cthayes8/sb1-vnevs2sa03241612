const sgMail = require('@sendgrid/mail');
const { createClient } = require('@supabase/supabase-js');
const { generateEmailTemplate } = require('../../src/emailTemplate.js');

// Initialize Supabase client
const supabase = createClient(
  'https://bcolbzrvrvkpacznstru.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { subscriberName, subscriberEmail, company, phone } = JSON.parse(event.body);

    // Validate required fields
    if (!subscriberName || !subscriberEmail || !company) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Name, email, and company are required' })
      };
    }

    // Insert into waitlist
    const { error: insertError } = await supabase
      .from('waitlist')
      .insert([{
        name: subscriberName,
        email: subscriberEmail,
        company,
        phone
      }]);

    if (insertError) {
      console.error('Database error:', insertError);
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: insertError.message.includes('duplicate') 
            ? 'This email is already on the waitlist'
            : 'Failed to save to database'
        })
      };
    }

    // Send confirmation email
    if (process.env.SENDGRID_API_KEY) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      await sgMail.send({
        to: subscriberEmail,
        from: {
          email: 'noreply@tlco.ai',
          name: 'TLCO AI'
        },
        subject: 'Welcome to TLCO - The Future of Telecom Distribution 🚀',
        text: `Welcome to TLCO, ${subscriberName}! Thank you for joining our waitlist.`,
        html: generateEmailTemplate(subscriberName)
      });
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    console.error('Server error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};