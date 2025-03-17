import React, { useState, useRef, useEffect, useCallback } from "react";
import { Axios } from "../Axios";
import dayjs from "dayjs";
import { Typography, List, ListItem } from "@material-tailwind/react";
import { useLocation, useNavigate } from "react-router-dom";
import { ConfirmModal } from "../Calendar/ConfirmModal";

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
        <div className="w-full lg:w-2/5 m-auto mt-10">
            <Typography variant="h5" className="font-bold mb-4 text-gray-800 dark:text-dark-text-primary">
                {`Слободни најбрзи термини`}
            </Typography>
            <List className="bg-white dark:bg-dark-secondary border gap-4 border-gray-200 dark:border-gray-700 rounded-lg">
                {events.length > 0 ? (
                    events.map((event, index) => {
                        const isLastItem = index === events.length - 1;
                        return (
                            <ListItem
                                key={index}
                                ref={isLastItem ? observerRef : null} // Set ref only on the last item
                                onClick={() => {
                                    setSelectedAppointment(event);
                                    setOpenModal(true);
                                }}
                                className="flex border border-gray-200 dark:border-gray-700 justify-between items-start cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-tertiary"
                            >
                                <div>
                                    <Typography
                                        variant="paragraph"
                                        className="font-bold text-gray-800 dark:text-dark-text-primary text-sm"
                                    >
                                        {event.event.title}
                                    </Typography>
                                    <Typography
                                        variant="paragraph"
                                        className="text-gray-500 dark:text-dark-text-secondary text-sm"
                                    >
                                        {event.event.date ? dayjs(event.event.date).format("DD MMM YYYY") : "N/A"}
                                    </Typography>
                                </div>
                                <Typography variant="small" className="text-gray-500 dark:text-dark-text-secondary">
                                    {event.event.time}
                                </Typography>
                            </ListItem>
                        );
                    })
                ) : (
                    <Typography variant="paragraph" className="text-gray-500 dark:text-dark-text-secondary p-4">
                        Нема слободни термини.
                    </Typography>
                )}
            </List>
            <ConfirmModal isOpen={openModal} setOpen={setOpenModal} event_information={selectedAppointment} />
        </div>
    );
}
