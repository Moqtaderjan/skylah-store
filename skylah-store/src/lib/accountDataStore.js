import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from './firebase';

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

export function getDefaultAccountData(user) {
  return {
    profile: {
      displayName: user?.name || '',
      email: user?.email || '',
      phone: '',
      photoURL: user?.photoURL || '',
    },
    paymentMethods: [],
    orderHistory: [],
    activityHistory: [],
  };
}

function normalizeAccountData(raw, user) {
  const defaults = getDefaultAccountData(user);

  return {
    profile: {
      ...defaults.profile,
      ...(raw?.profile || {}),
    },
    paymentMethods: safeArray(raw?.paymentMethods),
    orderHistory: safeArray(raw?.orderHistory),
    activityHistory: safeArray(raw?.activityHistory),
  };
}

function getAccountDocRef(uid) {
  return doc(db, 'users', uid, 'private', 'account');
}

export async function loadAccountData(uid, user) {
  if (!db || !uid) return null;

  try {
    const snapshot = await getDoc(getAccountDocRef(uid));
    if (!snapshot.exists()) return null;
    return normalizeAccountData(snapshot.data(), user);
  } catch {
    return null;
  }
}

export async function saveAccountData(uid, payload) {
  if (!db || !uid) return false;

  try {
    await setDoc(
      getAccountDocRef(uid),
      {
        ...payload,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    return true;
  } catch {
    return false;
  }
}
