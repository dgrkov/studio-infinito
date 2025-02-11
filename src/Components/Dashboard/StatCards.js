import React from "react";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";

export default function StatCards() {
    return <>
    <Card title="Total Revenue" value="1500" pillText="2.75%" trend="up" period="From Jan 1st - Jun 2nd"/>
    <Card title="Avg customers" value="200" pillText="4.32%" trend="down" period="From May 1st - Jul 2nd"/>
    <Card title="Sales" value="2345" pillText="10.5%" trend="up" period="From Feb 5th - Aug 22nd"/>
    </>;
}

const Card = ({title, value, pillText, trend, period}) => {
    return ( 
        <div className="p-4 col-span-4 rounded border border-stone-300">
            <div className="flex mb-8 items-start justify-between">
                <div>
                    <h3 className="text-stone-500 mb-2 text-sm">{ title }</h3>
                    <p className="text-3xl font-semibold">{ value }</p>
                </div>
                <span className={`text-xs flex items-center gap-1 font-medium px-2 py-1 rounded ${
                    trend === "up"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
                >
                    {trend === "up" ? <FiTrendingUp /> : <FiTrendingDown />} { pillText }
                </span>
            </div>
        </div>
    );
}