import React, { useState, useEffect } from "react";
import StatCards from "./StatCards";

export default function Grid() {
    return (
        <div className="px-4 grid gap-3 grid-cols-12">
            <StatCards />
        </div>
    );
}