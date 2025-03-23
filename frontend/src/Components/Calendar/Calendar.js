import React, { useState, useRef, useEffect } from "react";
import { Typography, Button, Card, List, ListItem } from "@material-tailwind/react";
import { ConfirmModal } from "./ConfirmModal";
import FullScreenLoader from "../FullScrennLoader/FullScreenLoader";
import dayjs from "dayjs";

import { Axios } from "../Axios";

const axios = new Axios();

const Calendar = ({ appointmentData }) => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [hideEvents, setHideEvents] = useState(true);
  const eventRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [availableDates, setAvailableDates] = useState([])
  const [filteredEvents, setfilteredEvents] = useState([])
  const [event_information, setEventInformation] = useState({});

  const generateEvents = (date, availableTimeslots) => {
    const events = [];
    
    availableTimeslots.forEach((slot, index) => {
      const startTime = slot.slot_time;
      const endTime = availableTimeslots[index + 1]?.slot_time || startTime;
      
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
    axios.get(`Calendar/available-dates?year=${currentDate.year()}&month=${currentDate.month() + 1}&hairstylist_id=${appointmentData?.hairstylist?.hairstylist_id}&service_id=${appointmentData?.serviceType?.service_id}`).then((res) => {
      if (res.status === 200) {
          setAvailableDates(res.data);
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
    console.log("Called date click");
    console.log(date);
    setLoading(true);
    setHideEvents(false);
    axios.get(`Calendar/available-timeslots/${date.format("YYYY-MM-DD")}/${appointmentData?.serviceType?.duration || 30}/${appointmentData?.hairstylist?.hairstylist_id}`).then((res) => {
      if (res.status === 200) {
        const availableTimeslots = res.data;
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

  const handleEventClick = (event) => {
    setEventInformation(prevState => ({
        ...prevState, 
        event,
        appointmentData
    }));

    setOpenModal(true);
  };

  const groupEventsByTimePeriod = (events) => {
    return events.reduce((acc, event) => {
      const [hours, minutes] = event.time.split(':').map(Number);
      const totalMinutes = hours * 60 + minutes;
      const category = totalMinutes <= 780 ? 'morning' : 'evening'; // 780 minutes = 13:00
      
      if (!acc[category]) acc[category] = [];
      acc[category].push(event);
      return acc;
    }, { morning: [], evening: [] });
  };

  const groupedEvents = groupEventsByTimePeriod(filteredEvents);

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
            {["S", "M", "T", "W", "T", "F", "S"].map((day, _i) => (
              <Typography
                key={_i}
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

        <div className="space-y-6">
          {filteredEvents.length === 0 ? (
            <Typography variant="paragraph" className="text-gray-500 dark:text-dark-text-secondary p-4">
              Нема слободни термини.
            </Typography>
          ) : (
            Object.entries(groupedEvents).map(([category, events]) => 
              events.length > 0 && (
                <div key={category}>
                  <Typography variant="h6" className="text-gray-800 dark:text-dark-text-primary mb-4 capitalize">
                    {category === 'morning' ? 'Предпладне' : 'Попладне'}
                  </Typography>
                  <div className="grid grid-cols-3 gap-2">
                    {events.map((event, index) => (
                      <Button
                        key={index}
                        onClick={() => handleEventClick(event)}
                        className="text-center py-2 rounded-lg w-full bg-gray-100 hover:bg-gray-200 dark:bg-dark-tertiary dark:hover:bg-dark-hover text-gray-800 dark:text-dark-text-primary text-sm"
                      >
                        {dayjs(`${event.date.split("-").reverse().join("-")}T${event.time}`).format("HH:mm")}
                      </Button>
                    ))}
                  </div>
                </div>
              )
            )
          )}
        </div>
      </div>
      <ConfirmModal event_information={event_information} isOpen={openModal} setOpen={setOpenModal} handleDateClick={handleDateClick}  />
    </div>
  );
};

export default Calendar;
