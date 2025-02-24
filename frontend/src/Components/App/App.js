import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

function App() {

  useEffect(() => {
    
    // document.addEventListener("keydown", (e) => {
    //   if (e.key === "F12" || 
    //       (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'C' || e.key === 'J')) || 
    //       (e.ctrlKey && e.key === 'U')) {
    //       e.preventDefault();
    //     }
    // });

    const isDark =
      localStorage.getItem("theme") === "dark";
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // const disableScroll = (e) => e.preventDefault();

    // document.body.style.overflow = "hidden"; // Prevent scrolling
    // document.addEventListener("touchmove", disableScroll, { passive: false });

    // return () => {
    //     document.body.style.overflow = "";
    //     document.removeEventListener("touchmove", disableScroll);
    // };

  }, []);

  return (
    <BrowserRouter>
    <Header />
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/home" element={<Home />} />
        <Route path="/reserve" element={<Calendar />} />
        <Route path='/appointment' element={<Appointment />} />
        <Route path='/checkout' element={<Checkout />} />
        <Route path='/userdetails' element={<UserDetails />} />
        <Route path='/profile' element={<UserProfile />} />
        <Route path="/appointments" element={<Reservations />} />
        <Route path="/fast-booking" element={<FastBookingList />} />
        <Route path='/admin' element={<AdminPage />} />
        <Route path="/admin-reservations" element={<Reservations />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
