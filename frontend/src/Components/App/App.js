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

const cookie = new Cookie();

function App() {
  return (
    <BrowserRouter>
      <Header />
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
