const { OpenAI } = require('openai');

exports.handler = async (event) => {
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
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
    // Verify API key exists
    if (!process.env.OPENAI_API_KEY) {
      console.log('OpenAI API key is missing');
      throw new Error('Missing OpenAI API key');
    }

    console.log('OpenAI API key is present');
    const { message } = JSON.parse(event.body);
    console.log('Received message:', message);

    // Initialize OpenAI with shorter timeout
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      timeout: 20000, // 20 second timeout
      maxRetries: 1
    });

    console.log('Making request to OpenAI API...');
    const startTime = Date.now();

    const response = await openai.chat.completions.create({
      model: 'gpt-4-0125-preview',
      messages: [
        {
          role: 'system',
          content: 'You are TLCO AI, an expert in telecom services and distribution. You help agents with quotes, technical support, and service information for providers like AT&T, Verizon, Spectrum, Cox, and Lumen. Keep responses concise and focused on telecom services.'
        },
        {
          role: 'user',
          content: message
        }
      ],
      max_tokens: 300, // Reduced token limit for faster responses
      temperature: 0.7,
      presence_penalty: 0.6, // Encourage focused responses
      frequency_penalty: 0.3, // Reduce repetition
    });

    const endTime = Date.now();
    console.log(`OpenAI request completed in ${endTime - startTime}ms`);

    const normalizedContent = Buffer.from(response.choices[0].message.content, 'utf-8')
      .toString('utf-8')
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/�/g, "'");

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ content: normalizedContent })
    };
  } catch (error) {
    console.error('OpenAI Error:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);

    // Handle specific error types
    if (error.name === 'AbortError' || error.code === 'ETIMEDOUT' || error.message.includes('timeout')) {
      return {
        statusCode: 504,
        headers,
        body: JSON.stringify({ 
          error: 'Request timed out',
          message: 'The request took too long to process. Please try a shorter message or try again.'
        })
      };
    }

    // Check for API key related errors
    if (error.message.includes('API key')) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ 
          error: 'API Key Error',
          message: 'There was a problem with the API key. Please check the configuration.'
        })
      };
    }

    return {
      statusCode: error.status || 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to get response from OpenAI',
        message: error.message,
        type: error.name
      })
    };
  }
};