import {
  collection,
  addDoc,
  updateDoc,
  doc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/services/firebase/client';
import { getNotificationRecipients } from '@/services/email/notificationService';
import { sendLostItemEmail } from '@/services/email/emailService.server';
import { updateLostItemStatus } from '@/services/firestore/lostItemsService';

export async function createLostItemAction({ request }: { request: Request }) {
  const formData = await request.formData();
  const description = formData.get('description') as string;
  const mobile_number = formData.get('mobile_number') as string;
  const upload_url = formData.get('upload_url') as string;

  try {
    // Create the lost item in Firestore
    const itemData = {
      description,
      status: 'unclaimed' as const,
      mobile_number: mobile_number || null,
      upload_url: upload_url || null,
      created_at: Timestamp.now(),
    };

    await addDoc(collection(db, 'lost_items'), itemData);

    // Send email notifications server-side
    const recipients = await getNotificationRecipients();
    if (recipients.length > 0) {
      await sendLostItemEmail(recipients, description, upload_url || undefined);
    }

    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to create item',
    };
  }
}

export async function updateItemStatusAction({ request }: { request: Request }) {
  const formData = await request.formData();
  const itemId = formData.get('itemId') as string;
  const status = formData.get('status') as 'unclaimed' | 'claimed';

  try {
    await updateLostItemStatus(itemId, status);
    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to update status',
    };
  }
}
