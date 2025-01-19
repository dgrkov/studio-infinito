import React, { useState, useRef } from "react";
import dayjs from "dayjs";
import { Typography, List, ListItem } from "@material-tailwind/react";
import { useLocation } from "react-router-dom";
import { ConfirmModal } from "../Calendar/ConfirmModal";

const events = [
    { date: "2025-01-12", title: "Слободно", time: "12:00 - 12:30" },
    { date: "2025-01-12", title: "View house with real estate agent", time: "14:30 - 16:30" },
    { date: "2025-01-13", title: "Meeting with bank manager", time: "16:30 - 17:00" },
    { date: "2025-01-15", title: "Слободно", time: "17:30 - 18:00" },
    { date: "2025-02-15", title: "Слободно", time: "17:30 - 18:00" },
    { date: "2025-04-15", title: "Слободно", time: "17:30 - 18:00" },
  ];

export default function FastBookingList() {
    const location = useLocation();
    const { data } = location.state || {};
    console.log(data);
    const eventRef = useRef(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);

    return (
        <div ref={eventRef} className={`w-full lg:w-2/5 m-auto mt-10`}>
        <Typography variant="h5" className="font-bold mb-4 text-gray-800 dark:text-dark-text-primary">
          {`Слободни најбрзи термини`}
        </Typography>
        <List className="bg-white dark:bg-dark-secondary border gap-4 border-gray-200 dark:border-gray-700 rounded-lg">
          {events.length > 0 ? (
            events.map((event, index) => (
              <ListItem
                key={index}
                onClick={() => setOpenModal(true)}
                className="flex border border-gray-200 dark:border-gray-700 justify-between items-start cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-tertiary "
              >
                <div>
                    <Typography
                        variant="paragraph"
                        className={`${
                        event.time 
                            ? "font-bold text-gray-800 dark:text-dark-text-primary" 
                            : "text-gray-500 dark:text-dark-text-secondary"
                        } text-sm`}
                    >
                        {event.title}
                    </Typography>
                    <Typography
                        variant="paragraph"
                        className={`${
                        event.time 
                            ? "font-nromal text-gray-800 dark:text-dark-text-primary" 
                            : "text-gray-500 dark:text-dark-text-secondary"
                        } text-sm`}
                    >
                        {event.date}
                    </Typography>
                </div>
                {event.time && (
                  <Typography variant="small" className="text-gray-500 dark:text-dark-text-secondary">
                    {event.time}
                  </Typography>
                )}
              </ListItem>
            ))
          ) : (
            <Typography variant="paragraph" className="text-gray-500 dark:text-dark-text-secondary p-4">
              Нема слободни термини.
            </Typography>
          )}
        </List>
        <ConfirmModal isOpen={openModal} setOpen={setOpenModal} />
      </div>
    );
}