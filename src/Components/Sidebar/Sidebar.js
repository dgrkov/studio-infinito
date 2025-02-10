import React from "react"
import AccountToggle from "./AccountToggle"

export default function Sidebar () {
    return (
        <div>
            <div className="overflow-y-scroll sticky top-4 h-[calc(100vh-32px-48px)]">
            <AccountToggle />
        </div>

        {/* TODO: Plan toggle */}
        </div>
    )
}