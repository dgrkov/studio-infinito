import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import ServiceCard from "../ServiceTypeCard/ServiceCard";
import ServiceCardMobile from "../ServiceTypeCard/ServiceCardMobile";
import HairstylistCard from "../HairstylistCard/HairstylistCard";
import HairStylistMobile from "../HairstylistCard/HairStylistMobile";
import Calendar from "../Calendar/Calendar";
import { StepperWithContent } from "../Stepper/Stepper";

export default function Appointment() {
    const [step, setStep] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [Hairstylist, setHairstylist] = useState(false);
    const [WorkRequest, setWorkRequest] = useState(false);

    const navigate = useNavigate();

    const workReqs = [
        { name: "Шишање", price: 500, time: "30 min" },
        { name: "Фарбање", price: 1000, time: "1 h" },
        { name: "Фенирање", price: 400, time: "30 min" },
    ];

    const employees = ["Александар", "Марина"];

    useEffect(() => {
        if (window.innerWidth < 700) setIsMobile(true);

        const handlePopState = () => {
            if (step > 0) {
                goBack();
            }
        };

        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, [step]);

    const goForward = (nextStep) => {
        setStep(nextStep);
        window.history.pushState({ step: nextStep }, "");
    };

    const goBack = () => {
        if (step === 2) setWorkRequest(false);
        if (step === 1) setHairstylist(false);
        setStep((prevStep) => Math.max(prevStep - 1, 0));
    };

    const handleWRSWithStep = () => {
        setWorkRequest(true);
        goForward(2);
    };

    const handleHairstylistClick = (hairstylist) => {
        setHairstylist(true);
        goForward(1);
    };

    const handleStepChange = (targetStep) => {
        if (targetStep === step) return;

        if (targetStep === 0) {
            setHairstylist(false);
            setWorkRequest(false);
        } else if (targetStep === 1) {
            setHairstylist(true);
            setWorkRequest(false);
        } else if (targetStep === 2) {
            setHairstylist(true);
            setWorkRequest(true);
        }

        setStep(targetStep);
        window.history.pushState({ step: targetStep }, "");
    };

    return (
        <div>
            <StepperWithContent 
                activeStep={step} 
                onStepChange={handleStepChange} />
            <div className="p-1">
                {WorkRequest ? (
                    <div>
                        <Calendar />
                    </div>
                ) : (
                    <div>
                        {!Hairstylist ? (
                            <div className="h-[70dvh]">
                                {isMobile ? (
                                    <HairStylistMobile
                                        onCardClick={handleHairstylistClick}
                                        employee={employees}
                                    />
                                ) : (
                                    <HairStylistMobile
                                        onCardClick={handleHairstylistClick}
                                        employee={employees}
                                        />
                                )}
                            </div>
                        ) : (
                            <div>
                                {/* <h1 className="text-2xl font-bold mb-4 lg:pl-28 dark:text-dark-text-primary">Одберете услуга</h1> */}
                                {isMobile ? (
                                    <ServiceCardMobile
                                        serviceTypes={workReqs}
                                        activeStep={step}
                                        handleWorkReq={handleWRSWithStep}
                                    />
                                ) : (
                                    <ServiceCardMobile
                                        serviceTypes={workReqs}
                                        activeStep={step}
                                        handleWorkReq={handleWRSWithStep}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
