import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/client';
import { User } from '~/types';

export async function login(email: string, password: string): Promise<User> {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return await getUserProfile(userCredential.user.uid);
}

export async function register(email: string, password: string): Promise<User> {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);

  const now = Timestamp.now();
  const userData = {
    uid: userCredential.user.uid,
    email: email,
    role: 'user',
    createdAt: now,
  };

  await setDoc(doc(db, 'users', userCredential.user.uid), userData);

  return {
    uid: userCredential.user.uid,
    email: email,
    role: 'user',
    createdAt: now.toDate().toISOString(),
  };
}

export async function logout(): Promise<void> {
  await signOut(auth);
}

export async function getUserProfile(uid: string): Promise<User> {
  const userDoc = await getDoc(doc(db, 'users', uid));

  if (!userDoc.exists()) {
    throw new Error('User profile not found');
  }

  const data = userDoc.data();
  return {
    uid: data.uid,
    email: data.email,
    role: data.role,
    createdAt: data.createdAt?.toDate?.()
      ? data.createdAt.toDate().toISOString()
      : new Date().toISOString(),
  };
}

export function getCurrentUser(): FirebaseUser | null {
  return auth.currentUser;
}
