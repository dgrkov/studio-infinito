import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Main from '../Main/Main';
import Header from '../Header/Header';
import Auth from '../Auth/Auth';
import Calendar from '../Calendar/Calendar';
import Appointment from '../Appointment/Appointment';
import UserDetails from '../UserDetails/UserDetails';

function App() {
  return (
    <BrowserRouter>
    <Header />
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/reserve" element={<Calendar />} />
        <Route path="/main" element={<Main />} />
        <Route path='/appointment' element={<Appointment />} />
        <Route path='/userdetails' element={<UserDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
