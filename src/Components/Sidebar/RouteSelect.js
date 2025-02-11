import React, { useState } from "react";
import { FiDollarSign, FiHome, FiLink, FiPaperclip, FiUser } from "react-icons/fi";

export default function RouteSelect() {
    // State to track the selected route
    const [selectedRoute, setSelectedRoute] = useState("Dashboard");

    return (
        <div className="space-y-1">
            <Route selected={selectedRoute === "Dashboard"} Icon={FiHome} title="Dashboard" setSelectedRoute={setSelectedRoute} />
            <Route selected={selectedRoute === "Team"} Icon={FiUser} title="Team" setSelectedRoute={setSelectedRoute} />
            <Route selected={selectedRoute === "Invoice"} Icon={FiPaperclip} title="Invoice" setSelectedRoute={setSelectedRoute} />
            <Route selected={selectedRoute === "Integration"} Icon={FiLink} title="Integration" setSelectedRoute={setSelectedRoute} />
            <Route selected={selectedRoute === "Finance"} Icon={FiDollarSign} title="Finance" setSelectedRoute={setSelectedRoute} />
        </div>
    );
};

const Route = ({ selected, Icon, title, setSelectedRoute }) => {
    return (
        <button
            onClick={() => setSelectedRoute(title)} // Update selected button on click
            className={`flex items-center justify-start gap-2 w-full rounded px-2 py-1.5 text-sm transition-all duration-200 ${
                selected
                    ? "bg-gray-300 text-stone-950 shadow"
                    : "hover:bg-cyan-200 bg-transparent text-stone-500 shadow-none"
            }`}
        >
            <Icon />
            <span>{title}</span>
        </button>
    );
};
