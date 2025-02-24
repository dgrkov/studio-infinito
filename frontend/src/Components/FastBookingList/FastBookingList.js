import React, { useState, useRef } from "react";
import dayjs from "dayjs";
import { Typography, List, ListItem } from "@material-tailwind/react";
import { useLocation } from "react-router-dom";
import { ConfirmModal } from "../Calendar/ConfirmModal";

export default function FastBookingList() {
    const location = useLocation();
    const { data } = location.state || {};
    const { appointments, requestData } = data || {};

    const eventRef = useRef(null);
    const [openModal, setOpenModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    const events = appointments
        ? appointments.map((appointment) => {

            // Ensure valid date and time
            const date = appointment.appointment_date 
                ? dayjs(appointment.appointment_date).format("YYYY-MM-DD") 
                : "N/A";

            const time = appointment.slot_time 
                ? appointment.slot_time.substring(0, 5) // Extract "HH:mm"
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
        })
        : [];

    return (
        <div ref={eventRef} className="w-full lg:w-2/5 m-auto mt-10">
            <Typography variant="h5" className="font-bold mb-4 text-gray-800 dark:text-dark-text-primary">
                {`Слободни најбрзи термини`}
            </Typography>
            <List className="bg-white dark:bg-dark-secondary border gap-4 border-gray-200 dark:border-gray-700 rounded-lg">
                {events.length > 0 ? (
                    events.map((event, index) => (
                        <ListItem
                            key={index}
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
                    ))
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
