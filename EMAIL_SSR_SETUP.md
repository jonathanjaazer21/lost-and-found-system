# Email Notifications with SSR (Nodemailer + Gmail)

## Overview

The Lost & Found System now uses **Server-Side Rendering (SSR)** with **Nodemailer** to send email notifications via Gmail SMTP when items are created or updated.

## How It Works

```
User Action → Client (Firebase) → API Route → Email Service (Server) → Gmail SMTP → Receivers
```

### Flow:
1. **User creates/edits item** on the dashboard
2. **Firebase stores the data** (client-side)
3. **Client sends notification request** to API route (`/api/notify-create` or `/api/notify-update`)
4. **Server-side API route** receives request and calls email service
5. **Nodemailer sends email** via Gmail SMTP
6. **Receivers get email** with item details

## Architecture

### Client-Side (Browser)
- Firebase Authentication & Firestore operations
- Dashboard UI and form handling
- Fetches server API routes for email notifications

### Server-Side (SSR)
- Nodemailer email service
- Gmail SMTP configuration
- API routes handling notification requests

## Files Structure

```
app/
├── routes/
│   ├── app.dashboard.tsx           # Client-side dashboard with email triggers
│   ├── api.notify-create.tsx       # Server API for create notifications
│   └── api.notify-update.tsx       # Server API for update notifications
├── actions/
│   └── lostItems.server.ts         # Server actions for email logic
└── services/
    └── email/
        └── emailService.server.ts  # Nodemailer email service
```

## Configuration

### Gmail SMTP Settings

The email service is configured in `app/services/email/emailService.server.ts`:

```typescript
const SMTP_CONFIG = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'ikawwwraaa@gmail.com',
    pass: 'joyfbscaqdvpezyl', // Gmail App Password
  },
};
```

### Gmail App Password Setup

1. Go to your Google Account: https://myaccount.google.com
2. Navigate to **Security**
3. Enable **2-Step Verification** (required)
4. Go to **App Passwords**: https://myaccount.google.com/apppasswords
5. Create a new App Password for "Mail"
6. Use the generated 16-character password in the configuration

## Email Template

Emails include:
- **Header**: "New Lost Item Reported" or "Lost Item Updated"
- **Item Card**:
  - Description
  - Status badge (Unclaimed/Claimed)
  - Image (if uploaded)
  - Contact number
- **Footer**: Timestamp and system info

## API Routes

### POST /api/notify-create
Sends email when a new item is created.

**Request Body:**
```json
{
  "description": "Blue backpack",
  "mobile_number": "09123456789",
  "upload_url": "https://...",
  "status": "unclaimed",
  "recipients": ["receiver1@example.com", "receiver2@example.com"]
}
```

### POST /api/notify-update
Sends email when an item is updated.

**Request Body:**
```json
{
  "description": "Updated description",
  "mobile_number": "09123456789",
  "upload_url": "https://...",
  "status": "unclaimed",
  "recipients": ["receiver1@example.com"]
}
```

## Testing

### 1. Start Development Server

```bash
npm run dev
```

### 2. Add Receiver Email

1. Go to dashboard
2. Scroll to "Email Receivers" section
3. Add your test email
4. Click "Add"

### 3. Test Create Notification

1. Click "Report Lost Item"
2. Fill in the form
3. Click "Submit"
4. **Check your email inbox** (may take a few seconds)

### 4. Test Update Notification

1. Click "Edit" on an existing item
2. Modify the description or contact
3. Click "Save"
4. **Check your email inbox**

## Monitoring

### Server Console Logs

Watch the development server console for:

```
✅ Email sent successfully to 2 recipient(s) - Item created
Recipients: test1@example.com, test2@example.com
```

Or errors:
```
❌ Error sending email: [error details]
```

### Browser Console

The client will log if the API call fails:
```
Failed to send email notification: [error]
```

## Troubleshooting

### Emails Not Sending

**Check 1: SMTP Credentials**
- Verify Gmail address is correct
- Ensure App Password is valid (not regular password)
- Confirm 2-Step Verification is enabled

**Check 2: Server Running**
- Make sure dev server is running with SSR enabled
- Check `react-router.config.ts` has `ssr: true`

**Check 3: Receivers Configured**
- At least one email must be added in the Receivers section
- Check browser console for "No recipients configured"

### Gmail Authentication Failed

1. Generate a new App Password
2. Update `app/services/email/emailService.server.ts`:
   ```typescript
   pass: 'your_new_app_password'
   ```
3. Restart the dev server

### Emails Going to Spam

- Check your Gmail's Sent folder to confirm emails are sending
- Add the sender email (ikawwwraaa@gmail.com) to recipient's contacts
- Check email content isn't flagged by spam filters

## Production Deployment

### Environment Variables (Optional)

For better security in production, you can use environment variables:

1. Create `.env` file:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=ikawwwraaa@gmail.com
   SMTP_PASS=joyfbscaqdvpezyl
   ```

2. Update `emailService.server.ts` to use env vars:
   ```typescript
   const SMTP_CONFIG = {
     host: process.env.SMTP_HOST || 'smtp.gmail.com',
     port: parseInt(process.env.SMTP_PORT || '587'),
     secure: false,
     auth: {
       user: process.env.SMTP_USER,
       pass: process.env.SMTP_PASS,
     },
   };
   ```

3. Add to `.gitignore`:
   ```
   .env
   ```

## Key Differences from Firebase Functions

| Feature | Firebase Functions | SSR Nodemailer |
|---------|-------------------|----------------|
| **Hosting** | Cloud Functions | Your SSR server |
| **Triggers** | Firestore triggers | API routes |
| **Cost** | Pay per invocation | Included in server |
| **Setup** | Separate deployment | Part of app build |
| **Config** | Firebase CLI | Code or .env file |

## Benefits

✅ **Integrated** - Email logic in the same codebase
✅ **Simple** - No separate function deployment
✅ **Fast** - Direct API calls, no external triggers
✅ **Flexible** - Easy to modify and test
✅ **Secure** - Server-side only (credentials never exposed to client)

## Summary

Your Lost & Found System now sends beautiful email notifications automatically when items are created or updated using:
- **SSR** for server-side email processing
- **Nodemailer** for SMTP email sending
- **Gmail** as the email provider
- **API Routes** for client-server communication

The system is ready to use! 🎉
