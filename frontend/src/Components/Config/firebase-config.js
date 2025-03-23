import { getApp, getApps, initializeApp } from "firebase/app";
import { getMessaging, getToken, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAyHANp-_J-zBPuOm64IcU4-9nPDxXgR6U",
  authDomain: "studio-infinito.firebaseapp.com",
  projectId: "studio-infinito",
  storageBucket: "studio-infinito.appspot.com", // ❌ Incorrect domain fixed
  messagingSenderId: "154747994302",
  appId: "1:154747994302:web:ddf1a3ee42a2c2d3c85eef",
  measurementId: "G-QZH38YBY8B"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const messaging = async () => {
  const supported = await isSupported();
  return supported ? getMessaging(app) : null;
};

export const fetchToken = async () => {
  try {
    const fcmMessaging = await messaging();
    if (fcmMessaging) {
      const token = await getToken(fcmMessaging, {
        vapidKey: process.env.REACT_APP_VAPID_KEY,
      });
      return token;
    }
    return null;
  } catch (err) {
    console.error("An error occurred while fetching the token:", err);
    return null;
  }
};

export { app, messaging };