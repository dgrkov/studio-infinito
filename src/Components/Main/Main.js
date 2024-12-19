import { Typography, Input, Button } from "@material-tailwind/react";


export default function Main() {
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
                <Button color="gray" size="lg" className="mt-6 w-60" >
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