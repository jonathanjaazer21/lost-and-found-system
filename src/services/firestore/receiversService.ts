import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/client';
import { Receiver } from '@/types';

export async function getAllReceivers(): Promise<string[]> {
  const receiversCollection = collection(db, 'receivers');
  const querySnapshot = await getDocs(receiversCollection);

  const allEmails: string[] = [];

  querySnapshot.docs.forEach(doc => {
    const receiver = doc.data() as Receiver;
    if (receiver.emails && Array.isArray(receiver.emails)) {
      allEmails.push(...receiver.emails);
    }
  });

  return [...new Set(allEmails)];
}
