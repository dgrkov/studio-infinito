import React from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";


export default function AccountToggle() {
    return (
    <div className="border-b mb-4 mt-2 pb-4 border-stone-300">
        <button className="flex p-0.5 hover:bg-stone-200 rounded transition-colors relative gap-2 w-full items-center">
            <img
            src="https://api.dicebar.com/9.x/notionist/svg"
            alt="avatar"
            className="size-8 rounded shrink-0 bg-violet-500 shadow"
            />
            <div className="text-start">
                <span className="text-sm font-bold block">Grki is Majstor</span>
                <span className="text-xs block text-stone-500">grki@hover.dev</span>
            </div>

            <FiChevronUp className="absolute right-2 top-1/2 -translate-y-[calc(-50%+4px)] text-xs"/>
            <FiChevronDown className="absolute right-2 top-1/2 -translate-y-[calc(-50%-4px)] text-xs"/>
        </button>
    </div>
    );
}