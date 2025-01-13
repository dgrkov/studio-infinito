import { useEffect, useState } from "react";
import { Typography, Input, Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import GalleryImage from "./GalleryImage";

import Logo from '../../Logo_4K_Transparent.png';

import "./Main.css";

export default function Home() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 2000); // Simulate loading time
        return () => clearTimeout(timer);
    }, []);

    return (
        <section
            id="image-container"
            className={`flex flex-col justify-center items-center p-0 h-full ${
                loading ? "loading" : ""
            }`}
        >
            <div
                id="first-image"
                className="w-full text-center items-center h-full align-center flex flex-col justify-center space-y-6"
            >
                <div className="w-full h-60 animate-fade-in">
                    <img
                        className="rounded-lg object-cover object-center animate-scale-in responsive-image"
                        src={Logo}
                        alt="Logo"
                    />
                </div>
                <Typography
                    variant="paragraph"
                    color="blue-gray"
                    className="mb-2 text-[15px] font-bold sm:text-[15px] md:text-[20px] lg:text-[30px] animate-slide-up"
                >
                    Добредојдовте во нашата страна за букирање на термини.
                </Typography>
                <Button
                    variant="outlined"
                    onClick={() => navigate("/appointment")}
                    color="gray"
                    size="lg"
                    className="mt-6 w-auto animate-pulse"
                >
                    Букирај сега
                </Button>
                <Button
                    variant="gradient"
                    onClick={() => navigate("/appointment")}
                    color="gray"
                    size="lg"
                    className="mt-6 w-auto animate-fade-in-down"
                >
                    Најди најбрз термин
                </Button>
            </div>
        </section>
    );
}