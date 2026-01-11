import { collection, getDocs, doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase/client';
import { Receiver } from '~/types';

const RECEIVER_DOC_ID = 'default';

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

export async function addReceiverEmail(email: string): Promise<void> {
  const receiverDocRef = doc(db, 'receivers', RECEIVER_DOC_ID);
  const receiverDoc = await getDoc(receiverDocRef);

  if (receiverDoc.exists()) {
    await updateDoc(receiverDocRef, {
      emails: arrayUnion(email)
    });
  } else {
    await setDoc(receiverDocRef, {
      id: RECEIVER_DOC_ID,
      emails: [email]
    });
  }
}

export async function removeReceiverEmail(email: string): Promise<void> {
  const receiverDocRef = doc(db, 'receivers', RECEIVER_DOC_ID);
  await updateDoc(receiverDocRef, {
    emails: arrayRemove(email)
  });
}
