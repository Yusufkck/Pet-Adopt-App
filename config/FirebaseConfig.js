import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// getFirestore yerine initializeFirestore'u da ekle
import { getFirestore, initializeFirestore } from "firebase/firestore";

// Config ayarların aynen kalsın
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: "pet-adopt-9b5ac.firebaseapp.com",
  projectId: "pet-adopt-9b5ac",
  storageBucket: "pet-adopt-9b5ac.appspot.com",
  messagingSenderId: "693787199364",
  appId: "1:693787199364:web:0faa8c998aedffd158bfd1",
  measurementId: "G-HRBW71VPXK"
};
console.log("API Key Kontrol:", process.env.EXPO_PUBLIC_FIREBASE_API_KEY);

// Firebase'i başlat
const app = initializeApp(firebaseConfig);

// BURASI ÇOK ÖNEMLİ:
// Standart getFirestore(app) yerine bunu kullan:
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true, // Android'deki bağlantı sorununu çözen sihirli değnek bu
});

export const storage = getStorage(app);




