import React, {useState} from "react";
import { useNavigate } from 'react-router-dom'
import Reservations from "../AdminReservations/Reservations";
import AdminReservationForm from "../AdminReservationForm/AdminReservationForm";


export default function AdminPage() {
    const navigate = useNavigate();

    const handleRedirect = () => {
      navigate('/admin/reservation');
    };

    return (
        <div className="flex items-center justify-center flex-col">
            <Reservations />
            <button className="w-1/6 mt-8 bg-black hover:bg-gray-800 text-white font-size-2xl font-semibold py-6 px-8 rounded" onClick={handleRedirect}>
                Додади нова резервација
            </button>
        </div>
        
    );
}