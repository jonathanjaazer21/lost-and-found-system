import { getAllReceivers } from '../firestore/receiversService';

/**
 * Send email notifications to all receivers
 * This function fetches receivers and prepares notification data
 * The actual email sending happens server-side in the action handler
 */
export async function getNotificationRecipients(): Promise<string[]> {
  try {
    const receivers = await getAllReceivers();

    if (receivers.length === 0) {
      console.warn('No receivers found for notifications');
      return [];
    }

    return receivers;
  } catch (error) {
    console.error('Error fetching receivers:', error);
    return [];
  }
}
