import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import ServiceCard from "../ServiceTypeCard/ServiceCard";
import ServiceCardMobile from "../ServiceTypeCard/ServiceCardMobile";
import HairstylistCard from '../HairstylistCard/HairstylistCard'
import HairStylistMobile from '../HairstylistCard/HairStylistMobile'
import { StepperWithContent } from "../Stepper/Stepper";

export default function Appointment() {
    const [step, setStep] = useState(0);
    const[selectedWorkReq, setSelectedWorkReq] = useState(null);
    const[price, setPrice] = useState(0);
    const[employee, setEmployee] = useState(null);
    const[isMobile, setIsMobile] = useState(false);
    const[Hairstylist, setHairstylist] = useState(false);

    const navigate = useNavigate();

    const workReqs = [
        {name: "Шишање", price: 500},
        {name: "Фарбање", price: 1000},
        {name: "Фенирање", price: 400}
    ]

    const employees = ["Александар", "Марија"];

    useEffect(() => {
        if ( window.innerWidth < 700 ) setIsMobile(true);
    })


    const handleWorkReqSelection = (workReq) => {
        setSelectedWorkReq(workReq);
        setPrice(workReq.price);
        setStep(2);
    };

    const handleEmployeeSelection = (employee) => {
        setEmployee(employee);
        setStep(3);
    }

    const handleConfirmBooking = () => {
        setStep(1);
        setSelectedWorkReq(null);
        setPrice(0);
        setEmployee(null);
        navigate("/reserve");

    }

    function setHairstylistWithStep() {
        setHairstylist(true);
        setStep(1);
    }


    return (
        <div
        //  className="min-h-screen flex justify-center items-center"
         >
            <StepperWithContent activeStep={step}/>
        <div
            
            // className="py-16 px-6 mx-auto sm:max-w-xl md:max-w-full lg:max-w-[95%] xl:max-w-[90%] md:px-24 lg:px-8 rounded-3xl rounded-b-md"
        >
            {!Hairstylist ? (
            <div onClick={setHairstylistWithStep}>
                {isMobile ? (
                    <HairStylistMobile employee={employees} />
                ) : (
                    <HairstylistCard employee={employees}/>
                )}
            </div>
            ) : (
            <>
                <h1 className="text-2xl font-bold mb-4">Одберете услуга</h1>
                {isMobile ? (
                    <ServiceCardMobile serviceTypes={workReqs} />
                ) : (
                    <ServiceCard serviceTypes={workReqs} />
                )}
            </>
            )}
        </div>
            {/* <div className="bg-white p-6 rounded shadow-md">
                {step === 1 && (
                    <div>
                        <h1 className="text-2xl font-bold mb-4">Одберете услуга</h1>
                        <div className="space-y-4">
                            {workReqs.map((req) => (
                                <button key={req.name} onClick={() => handleWorkReqSelection(req)}
                                className="bg-gray-900 text-white px-4 py-2 rounded m-5 hover:bg-gray-600">
                                    {req.name} <br/>
                                    Цена: {req.price} ден
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                {step === 2 && (
                    <div>
                        <h1 className="text-2xl font-bold mb-4">Изберете вработен: </h1>
                        <p className="mb-4 text-gray-700">Услуга: <span className="font-bold">{selectedWorkReq.name}</span></p>
                        <p className="mb-4 text-gray-700">Цена: <span className="font-bold">{price}</span></p>
                        <div className="space-y-4">
                            {employees.map((emp) => (
                                <button key={emp} onClick={() => handleEmployeeSelection(emp)}
                                className="w-full bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-600">
                                    {emp}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div>
                    <h1 className="text-2xl font-bold mb-4">Потврдете избраните детали пред продолжување кон избор на датум</h1>
                    <p className="mb-4 text-gray-700">Услуга: <span className="font-bold">{selectedWorkReq.name}</span></p>
                    <p className="mb-4 text-gray-700">Цена: <span className="font-bold">{price} ден</span></p>
                    <p className="mb-4 text-gray-700">Вработен: <span className="font-bold">{employee}</span></p>
                    
                    <button
                      onClick={handleConfirmBooking}
                      className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-300"
                    >
                      Потврди резервација
                    </button>
                  </div>
                )}
            </div> */}
        </div>
    );
}