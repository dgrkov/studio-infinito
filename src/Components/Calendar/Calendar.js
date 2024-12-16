import React, { useState, useEffect } from "react";
import { Typography, Button, Card } from "@material-tailwind/react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  isBefore,
  isToday,
  addMinutes,
} from "date-fns";

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [showTimeSlots, setShowTimeSlots] = useState(false);

  const startDate = startOfWeek(startOfMonth(currentMonth));
  const endDate = endOfWeek(endOfMonth(currentMonth));
  const today = new Date();

  const handlePrevMonth = () => setCurrentMonth(addDays(startDate, -1));
  const handleNextMonth = () => setCurrentMonth(addDays(endDate, 1));
  const handleDateClick = (day) => {
    if (!isBefore(day, today) && format(day, "eeee") !== "Monday") {
      setSelectedDate(day);
      setSelectedTime(null);
      setShowTimeSlots(true); // Show time slots when a date is clicked
    }
  };

  const generateCalendar = () => {
    const days = [];
    let day = startDate;
    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  };

  const generateTimeSlots = () => {
    const slots = [];
    let time = new Date(selectedDate.setHours(9, 0, 0, 0));
    const endTime = new Date(selectedDate.setHours(18, 0, 0, 0));

    while (time <= endTime) {
      slots.push(new Date(time));
      time = addMinutes(time, 30);
    }
    return slots;
  };

  const renderCells = () => {
    const days = generateCalendar();

    return (
      <div className="grid grid-cols-7 gap-1 sm:3/5 lg:h-3/5">
        {days.map((day, index) => (
          <Button
            key={index}
            onClick={() => handleDateClick(day)}
            color={
              format(day, "eeee") === "Monday"
                ? "red"
                : isSameDay(day, selectedDate)
                ? "blue"
                : isSameMonth(day, currentMonth)
                ? "gray"
                : "light"
            }
            disabled={isBefore(day, today) || format(day, "eeee") === "Monday"}
            className={`h-12 w-12 flex items-center justify-center transition-all duration-200 transform hover:scale-105 ${
              isSameDay(day, selectedDate)
                ? "text-white"
                : isSameMonth(day, currentMonth)
                ? ""
                : "bg-gray-800"
            }`}
          >
            {format(day, "d")}
          </Button>
        ))}
      </div>
    );
  };

  const renderTimeSlots = () => {
    const timeSlots = generateTimeSlots();

    return (
      <div
        className={`grid grid-cols-4 gap-2 mt-4 transition-all duration-500 ${
          showTimeSlots ? "opacity-100 max-h-screen" : "opacity-0 max-h-0"
        }`}
      >
        {timeSlots.map((time, index) => (
          <Button
            key={index}
            onClick={() => setSelectedTime(time)}
            color={isSameDay(selectedTime, time) ? "blue" : "gray"}
            className={`h-10 flex items-center justify-center transition-all duration-200 transform hover:scale-105 ${
              isSameDay(selectedTime, time) ? "text-white" : ""
            }`}
          >
            {format(time, "HH:mm")}
          </Button>
        ))}
      </div>
    );
  };

  return (
    <div id="calendar" className="p-5 max-w-lg mx-auto shadow-md">
      <div className="flex items-center justify-between mb-4">
        <Button onClick={handlePrevMonth} color="gray">
          Prev
        </Button>
        <Typography variant="h6">{format(currentMonth, "MMMM yyyy")}</Typography>
        <Button onClick={handleNextMonth} color="gray">
          Next
        </Button>
      </div>
      <div className="grid grid-cols-7 text-center mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
          <Typography key={index} className="font-semibold">
            {day}
          </Typography>
        ))}
      </div>
      {renderCells()}
      {isSameMonth(selectedDate, currentMonth) && renderTimeSlots()}
    </div>
  );
}
