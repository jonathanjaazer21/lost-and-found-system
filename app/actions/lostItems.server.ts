import { sendLostItemEmail } from '~/services/email/emailService.server';

export interface CreateItemData {
  description: string;
  mobile_number?: string;
  upload_url?: string;
  status: 'unclaimed' | 'claimed';
  recipients: string[];
}

export interface UpdateItemData {
  description: string;
  mobile_number?: string;
  upload_url?: string;
  status: 'unclaimed' | 'claimed';
  recipients: string[];
}

export async function sendCreateNotification(data: CreateItemData) {
  try {
    await sendLostItemEmail(
      data.recipients,
      {
        description: data.description,
        mobile_number: data.mobile_number || null,
        upload_url: data.upload_url || null,
        status: data.status,
      },
      'created'
    );
  } catch (error) {
    console.error('Failed to send create notification:', error);
  }
}

export async function sendUpdateNotification(data: UpdateItemData) {
  try {
    await sendLostItemEmail(
      data.recipients,
      {
        description: data.description,
        mobile_number: data.mobile_number || null,
        upload_url: data.upload_url || null,
        status: data.status,
      },
      'updated'
    );
  } catch (error) {
    console.error('Failed to send update notification:', error);
  }
}
