import React, { useState, useRef } from "react";
import { Typography, Button, Card, List, ListItem } from "@material-tailwind/react";

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState("January");
  const [nextMonth, setNextMonth] = useState("February");
  const daysOfWeek = ["M", "T", "W", "T", "F", "S", "S"];
  const [hideEvents, setHideEvents] = useState(true);
  const event_red = useRef(null)
  const [selectedDate, setSelectedDate] = useState('');

  const datesJanuary = Array.from({ length: 31 }, (_, i) => i + 1);
  const events = [
    { date: "Среда, Јан. 12", title: "Слободно", time: "12:00 - 12:30" },
    { date: "Среда, Јан. 12", title: "View house with real estate agent", time: "14:30 - 16:30" },
    { date: "Среда, Јан. 12", title: "Meeting with bank manager", time: "16:30 - 17:00" },
    { date: "Среда, Јан. 12", title: "Sign paperwork at lawyers", time: "17:30 - 18:00" },
  ];

  const handleDatePick = (event) => {
    setSelectedDate(event.target.innerText)
    setHideEvents(false);
    setTimeout( () => {
      event_red.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 300)
  }

  return (
    <div className="flex flex-col lg:flex-row lg:space-x-8 p-3 lg:p-8 space-y-8 lg:space-y-0">
      {/* Calendar Section */}
      <div className="w-full lg:w-2/3 space-y-8">
        {/* Calendar Header */}
        <div className="flex justify-between items-center">
          <Button size="sm" variant="text" onClick={() => console.log("Prev Month")}>
            &lt;
          </Button>
          <Typography variant="h4" className="text-gray-800">
            {currentMonth}
          </Typography>
          <Button size="sm" variant="text" onClick={() => console.log("Next Month")}>
            &gt;
          </Button>
        </div>

        {/* Calendar Grid */}
        <Card className="p-4">
          <div className="grid grid-cols-7 gap-2">
            {daysOfWeek.map((day) => (
              <Typography key={day} variant="small" className="text-center font-bold">
                {day}
              </Typography>
            ))}
            {datesJanuary.map((date, index) => (
              <div
                key={index}
                className={`flex items-center justify-center h-10 w-10 rounded-full ${
                  date === 12 ? "bg-blue-600 text-white" : "hover:bg-gray-200"
                } cursor-pointer`}
              >
                <Typography onClick={handleDatePick} >{date}</Typography>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Events Section */}
      <div ref={event_red} className={`w-full lg:w-1/3 ${hideEvents == true ? 'hidden' : ''}`}>
        <Typography variant="h5" className="font-bold mb-4">
          Слободни термини
        </Typography>
        <List>
          {events.map((event, index) => (
            <ListItem key={index} className="flex justify-between items-start">
              <div>
                <Typography variant="small" className="text-gray-500">
                  {event.date}
                </Typography>
                <Typography
                  variant="paragraph"
                  className={`${
                    event.time ? "font-bold" : "text-gray-500"
                  } text-sm`}
                >
                  {event.title}
                </Typography>
              </div>
              {event.time && (
                <Typography variant="small" className="text-gray-500">
                  {event.time}
                </Typography>
              )}
            </ListItem>
          ))}
        </List>
      </div>
    </div>
  );
};

export default Calendar;
