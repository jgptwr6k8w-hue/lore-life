import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp
} from "firebase/firestore";

// Firebase config comes from VITE_FIREBASE_* env vars (.env locally, Netlify env vars in production).
// See .env.example. These values are public client identifiers, not secrets — access is
// controlled by firestore.rules.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

export const missingFirebaseKeys = Object.entries(firebaseConfig)
  .filter(([key, value]) => !value && key !== 'storageBucket' && key !== 'messagingSenderId')
  .map(([key]) => key);

if (missingFirebaseKeys.length) {
  console.error(
    `[lore] Missing Firebase config: ${missingFirebaseKeys.join(', ')}. ` +
    'Copy .env.example to .env and fill in your Firebase web app config.'
  );
}

// تهيئة Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Namespace for all app data in Firestore: artifacts/{appId}/...
export const appId = import.meta.env.VITE_LORE_APP_ID || 'lore-life-os-v1';

// ==========================================
// دوال إدارة الـ Likes والـ Comments (الجديدة)
// ==========================================

// 1. إضافة إعجاب (Like)
export const toggleLike = async (userId, postId) => {
  const likeId = `${userId}_${postId}`;
  const likeRef = doc(db, "likes", likeId);
  try {
    await setDoc(likeRef, {
      user: userId,
      post: postId,
      createdAt: serverTimestamp()
    });
    return true; // تم الإعجاب
  } catch (error) {
    console.error("Error toggling like: ", error);
  }
};

// 2. إضافة تعليق جديد (Add Comment)
export const addComment = async (userId, postId, content) => {
  try {
    const docRef = await addDoc(collection(db, "comments"), {
      content: content,
      user: userId,
      post: postId,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding comment: ", error);
    throw error;
  }
};

// 3. جلب تعليقات منشور معين
export const getPostComments = async (postId) => {
  try {
    const q = query(collection(db, "comments"), where("post", "==", postId));
    const querySnapshot = await getDocs(q);
    const comments = [];
    querySnapshot.forEach((doc) => {
      comments.push({ id: doc.id, ...doc.data() });
    });
    return comments;
  } catch (error) {
    console.error("Error getting comments: ", error);
    return [];
  }
};
