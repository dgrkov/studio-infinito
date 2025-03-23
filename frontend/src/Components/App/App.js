import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import './App.css';
import Home from '../Home/Home';
import Header from '../Header/Header';
import Auth from '../Auth/Auth';
import Calendar from '../Calendar/Calendar';
import Appointment from '../Appointment/Appointment';
import UserDetails from '../User/UserDetails';
import Checkout from '../Checkout/Checkout';
import UserProfile from '../User/UserProfile';
import FastBookingList from '../FastBookingList/FastBookingList';
import AdminPage from '../Admin/AdminPage/AdminPage';
import Reservations from '../User/UserReservations';
import Register from '../Auth/Register';
import { Cookie } from '../Cookie';

import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { app } from "../Config/firebase-config";
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Typography } from '@material-tailwind/react';
import { XCircleIcon } from '@heroicons/react/24/outline';
import { BellIcon } from '@heroicons/react/24/solid';

import Logo from '../../Logo_4K_Transparent.png';

const cookie = new Cookie();
const messaging = getMessaging(app);

function App() {
  const [showPrompt, setShowPrompt] = React.useState(false);
  const [permissionState, setPermissionState] = React.useState("default");
  
  useEffect(() => {
    if (typeof Notification !== "undefined") {
      setPermissionState(Notification.permission);

      if (Notification.permission === "default" || Notification.permission === "denied") {
        setShowPrompt(true);
      }
    }
  }, []);

  async function requestPermission() {
    if (typeof Notification !== "undefined") {
      const permission = Notification.permission;

      if (permission === "granted") {
        const token = await getToken(messaging, {
          vapidKey: process.env.REACT_APP_VAPID_KEY,
        });
        if (token) {
          localStorage.setItem("firebase_token", token);
        }
      }
      else if (permission === "default") {
        try {
          const permissionResult = await Notification.requestPermission();
          if (permissionResult === "granted") {
            const token = await getToken(messaging, {
              vapidKey: process.env.REACT_APP_VAPID_KEY,
            });
            if (token) {
              localStorage.setItem("firebase_token", token);
            }
          } else {
            const permission = await Notification.requestPermission();
            if (permission === "denied") {
              console.warn("Notifications are blocked. User must enable them manually.");
            }
          }
        } catch (error) {
          console.error("Error requesting notification permission:", error);
        }
      }
      else {
        console.warn("Notifications are blocked. User must enable them manually.");
      }
    }
  }
  
  const handleNotificationRequest = async () => {
    try {
      const permission = await Notification.requestPermission();
      setPermissionState(permission);
      
      if (permission === "granted") {
        setShowPrompt(false);

        await requestPermission();

      } else if (permission === "denied") {
        setPermissionState("denied");
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
    }
  };
  
  const handleRemindLater = () => {
    localStorage.setItem("notification_remind_later", Date.now().toString());
    
    setShowPrompt(false);
    
    setTimeout(() => {
      if (Notification.permission === "default") {
        setShowPrompt(true);
      }
    }, 24 * 60 * 60 * 1000);
  };
  
  useEffect(() => {
    const remindLaterTimestamp = localStorage.getItem("notification_remind_later");
    
    if (remindLaterTimestamp) {
      const timePassed = Date.now() - parseInt(remindLaterTimestamp);
      const dayInMs = 24 * 60 * 60 * 1000;
      
      if (timePassed >= dayInMs && Notification.permission === "default") {
        setShowPrompt(true);
      }
    }
  }, []);

  return (
    <BrowserRouter>
      <Header />
      
      <Dialog
        open={showPrompt}
        handler={() => {}}
        dismiss={{ enabled: false }}
        size="sm"
        className="bg-white shadow-xl rounded-lg"
      >
        <DialogHeader className="flex items-center justify-between">
          <div className="flex items-center">
            <BellIcon className="h-6 w-6 text-blue-500 mr-2" />
            <Typography variant="h6" color="blue-gray">
                Овозможете известувања
            </Typography>
          </div>
        </DialogHeader>
        
        <DialogBody className="text-center">
          {permissionState === "default" && (
            <>
              <Typography className="mb-4 text-gray-700">
                Останете во тек со важни известувања и објави со овозможување на нотификации.
              </Typography>
              <div className="flex justify-center my-4">
                <img 
                  src={Logo}
                  alt="Notification illustration" 
                  className="rounded-lg"
                />
              </div>
              <Typography className="text-sm text-gray-600">
                Нема да пропуштите важни информации кога ќе овозможите известувања.
              </Typography>
            </>
          )}
          
          {permissionState === "denied" && (
            <>
              <XCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <Typography className="font-bold text-red-500 mb-2">
                Вие ги блокиравте известувањата во вашиот прелистувач. 
                <br />
                За да ги овозможите:
              </Typography>
              {/* Detect if the user is on iOS */}
              {navigator.userAgent.match(/(iPod|iPhone|iPad)/) ? (
                <ol className="text-left text-sm text-gray-600 space-y-2 mb-4">
                  <li>1. Ве молам упатете се во "Settings" или поставувања на вашиот телефон</li>
                  <li>2. Најдете ја нашата апликација "Studio Infinito"</li>
                  <li>3. Ве молам овозможете ги известувањата или "Notifications"</li>
                  <li>4. Освежете ја оваа страница</li>
                </ol>
              ) : (
                <ol className="text-left text-sm text-gray-600 space-y-2 mb-4">
                  <li>1. Кликнете на иконата за катанец/информации во адресната лента на прелистувачот</li>
                  <li>2. Најдете "Известувања" во поставките на страницата</li>
                  <li>3. Променете го од "Блокирај" во "Дозволи"</li>
                  <li>4. Освежете ја оваа страница</li>
                </ol>
              )}
            </>
          )}
        </DialogBody>
        
        <DialogFooter className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 justify-center">
          {permissionState === "default" && (
            <>
              <Button 
                variant="gradient" 
                onClick={handleNotificationRequest}
                fullWidth
              >
                Дозволи известувања
              </Button>
              <Button 
                variant="outlined"
                onClick={handleRemindLater}
                fullWidth
              >
                Потсети ме подоцна
              </Button>
            </>
          )}
          
          {permissionState === "denied" && (
            <Button
              variant="gradient"
              onClick={() => window.location.reload()}
              fullWidth
            >
              Ги овозможив известувањата
            </Button>
          )}
        </DialogFooter>
      </Dialog>

      <AppWrapper />
    </BrowserRouter>
  );
}

function AppWrapper() {
  const navigate = useNavigate();

  useEffect(() => {

    const access_token = cookie.getCookie('access_token');

    if (!access_token && window.location.pathname !== '/' && window.location.pathname !== '/register') {
      navigate('/');
    }

    // const handleKeyDown = (e) => {
    //   if (
    //     e.key === "F12" || 
    //     (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'C' || e.key === 'J')) || 
    //     (e.ctrlKey && e.key === 'U')
    //   ) {
    //     e.preventDefault();
    //   }
    // };

    // document.addEventListener("keydown", handleKeyDown);

    const isDark = localStorage.getItem("theme") === "dark";
    document.documentElement.classList.toggle("dark", isDark);

    // return () => {
    //   document.removeEventListener("keydown", handleKeyDown);
    // };
  }, [navigate]);

  useEffect(() => {
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
          console.log('Service Worker registered:', registration);
        } catch (err) {
          console.error('Service Worker registration failed:', err);
        }
      } else {
        console.warn('Service Worker is not supported in this browser.');
      }
    };
  
    registerServiceWorker();
  
    async function requestPermission() {
      if (typeof Notification !== "undefined") {
        const permission = Notification.permission;
  
        if (permission === "granted") {
          const token = await getToken(messaging, {
            vapidKey: process.env.REACT_APP_VAPID_KEY,
          });
          if (token) {
            localStorage.setItem("firebase_token", token);
          }
        }
        else if (permission === "default") {
          try {
            const permissionResult = await Notification.requestPermission();
            if (permissionResult === "granted") {
              const token = await getToken(messaging, {
                vapidKey: process.env.REACT_APP_VAPID_KEY,
              });
              if (token) {
                localStorage.setItem("firebase_token", token);
              }
            } else {
              const permission = await Notification.requestPermission();
              if (permission === "denied") {
                console.warn("Notifications are blocked. User must enable them manually.");
              }
            }
          } catch (error) {
            console.error("Error requesting notification permission:", error);
          }
        }
        else {
          console.warn("Notifications are blocked. User must enable them manually.");
        }
      }
    }

    requestPermission();
  
    onMessage(messaging, (payload) => {
      if (Notification.permission === "granted") {
        navigator.serviceWorker.getRegistration().then((registration) => {
          if (registration) {
            registration.showNotification(payload.notification.title, {
              body: payload.notification.body,
              icon: payload.notification.icon || payload.data?.icon || "default-icon.png",
              data: { url: payload.fcmOptions?.link || payload.data?.link },
            });
          } else {
            console.warn("No service worker registered.");
          }
        });
      } else {
        console.warn("Notifications not granted.");
      }
    });
  
  }, []);
  
  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
      <Route path="/reserve" element={<Calendar />} />
      <Route path="/appointment" element={<Appointment />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/userdetails" element={<UserDetails />} />
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/appointments" element={<Reservations />} />
      <Route path="/fast-booking" element={<FastBookingList />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/admin-reservations" element={<Reservations />} />
    </Routes>
  );
}

export default App;
