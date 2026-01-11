import nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const isDevelopment = process.env.NODE_ENV !== 'production';

async function testSMTP() {
  console.log('='.repeat(60));
  console.log('SMTP Configuration Test');
  console.log('='.repeat(60));
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('');

  let transporter: nodemailer.Transporter;

  if (isDevelopment) {
    console.log('📧 Testing with Ethereal Email (Development Mode)');
    console.log('Note: Emails will NOT be sent to real addresses');
    console.log('');

    const testAccount = await nodemailer.createTestAccount();

    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    console.log('✅ Ethereal test account created');
    console.log(`   User: ${testAccount.user}`);
    console.log('');
  } else {
    console.log('📧 Testing with Production SMTP (Gmail)');
    console.log('');

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error('❌ ERROR: SMTP credentials not configured');
      console.log('Please set SMTP_USER and SMTP_PASS in your .env file');
      process.exit(1);
    }

    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    console.log('SMTP Configuration:');
    console.log(`   Host: ${process.env.SMTP_HOST || 'smtp.gmail.com'}`);
    console.log(`   Port: ${process.env.SMTP_PORT || '587'}`);
    console.log(`   User: ${process.env.SMTP_USER}`);
    console.log(`   Secure: ${process.env.SMTP_SECURE === 'true'}`);
    console.log('');
  }

  // Verify SMTP connection
  console.log('🔍 Verifying SMTP connection...');
  try {
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully!');
    console.log('');
  } catch (error) {
    console.error('❌ SMTP connection failed!');
    console.error('Error:', error);
    console.log('');
    console.log('Common issues:');
    console.log('- For Gmail: Make sure you are using an App Password, not your account password');
    console.log('- Check that 2-factor authentication is enabled on your Gmail account');
    console.log('- Verify your SMTP credentials are correct');
    console.log('');
    process.exit(1);
  }

  // Send test email
  console.log('📤 Sending test email...');

  const testRecipient = process.env.SMTP_USER || 'test@example.com';

  const mailOptions = {
    from: process.env.SMTP_USER || 'noreply@test.com',
    to: testRecipient,
    subject: 'Test Email - Lost & Found System',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Test Email - SMTP Configuration</h2>
        <p>This is a test email to verify your SMTP configuration is working correctly.</p>
        <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3>Configuration Details:</h3>
          <ul>
            <li><strong>Environment:</strong> ${process.env.NODE_ENV || 'development'}</li>
            <li><strong>Host:</strong> ${isDevelopment ? 'smtp.ethereal.email' : process.env.SMTP_HOST}</li>
            <li><strong>Port:</strong> ${isDevelopment ? '587' : process.env.SMTP_PORT}</li>
            <li><strong>From:</strong> ${process.env.SMTP_USER || 'test@example.com'}</li>
          </ul>
        </div>
        <p>If you received this email, your SMTP configuration is working correctly!</p>
        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          Sent at: ${new Date().toLocaleString()}
        </p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);

    console.log('✅ Test email sent successfully!');
    console.log('');
    console.log('Email Details:');
    console.log(`   Message ID: ${info.messageId}`);
    console.log(`   To: ${testRecipient}`);

    if (isDevelopment) {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log('');
      console.log('📬 Preview your test email here:');
      console.log(`   ${previewUrl}`);
      console.log('');
      console.log('Note: In development mode, emails are NOT sent to real addresses.');
      console.log('      They are captured by Ethereal Email for testing purposes.');
    }

    console.log('');
    console.log('='.repeat(60));
    console.log('✅ SMTP Test Completed Successfully!');
    console.log('='.repeat(60));
  } catch (error) {
    console.error('❌ Failed to send test email!');
    console.error('Error:', error);
    console.log('');
    process.exit(1);
  }
}

// Run the test
testSMTP().catch(console.error);
