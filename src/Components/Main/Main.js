import { Typography, Input, Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";



export default function Main() {
    const navigate = useNavigate();

    return (
        <section className="grid text-center h-screen items-center p-8">
            <div>
            <Typography variant="h1" color="blue-gray" className="mb-2">
                Добредојдовте на нашата платформа за букирање термини!
            </Typography>
            <Typography variant="h3" color="blue-gray" className="mb-2">
                Како може да ви помогнеме?
            </Typography>
            </div>
            <div >
                <Button onClick={() => navigate("/appointment")} color="gray" size="lg" className="mt-6 w-60" >
                    Букирај сега
                </Button>
                <br/>
                <Button color="gray" size="lg" className="mt-6 w-60" >
                    Најди најбрз термин
                </Button>
            </div>
        </section>
    );
}