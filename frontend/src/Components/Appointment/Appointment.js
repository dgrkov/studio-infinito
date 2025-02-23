import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import ServiceCard from "../ServiceTypeCard/ServiceCard";
import ServiceCardMobile from "../ServiceTypeCard/ServiceCardMobile";
import HairstylistCard from "../HairstylistCard/HairstylistCard";
import HairStylistMobile from "../HairstylistCard/HairStylistMobile";
import Calendar from "../Calendar/Calendar";
import { StepperWithContent } from "../Stepper/Stepper";

import { Axios } from "../Axios";

const axios = new Axios();

export default function Appointment() {
    const [step, setStep] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [Hairstylist, setHairstylist] = useState(false);
    const [WorkRequest, setWorkRequest] = useState(false);
    const [services, setServices] = useState([]);
    const [appointmentData, setAppointmentData] = useState({});

    const navigate = useNavigate();

    const employees = ["Александар", "Марина"];

    useEffect(() => {
        if (window.innerWidth < 700) setIsMobile(true);

        const handlePopState = () => {
            if (step > 0) {
                goBack();
            }
        };

        window.addEventListener("popstate", handlePopState);

        axios.get(`Appointments/get-services`).then((res) => {
            if (res.status === 200) {
                console.log(res);
                setServices(res.data);
            }
        });

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

    const handleWRSWithStep = (serviceType) => {
        setAppointmentData(prevState => ({...prevState, serviceType: serviceType }));
        setWorkRequest(true);
        goForward(2);
    };

    const handleHairstylistClick = (hairstylist) => {
        setAppointmentData(prevState => ({...prevState, hairstylist: hairstylist }));
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
                        <Calendar 
                            appointmentData={appointmentData}
                        />
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
                                        serviceTypes={services}
                                        activeStep={step}
                                        handleWorkReq={handleWRSWithStep}
                                    />
                                ) : (
                                    <ServiceCardMobile
                                        serviceTypes={services}
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
