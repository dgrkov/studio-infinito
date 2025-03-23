import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyAyHANp-_J-zBPuOm64IcU4-9nPDxXgR6U",
    authDomain: "studio-infinito.firebaseapp.com",
    projectId: "studio-infinito",
    storageBucket: "studio-infinito.firebasestorage.app",
    messagingSenderId: "154747994302",
    appId: "1:154747994302:web:ddf1a3ee42a2c2d3c85eef",
    measurementId: "G-QZH38YBY8B"
};

const firebase = initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log("Received background message ", payload);
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/logo192.png",
  });
});