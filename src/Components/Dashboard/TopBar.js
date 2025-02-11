import { set } from "date-fns";
import React, { useState, useEffect } from "react";

export default function TopBar() {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, [])

    return (
        <div className="border-b px-4 mb-4 mt-2
        pb-4 border-stone-200">
            <div className="flex items-center justify-between p-0.5">
                <div>
                    <span className="text-sm font-bold block">Good morning!</span>
                    <span className="text-xs block text-stone-500">
                        {currentTime.toDateString() + " " + currentTime.toLocaleTimeString()}
                    </span>
                </div>
            </div>
        </div>
    );
}