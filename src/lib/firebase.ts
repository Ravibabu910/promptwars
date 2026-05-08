import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Auth providers
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Auth functions
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const signInWithEmail = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);
export const registerWithEmail = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password);
export const logOut = () => signOut(auth);
export { onAuthStateChanged };

// Firestore helpers
export const createUserProfile = async (user: User) => {
  const userRef = doc(db, 'users', user.uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      createdAt: serverTimestamp(),
      tripsCount: 0,
      totalSpent: 0,
    });
  }
};

export const saveItinerary = async (userId: string, itinerary: Record<string, unknown>) => {
  const ref = doc(collection(db, 'itineraries'));
  await setDoc(ref, { ...itinerary, userId, createdAt: serverTimestamp() });
  return ref.id;
};

export const getUserItineraries = async (userId: string) => {
  const q = query(
    collection(db, 'itineraries'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(20)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const saveChatSession = async (userId: string, session: Record<string, unknown>) => {
  const ref = doc(collection(db, 'chatSessions'));
  await setDoc(ref, { ...session, userId, createdAt: serverTimestamp() });
  return ref.id;
};

export const saveExpense = async (expense: Record<string, unknown>) => {
  const ref = doc(collection(db, 'expenses'));
  await setDoc(ref, { ...expense, createdAt: serverTimestamp() });
  return ref.id;
};

export const getUserExpenses = async (userId: string, tripId?: string) => {
  const constraints = [where('userId', '==', userId)];
  if (tripId) constraints.push(where('tripId', '==', tripId));
  const q = query(collection(db, 'expenses'), ...constraints, orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export { Timestamp };
export type { User };
