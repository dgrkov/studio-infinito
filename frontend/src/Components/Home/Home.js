import { useEffect, useState } from "react";
import { Typography, Input, Button } from "@material-tailwind/react";
import { useNavigate, useLocation } from "react-router-dom";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import GalleryImage from "./GalleryImage";

import Logo from '../../Logo_4K_Transparent.png';

import "./Main.css";
import Notification from "./Notification";
import { FastBookingModal } from "./FastBookingModal";

export default function Home() {
    const location = useLocation();
    const { message } = location.state || {};
    const { head_message } = location.state || {};
    const { type } = location.state || {};
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [fastBookingModal, setFastBookingModal] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    const handleFastBookingSubmit = (data) => {
        // Navigate to fast-booking list with the data
    };

    return (
        <section
            id="image-container"
            className={`flex flex-col justify-center items-center p-0 mt-2 h-full bg-gray-100 dark:bg-dark-primary ${
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

                <Typography
                    variant="paragraph"
                    className="px-5 md:px-0 text-[15px] font-bold sm:text-[15px] md:text-[20px] lg:text-[30px] animate-slide-up text-gray-800 dark:text-dark-text-primary"
                    style={{ marginBottom: '1rem' }}
                >
                    Добредојдовте во нашата страна за букирање на термини.
                </Typography>
                <Button
                    variant="outlined"
                    onClick={() => navigate("/appointment")}
                    className="mt-6 w-[190px] animate-pulse 
                        text-gray-800 border-gray-800 
                        dark:text-dark-text-primary dark:border-dark-border-light
                        hover:bg-gray-100 dark:hover:bg-dark-tertiary"
                >
                    Букирај сега
                </Button>
                <Button
                    variant="gradient"
                    onClick={() => setFastBookingModal(true)}
                    className="mt-6 w-[190px] animate-fade-in-down
                        bg-gray-800 text-white
                        dark:bg-dark-accent-primary dark:text-dark-text-primary
                        hover:bg-gray-700 dark:hover:bg-dark-accent-hover"
                >
                    Најди најбрз термин
                </Button>
            </div>
            <FastBookingModal 
                isOpen={fastBookingModal} 
                onClose={() => setFastBookingModal(false)}
                onSubmit={handleFastBookingSubmit}
            />
        </section>
    );
}