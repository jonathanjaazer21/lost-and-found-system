import nodemailer from 'nodemailer';

// Gmail SMTP configuration
const SMTP_CONFIG = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'ikawwwraaa@gmail.com',
    pass: 'joyfbscaqdvpezyl', // Gmail App Password
  },
};

// Create reusable transporter
const transporter = nodemailer.createTransport(SMTP_CONFIG);

console.log('📧 Email service initialized with Gmail SMTP');

export async function sendLostItemEmail(
  recipients: string[],
  itemData: {
    description: string;
    mobile_number?: string | null;
    upload_url?: string | null;
    status: 'unclaimed' | 'claimed';
  },
  action: 'created' | 'updated'
): Promise<void> {
  if (recipients.length === 0) {
    console.log('No recipients configured. Skipping email notification.');
    return;
  }

  const actionText = action === 'created' ? 'New Lost Item Reported' : 'Lost Item Updated';
  const statusBadgeColor = itemData.status === 'unclaimed' ? '#f59e0b' : '#10b981';
  const statusText = itemData.status.charAt(0).toUpperCase() + itemData.status.slice(1);

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="margin: 0; color: #111827;">${actionText}</h2>
        <p style="color: #6b7280; margin: 5px 0 0 0; font-size: 14px;">
          A lost item has been ${action} in the system
        </p>
      </div>

      <!-- Item Card -->
      <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
          <h3 style="margin: 0; color: #111827; font-size: 18px;">${itemData.description}</h3>
          <span style="background-color: ${statusBadgeColor}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">
            ${statusText}
          </span>
        </div>

        ${itemData.upload_url ? `
          <div style="margin: 15px 0; background-color: #f3f4f6; border-radius: 8px; overflow: hidden;">
            <img src="${itemData.upload_url}" alt="Lost item" style="width: 100%; height: auto; display: block;" />
          </div>
        ` : `
          <div style="margin: 15px 0; background-color: #f3f4f6; border-radius: 8px; padding: 60px 20px; text-align: center;">
            <p style="color: #9ca3af; margin: 0; font-size: 14px;">No image</p>
          </div>
        `}

        <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0; font-size: 14px; color: #374151;">
            <strong>Contact:</strong> ${itemData.mobile_number || 'None'}
          </p>
        </div>
      </div>

      <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6;">
        <p style="margin: 0; font-size: 13px; color: #6b7280;">
          💡 <strong>Tip:</strong> Log in to your Lost & Found System dashboard to view all details and manage this item.
        </p>
      </div>

      <p style="color: #9ca3af; font-size: 12px; margin-top: 30px; text-align: center; border-top: 1px solid #e5e7eb; padding-top: 20px;">
        This is an automated notification from the Lost and Found System.<br>
        Sent on ${new Date().toLocaleString()}
      </p>
    </div>
  `;

  const mailOptions = {
    from: SMTP_CONFIG.auth.user,
    to: recipients.join(', '),
    subject: `[Lost & Found] ${actionText}`,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to ${recipients.length} recipient(s) - Item ${action}`);
    console.log('Recipients:', recipients.join(', '));
  } catch (error) {
    console.error('❌ Error sending email:', error);
    // Don't throw - we don't want to block item creation if email fails
  }
}
