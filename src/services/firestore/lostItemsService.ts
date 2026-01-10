import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  getDoc,
} from 'firebase/firestore';
import { db } from '../firebase/client';
import { LostItem } from '@/types';

export async function createLostItem(
  description: string,
  mobile_number?: string,
  upload_url?: string
): Promise<string> {
  const itemData = {
    description,
    status: 'unclaimed' as const,
    mobile_number: mobile_number || null,
    upload_url: upload_url || null,
    created_at: Timestamp.now(),
  };

  const docRef = await addDoc(collection(db, 'lost_items'), itemData);

  return docRef.id;
}

export async function getLostItems(statusFilter?: 'unclaimed' | 'claimed'): Promise<LostItem[]> {
  const itemsCollection = collection(db, 'lost_items');

  let q = query(itemsCollection, orderBy('created_at', 'desc'));

  if (statusFilter) {
    q = query(itemsCollection, where('status', '==', statusFilter), orderBy('created_at', 'desc'));
  }

  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as LostItem));
}

export async function updateLostItemStatus(
  itemId: string,
  status: 'unclaimed' | 'claimed'
): Promise<void> {
  const itemRef = doc(db, 'lost_items', itemId);
  await updateDoc(itemRef, { status });
}

export async function updateLostItem(
  itemId: string,
  data: {
    description: string;
    mobile_number?: string;
    upload_url?: string;
  }
): Promise<void> {
  const itemRef = doc(db, 'lost_items', itemId);
  await updateDoc(itemRef, {
    description: data.description,
    mobile_number: data.mobile_number || null,
    upload_url: data.upload_url || null,
  });
}

export async function getLostItemById(itemId: string): Promise<LostItem | null> {
  const itemRef = doc(db, 'lost_items', itemId);
  const itemDoc = await getDoc(itemRef);

  if (!itemDoc.exists()) {
    return null;
  }

  return {
    id: itemDoc.id,
    ...itemDoc.data(),
  } as LostItem;
}
