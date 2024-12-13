import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "final-38698.firebaseapp.com",
  projectId: "final-38698",
  storageBucket: "final-38698.firebasestorage.app",
  messagingSenderId: "146642283507",
  appId: "1:146642283507:web:c0e9f313a426a1d7ca0086",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const addToUserActivity = async (
  userAddress: string,
  postId: string,
  activityType: "like" | "share"
) => {
  try {
    await addDoc(collection(db, "userActivity"), {
      userAddress,
      postId,
      activityType,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error adding to user activity:", error);
  }
};

export const getUserActivity = async (userAddress: string) => {
  const q = query(
    collection(db, "userActivity"),
    where("userAddress", "==", userAddress)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
