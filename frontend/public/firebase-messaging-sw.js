importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js");

firebase.initializeApp({
  apiKey: "AIzaSyAyHANp-_J-zBPuOm64IcU4-9nPDxXgR6U",
  authDomain: "studio-infinito.firebaseapp.com",
  projectId: "studio-infinito",
  storageBucket: "studio-infinito.appspot.com",
  messagingSenderId: "154747994302",
  appId: "1:154747994302:web:ddf1a3ee42a2c2d3c85eef",
  measurementId: "G-QZH38YBY8B"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.data?.icon || "https://ts1k5rzt-3001.euw.devtunnels.ms/static/media/Logo_4K_Transparent.f8358b45d0ac78650da4.png", // Use icon from FCM payload
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      const url = event.notification.data?.url;
      if (!url) return;
      for (const client of clientList) {
        if (client.url === url && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
