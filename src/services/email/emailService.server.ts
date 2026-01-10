import nodemailer from 'nodemailer';

const isDevelopment = process.env.NODE_ENV !== 'production';

// Create transporter based on environment
let transporter: nodemailer.Transporter;

if (isDevelopment) {
  // Development: Use Ethereal Email (fake SMTP for testing)
  // Emails are captured and viewable at https://ethereal.email/messages
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

  console.log('📧 Email service running in DEVELOPMENT mode');
  console.log('Test account created:', testAccount.user);
} else {
  // Production: Use real SMTP (Gmail)
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  console.log('📧 Email service running in PRODUCTION mode');
}

export async function sendLostItemEmail(
  recipients: string[],
  description: string,
  upload_url?: string
): Promise<void> {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('SMTP credentials not configured. Skipping email notification.');
    return;
  }

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>New Lost Item Reported</h2>
      <div style="margin: 20px 0;">
        <h3>Description:</h3>
        <p>${description}</p>
      </div>
      ${upload_url ? `
        <div style="margin: 20px 0;">
          <h3>Photo:</h3>
          <img src="${upload_url}" alt="Lost item" style="max-width: 100%; height: auto;" />
          <p><a href="${upload_url}">View full image</a></p>
        </div>
      ` : ''}
      <p style="color: #666; font-size: 12px; margin-top: 30px;">
        This is an automated notification from the Lost and Found System.
      </p>
    </div>
  `;

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: recipients.join(', '),
    subject: 'New Lost Item Reported',
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);

    if (isDevelopment) {
      // In development, show preview URL
      console.log('✅ Email sent successfully (development mode)');
      console.log('📬 Preview URL:', nodemailer.getTestMessageUrl(info));
      console.log('Recipients:', recipients.join(', '));
      console.log('Description:', description);
    } else {
      // In production, just log success
      console.log(`✅ Email sent successfully to ${recipients.length} recipient(s)`);
    }
  } catch (error) {
    console.error('❌ Error sending email:', error);
    // Don't throw - we don't want to block item creation if email fails
  }
}
