import React, { useState, useRef, useEffect, useCallback } from "react";
import { Axios } from "../Axios";
import dayjs from "dayjs";
import { Typography, Button } from "@material-tailwind/react";
import { useLocation, useNavigate } from "react-router-dom";
import { ConfirmModal } from "../Calendar/ConfirmModal";
import FullScreenLoader from "../FullScrennLoader/FullScreenLoader";

const axios = new Axios();

export default function FastBookingList() {
    const location = useLocation();
    const navigate = useNavigate();
    const { data } = location.state || {};
    const { appointments: initialAppointments, requestData } = data || {};

    const observerRef = useRef(null); // Ref for the observer
    const [appointments, setAppointments] = useState(initialAppointments || []);
    const [pageNumber, setPageNumber] = useState(requestData?.page_number || 1);
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    // Map appointments to the events array with date and time
    const events = appointments.map((appointment) => {
        const date = appointment.appointment_date 
            ? dayjs(appointment.appointment_date).format("YYYY-MM-DD") 
            : "N/A";

        const time = appointment.slot_time 
            ? appointment.slot_time.substring(0, 5)
            : "N/A";

        return {
            event: {
                date,
                time,
                title: "Слободно",
            },
            appointmentData: {
                ...appointment, 
                hairstylist: requestData?.hairstylist || {}, 
                serviceType: requestData?.serviceType || {}
            }
        };
    });

    // Group events by date
    const groupedEvents = events.reduce((acc, { event }) => {
        const { date, time } = event;
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(time);
        return acc;
    }, {});

    const loadMoreAppointments = useCallback(() => {
        if (loading) return;
        setLoading(true);

        console.log("Loading more appointments...");
        const nextPageData = { ...requestData, page_number: pageNumber + 1 };

        axios.post("Appointments/fast-booking", nextPageData)
            .then((res) => {
                if (res.status === 200 && res.data.length > 0) {
                    setAppointments((prev) => [...prev, ...res.data]);
                    setPageNumber((prev) => prev + 1);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [loading, pageNumber, requestData]);

    useEffect(() => {
        if (appointments.length > 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    console.log("Last item is visible, loading more...");
                    loadMoreAppointments();
                }
            },
            { root: null, rootMargin: "100px", threshold: 1.0 }
        );

        if (observerRef.current) observer.observe(observerRef.current);

        return () => {
            if (observerRef.current) observer.unobserve(observerRef.current);
        };
    }, [appointments, loadMoreAppointments]);

    return (
        <div className="w-full lg:w-2/4 m-auto mt-10">
            <FullScreenLoader loading={loading} />
            <Typography variant="h5" className="font-bold mb-4 text-gray-800 dark:text-dark-text-primary">
                {`Слободни најбрзи термини`}
            </Typography>
            <div className="bg-white dark:bg-dark-secondary border gap-4 border-gray-200 dark:border-gray-700 rounded-lg p-10">
                {Object.entries(groupedEvents).length > 0 ? (
                    Object.entries(groupedEvents).map(([date, times], index) => (
                        <div key={index}>
                            {/* Parent element: Date */}
                            <Typography
                                variant="h6"
                                className="font-bold text-gray-800 dark:text-dark-text-primary text-lg py-2 -ml-4"
                            >
                                {dayjs(date).format("DD MMM YYYY")}
                            </Typography>
                            
                            {/* Child elements: Time slots */}
                            <div className="grid grid-cols-3 gap-2 gap-x-2 md:gap-x-10">
                                {times.map((time, idx) => (
                                    <Button
                                        key={idx}
                                        onClick={() => {
                                            const selectedEvent = events.find((e) => e.event.date === date && e.event.time === time);
                                            setSelectedAppointment(selectedEvent);
                                            setOpenModal(true);
                                        }}
                                        className="text-center py-2 rounded-lg w-full bg-gray-100 hover:bg-gray-200 dark:bg-dark-tertiary dark:hover:bg-dark-hover text-gray-800 dark:text-dark-text-primary text-sm"
                                    >
                                        {dayjs(`${date}T${time}`).format("HH:mm")}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <Typography variant="paragraph" className="text-gray-500 dark:text-dark-text-secondary p-4">
                        Нема слободни термини.
                    </Typography>
                )}
                <div className="flex justify-center mt-10" >
                    <Button
                        onClick={loadMoreAppointments}
                        className="w-[70%] md:w-[40%] lg:w-[50%] text-center py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-dark-tertiary dark:hover:bg-dark-hover text-gray-800 dark:text-dark-text-primary text-sm"
                        >
                            Прикажи повеќе
                    </Button>
                    </div>
            </div>
            <ConfirmModal isOpen={openModal} setOpen={setOpenModal} event_information={selectedAppointment} />
        </div>
    );
}
