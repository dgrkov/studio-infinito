import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter, Typography } from "@material-tailwind/react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import FullScreenLoader from "../FullScrennLoader/FullScreenLoader";

import { Axios } from "../Axios";

const axios = new Axios();

dayjs.extend(utc);

export function ConfirmModal({ event_information, isOpen, setOpen }) {
  const [loading, setLoading] = useState(false);
  const [eventTimeStart, setEventTimeStart] = useState(null);
  const [eventTimeEnd, setEventTimeEnd] = useState(null);

  const service_type = event_information?.appointmentData?.serviceType || {};

  useEffect(() => {
    if (!event_information?.event?.date || !event_information?.event?.time) return;

    var duration = service_type?.duration || 0;

    var formattedDate = event_information.event.date.split("-").reverse().join("-");
    var startTime = dayjs(`${formattedDate}T${event_information.event.time}`);

    var endTime = startTime.isValid() 
      ? startTime.add(duration, "minute")
      : null;

    setEventTimeStart(startTime);
    setEventTimeEnd(endTime);

    setOpen(isOpen);
  }, [event_information, isOpen]);
  

  const navigate = useNavigate();

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    setLoading(true);
    axios.post("Appointments/confirm-appointment", event_information).then((res) => {
      if (res.status === 200) {
        console.log(res);
        setLoading(false);
        handleSuccess();
      }
    });
  };

  const handleSuccess = () => {
      navigate("/home", {
        state: {
          head_message: "Резервацијата е успешна",
          message: `Успешно резервираште ${service_type?.name || "N/A"} на ${event_information?.event?.date || "N/A"} од ${eventTimeStart ? eventTimeStart.format("HH:mm") : "N/A"}`,
          type: "success",
        },
      });
      setOpen(false);
  };

  return (
    <Dialog open={isOpen} handler={handleClose} className="dark:bg-dark-secondary">
      <DialogHeader>
        <Typography variant="h5" className="text-gray-800 dark:text-dark-text-primary">
          Потврда на термин
        </Typography>
      </DialogHeader>
      <DialogBody divider className="grid place-items-center gap-2">
        <div className="flex justify-between items-center w-full border-b-2 border-gray-200 dark:border-dark-border">
          <p className="text-gray-400 dark:text-dark-text-muted ml-4">Одбран вработен</p>
          <p className="text-black dark:text-dark-text-primary mr-4">{event_information?.appointmentData?.hairstylist || "N/A"}</p>
        </div>
        <div className="flex justify-between items-center w-full border-b-2 border-gray-200 dark:border-dark-border">
          <p className="text-gray-400 dark:text-dark-text-muted ml-4">Одбрана услуга</p>
          <p className="text-black dark:text-dark-text-primary mr-4">{service_type?.name || "N/A"}</p>
        </div>
        <div className="flex justify-between items-center w-full border-b-2 border-gray-200 dark:border-dark-border">
          <p className="text-gray-400 dark:text-dark-text-muted ml-4">Датум</p>
          <p className="text-black dark:text-dark-text-primary mr-4">{event_information?.event?.date || "N/A"}</p>
        </div>
        <div className="flex justify-between items-center w-full border-b-2 border-gray-200 dark:border-dark-border">
          <p className="text-gray-400 dark:text-dark-text-muted ml-4">Време</p>
          <p className="text-black dark:text-dark-text-primary mr-4">
              {eventTimeStart ? eventTimeStart.format("HH:mm") : "N/A"} - {eventTimeEnd ? eventTimeEnd.format("HH:mm") : "N/A"}
          </p>
        </div>
        <div className="flex justify-between items-center w-full">
          <p className="text-gray-400 dark:text-dark-text-muted ml-4">Цена</p>
          <p className="text-indigo-600 dark:text-dark-accent-primary mr-4">{service_type?.price || "N/A"} ден.</p>
        </div>
      </DialogBody>
      <DialogFooter className="flex flex-row w-full justify-center gap-5">
        <Button
          variant="outlined"
          disabled={loading}
          fullWidth
          className="text-red-500 border-red-500 dark:text-red-400 dark:border-red-400"
          onClick={handleClose}
        >
          Откажи
        </Button>
        <Button
          onClick={handleConfirm}
          fullWidth
          className="bg-dark-button-primary dark:hover:bg-dark-button-hover"
          loading={loading}
        >
          Резервирај
        </Button>
      </DialogFooter>
      <FullScreenLoader loading={loading} />
    </Dialog>
  );
}
