import { useEffect, useState } from "react";
import { Typography, Input, Button } from "@material-tailwind/react";
import { useNavigate, useLocation } from "react-router-dom";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import GalleryImage from "../../Home/GalleryImage";
import "../../Home/Main.css";
import Notification from "../../Home/Notification";
import { FastBookingModal } from "../../Home/FastBookingModal";

import Logo from '../../../Logo_4K_Transparent.png';

export default function AdminPage() {
    const location = useLocation();
    const { message } = location.state || {};
    const { head_message } = location.state || {};
    const { type } = location.state || {};
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [fastBookingModal, setFastBookingModal] = useState(false);

    const handleRedirect = () => {
      navigate('/admin/reservation');
    };

    const handleFastBookingSubmit = (data) => {
        // Navigate to fast-booking list with the data
    };

    return (
        <section
            id="image-container"
            className={`flex flex-col justify-center items-center p-0 mt-2 h-full bg-white dark:bg-dark-primary ${
                loading ? "loading" : ""
            }`}
        >
            <Notification message={message} type={type} head_message={head_message} />
            <div
                id="first-image"
                className="w-full text-center items-center h-full align-center flex flex-col justify-center space-y-6"
            >
               <div
                    id="first-image"
                    className="w-full max-w-[400px] sm:max-w-[600px] lg:max-w-[800px] text-center items-center h-[45dvh] flex flex-col justify-center space-y-6"
                >
                    <img
                        className="rounded-lg object-cover object-center animate-scale-in responsive-image"
                        src={Logo}
                        alt="Logo"
                    />
                </div>
                <Button
                    variant="outlined"
                    onClick={() => navigate("/admin-reservations")}
                    className="mt-6 w-[190px]
                        text-gray-800 border-gray-800
                        dark:text-dark-text-primary dark:border-dark-border-light
                        hover:bg-gray-100 dark:hover:bg-dark-tertiary"
                >
                    Преглед на термини
                </Button>
                <Button
                    variant="gradient"
                    onClick={() => setFastBookingModal(true)}
                    className="mt-6 w-[190px] animate-fade-in-down
                        bg-gray-800 text-white
                        dark:bg-dark-accent-primary dark:text-dark-text-primary
                        hover:bg-gray-700 dark:hover:bg-dark-accent-hover"
                >
                    Создади термин
                </Button>
            </div>
            <FastBookingModal isOpen={fastBookingModal} 
                onClose={() => setFastBookingModal(false)}
                onSubmit={handleFastBookingSubmit}
            />
        </section>
    );
}