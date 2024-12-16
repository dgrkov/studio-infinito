import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';

import Header from '../Header/Header';

import Auth from '../Auth/Auth';
import Calendar from '../Calendar/Calendar';

function App() {
  return (
    <BrowserRouter>
    <Header />
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/reserve" element={<Calendar />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
