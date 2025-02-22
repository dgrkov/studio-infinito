import React, { useState, useRef, useEffect } from "react";
import { Typography, Button, Card, List, ListItem } from "@material-tailwind/react";
import { ConfirmModal } from "./ConfirmModal";
import FullScreenLoader from "../FullScrennLoader/FullScreenLoader";
import dayjs from "dayjs";

import { Axios } from "../Axios";

const axios = new Axios();

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [hideEvents, setHideEvents] = useState(true);
  const eventRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [availableDates, setAvailableDates] = useState([])
  const [filteredEvents, setfilteredEvents] = useState([])

  const generateEvents = (date, availableTimeslots) => {
    const events = [];
    
    availableTimeslots.forEach((slot, index) => {
      const startTime = slot.slot_time;
      const endTime = availableTimeslots[index + 1]?.slot_time || startTime; // Take next slot time as end time, or use current slot as end time
      
      if (startTime && endTime) {
        events.push({
          date: date,
          title: "Слободно",
          time: `${startTime}`
        });
      }
    });
  
    return events;
  };

  const getAvailableDates = () => {
    setLoading(true);
    axios.get(`Calendar/available-dates?year=${currentDate.year()}&month=${currentDate.month() + 1}`).then((res) => {
      if (res.status === 200) {
          setAvailableDates(res.data.result);
        }
      }).catch((error) => { console.log(error) })
      .finally(() => setLoading(false));
  }

  useEffect( () => {
    getAvailableDates();
  }, [currentDate]);

  const generateDaysInMonth = (date) => {
    const daysInMonth = dayjs(date).daysInMonth();
    const firstDayOfMonth = dayjs(date).startOf("month").day();
    const days = Array.from({ length: firstDayOfMonth }).fill(null);
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(dayjs(date).date(i));
    }
    return days;
  };

  const handleDateClick = (date) => {
    setLoading(true);
    setHideEvents(false);
    axios.get(`Calendar/available-timeslots/${date.format("YYYY-MM-DD")}/60`).then((res) => {
      if (res.status === 200) {
        const availableTimeslots = res.data.result;
        const events = generateEvents(date.format("DD-MM-YYYY"), availableTimeslots);

        setfilteredEvents(events);

        eventRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        setSelectedDate(date);
        setLoading(false);
      }
    });
  };

  const handlePrevMonth = () => {
    setCurrentDate((prev) => prev.subtract(1, "month"));
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => prev.add(1, "month"));
  };

  const days = generateDaysInMonth(currentDate);

  return (
    <div className="flex flex-col lg:flex-row lg:space-x-8 p-3 lg:p-8 space-y-8 lg:space-y-0">
      <FullScreenLoader loading={loading} />

      {/* Calendar Section */}
      <div className="w-full lg:w-[50%] space-y-4">
        <div className="flex justify-between items-center">
          <Button size="sm" variant="text" className="text-gray-800 dark:text-gray-100 dark:hover:bg-dark-tertiary" onClick={handlePrevMonth}>
            &lt;
          </Button>
          <Typography variant="h4" className="text-gray-800 dark:text-gray-100 text-center">
            {currentDate.format("MMMM YYYY")}
          </Typography>
          <Button size="sm" variant="text" className="text-gray-800 dark:text-gray-100" onClick={handleNextMonth}>
            &gt;
          </Button>
        </div>

        <Card className="p-4 bg-white dark:bg-dark-secondary dark:border dark:border-dark-border">
          <div className="grid grid-cols-7 gap-2">
            {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
              <Typography
                key={day}
                variant="small"
                className="text-center font-bold text-gray-800 dark:text-gray-100"
              >
                {day}
              </Typography>
            ))}
            {days.map((day, index) => {
              const availableDatesFormatted = availableDates.map((d) => dayjs(d.appointment_date).format("YYYY-MM-DD"));

              const isDisabled = day && (day.day() === 1 || !availableDatesFormatted.includes(day.format("YYYY-MM-DD")));
              return (
                <div
                  key={index}
                  className={`flex items-center justify-center h-10 w-10 rounded-full ${
                    day && day.isSame(selectedDate, "date")
                      ? "bg-gray-700 text-white dark:bg-gray-600"
                      : isDisabled
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-200 dark:hover:bg-dark-tertiary cursor-pointer text-gray-800 dark:text-gray-100"
                  }`}
                  onClick={() => !isDisabled && handleDateClick(day)}
                  style={{ fontSize: "1rem" }}
                >
                  {day ? (
                    <Typography className="text-center m-0 font-medium">
                      {day.date()}
                    </Typography>
                  ) : null}
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Events Section */}
      <div ref={eventRef} className={`w-full lg:w-2/5 ${hideEvents ? "hidden" : ""}`}>
        <Typography variant="h5" className="font-bold mb-4 text-gray-800 dark:text-dark-text-primary">
          {selectedDate
            ? `Слободни термини за ${selectedDate.format("DD MMM YYYY")}`
            : "Изберете датум"}
        </Typography>
        <List className="bg-white dark:bg-dark-secondary border border-gray-200 dark:border-gray-700 rounded-lg">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event, index) => (
              <ListItem
                key={index}
                onClick={() => setOpenModal(true)}
                className="flex justify-between items-start cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-tertiary "
              >
                <div>
                  <Typography variant="small" className="text-gray-500 dark:text-dark-text-secondary">
                    {selectedDate.format("dddd, MMM D")}
                  </Typography>
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
      </div>
      <ConfirmModal isOpen={openModal} setOpen={setOpenModal} />
    </div>
  );
};

export default Calendar;
