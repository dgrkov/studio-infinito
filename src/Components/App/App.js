import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Home from '../Home/Home';
import Header from '../Header/Header';
import Auth from '../Auth/Auth';
import Calendar from '../Calendar/Calendar';
import Appointment from '../Appointment/Appointment';
import UserDetails from '../UserDetails/UserDetails';
import Checkout from '../Checkout/Checkout';
import AdminReservations from '../Admin/AdminReservations/AdminReservations';

function App() {
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
        <Route path="/admin/home" element={<AdminReservations />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
