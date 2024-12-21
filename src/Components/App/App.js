import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';

<<<<<<< HEAD
import Main from '../Main/Main';
=======
import Header from '../Header/Header';

>>>>>>> calendar
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
      <Routes>
        <Route path="/main" element={<Main />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
