# Email Notifications Setup Guide

## How It Works

```
Create/Edit Item → Firestore → Cloud Function Trigger → Send Email to Receivers
```

Email notifications are automatically sent when:
- ✅ A new lost item is created
- ✅ An existing item is updated (description, contact, or image changes)
- ❌ Status changes (unclaimed/claimed) do NOT trigger emails

## Prerequisites

1. Firebase project (already configured)
2. Gmail account with App Password
3. Firebase CLI installed

## Setup Steps

### 1. Install Firebase CLI (if not installed)

```bash
npm install -g firebase-tools
```

### 2. Login to Firebase

```bash
firebase login
```

### 3. Install Cloud Functions Dependencies

```bash
cd functions
npm install
cd ..
```

### 4. Configure SMTP Environment

Set your Gmail SMTP credentials:

```bash
firebase functions:config:set smtp.host="smtp.gmail.com"
firebase functions:config:set smtp.port="587"
firebase functions:config:set smtp.secure="false"
firebase functions:config:set smtp.user="ikawwwraaa@gmail.com"
firebase functions:config:set smtp.pass="joyfbscaqdvpezyl"
```

**Important:**
- Use your Gmail App Password (not regular password)
- Enable 2FA on Gmail first
- Generate App Password at: https://myaccount.google.com/apppasswords

### 5. Deploy Cloud Functions

```bash
firebase deploy --only functions
```

This deploys two functions:
- `onLostItemCreated` - Sends email when new item is created
- `onLostItemUpdated` - Sends email when item is edited

### 6. Verify Deployment

After deployment, you should see:

```
✔  functions[onLostItemCreated(us-central1)] Successful create operation.
✔  functions[onLostItemUpdated(us-central1)] Successful create operation.
```

## Testing

### 1. Add Receiver Email

1. Go to your dashboard
2. Scroll to "Email Receivers" section
3. Add your email address
4. Click "Add"

### 2. Test Create Notification

1. Click "Report Lost Item"
2. Fill in the form
3. Click "Submit"
4. Check your email inbox

### 3. Test Update Notification

1. Click "Edit" on an existing item
2. Change the description
3. Click "Save"
4. Check your email inbox

## Email Template

Emails include:
- **Header** - Action type (New/Updated)
- **Item Card**:
  - Description
  - Status badge (Unclaimed/Claimed)
  - Image (if provided)
  - Contact number
- **Professional styling** matching your dashboard

## Monitoring

### View Function Logs

```bash
firebase functions:log
```

### View in Firebase Console

https://console.firebase.google.com/project/lost-and-found-system-e0e39/functions

Look for:
- `✅ Email sent successfully` - Success
- `❌ Error sending email` - Failed

### Check Function Execution

Firebase Console → Functions → Click on function name → See execution logs

## Troubleshooting

### Emails not being sent

**Check function logs:**
```bash
firebase functions:log --only onLostItemCreated
```

**Common issues:**
1. SMTP credentials not set correctly
2. Gmail App Password expired
3. No receivers configured in dashboard
4. Function deployment failed

**Solutions:**
```bash
# Re-set SMTP config
firebase functions:config:set smtp.user="your_email@gmail.com"
firebase functions:config:set smtp.pass="your_app_password"

# Redeploy functions
firebase deploy --only functions
```

### Function errors

**View errors:**
```bash
firebase functions:log
```

**Check deployment:**
```bash
firebase functions:list
```

**Redeploy if needed:**
```bash
cd functions
npm run build
cd ..
firebase deploy --only functions
```

### Gmail authentication failed

1. Verify App Password is correct
2. Make sure 2FA is enabled on Gmail
3. Generate new App Password
4. Update config:
   ```bash
   firebase functions:config:set smtp.pass="new_app_password"
   firebase deploy --only functions
   ```

## Cost

Firebase Cloud Functions free tier includes:
- **2,000,000 invocations/month**
- **400,000 GB-seconds/month**
- **200,000 CPU-seconds/month**

For typical usage (< 100 items/day):
- **Estimated cost: $0/month** (within free tier)

## Development vs Production

### Development
- Emails use Ethereal Email (test SMTP)
- Preview URLs in function logs
- No real emails sent
- Set: `NODE_ENV=development`

### Production
- Real emails via Gmail
- Actual delivery to recipients
- No preview URLs
- Set: `NODE_ENV=production`

## Quick Commands Reference

```bash
# Deploy functions
firebase deploy --only functions

# View logs
firebase functions:log

# List functions
firebase functions:list

# Set SMTP config
firebase functions:config:set smtp.user="email" smtp.pass="password"

# View current config
firebase functions:config:get

# Delete function (if needed)
firebase functions:delete onLostItemCreated
firebase functions:delete onLostItemUpdated
```

## Summary

✅ **Automatic** - Triggers on Firestore changes
✅ **Secure** - SMTP credentials in Cloud Functions only
✅ **Reliable** - Runs independently of your app
✅ **Beautiful** - Professional email template
✅ **Free** - Within Firebase free tier

---

## Next Steps

1. **Deploy functions**: `firebase deploy --only functions`
2. **Add receivers**: Add email addresses in dashboard
3. **Test**: Create/edit an item and check email
4. **Monitor**: Check Firebase Console for logs

**Your email notifications are ready!** 🎉
