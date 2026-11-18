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
  serverTimestamp,
  deleteDoc 
} from "firebase/firestore";

// ضعِ بيانات مشروعك في Firebase هنا
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// تهيئة Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// ==========================================
// دوال إدارة الـ Likes والـ Comments (الجديدة)
// ==========================================

// 1. إضافة أو إلغاء إعجاب (Toggle Like)
export const toggleLike = async (userId, postId) => {
  const likeId = `${userId}_${postId}`;
  const likeRef = doc(db, "likes", likeId);
  
  // تحقق هل الإعجاب موجود مسبقاً؟
  // يمكنك استخدام getDoc للتحقق أو جعله يضيف ويحذف مباشرة
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
