import React, { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import AccountToggle from "./AccountToggle";
import RouteSelect from "./RouteSelect";

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className={`h-screen bg-white border-r transition-all duration-300 flex flex-col
            ${collapsed ? "w-16" : "w-64"} relative`}>
            
            {/* Sidebar Content */}
            <div className={`overflow-y-scroll flex-grow p-2
                ${collapsed ? "opacity-0 hidden" : "opacity-100"}`}>
                <AccountToggle />
                <RouteSelect />
            </div>

            {/* Collapse Button */}
            <button
                className={`absolute bottom-4 left-1/2 transform -translate-x-1/2
                flex items-center justify-center transition-all
                bg-gray-300 hover:bg-gray-400 shadow-lg rounded-full
                ${collapsed ? "w-10 h-10 p-2" : "w-8 h-8 p-1"}`}
                onClick={() => setCollapsed(!collapsed)}
            >
                {collapsed ? <FiChevronRight size={18} /> : <FiChevronLeft size={18} />}
            </button>
        </div>
    );
}
