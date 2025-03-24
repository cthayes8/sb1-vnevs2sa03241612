# TLCO Waitlist System

A Node.js application for managing TLCO's waitlist system with email notifications using SendGrid.

## Features

- Waitlist registration with email confirmation
- Beautiful, responsive email template
- Supabase database integration
- SendGrid email delivery
- Input validation and error handling
- Duplicate email prevention

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Environment variables are already configured in Bolt.new for:
   - SENDGRID_API_KEY
   - SUPABASE_URL
   - SUPABASE_SERVICE_KEY

3. Start the development server:
   ```bash
   npm run dev
   ```

## Testing the API

Use cURL or Postman to test the waitlist endpoint:

```bash
curl -X POST http://localhost:3001/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "company": "Example Corp",
    "phone": "123-456-7890"
  }'
```

Expected success response:
```json
{
  "success": true
}
```

## Error Handling

The API returns appropriate error messages for:
- Missing required fields
- Invalid email format
- Duplicate email addresses
- Server errors

## Production Deployment

Build and start the production server:
```bash
npm run build
npm start
```