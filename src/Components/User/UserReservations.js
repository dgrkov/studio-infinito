import React, { useState } from "react";
import { List, ListItem, Typography } from "@material-tailwind/react";
import dayjs from "dayjs";
import "antd/dist/reset.css";
import UserModalDetails from "./UserModalDetails";
import FullScreenLoader from "../FullScrennLoader/FullScreenLoader";

export default function Reservations() {
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const reservations = [
    {
      id: 1,
      name: "Neil Sims",
      date: "2023-10-01",
      time: "16:00 - 17:00",
      image: "https://flowbite.com/docs/images/people/profile-picture-1.jpg",
    },
    {
      id: 2,
      name: "Neil Sims",
      date: "2023-10-02",
      time: "17:00 - 18:00",
      image: "https://flowbite.com/docs/images/people/profile-picture-1.jpg",
    },
    {
      id: 3,
      name: "Bonnie Green",
      date: "2023-10-01",
      time: "18:00 - 19:00",
      image: "https://flowbite.com/docs/images/people/profile-picture-3.jpg",
    },
    {
      id: 4,
      name: "Bonnie Green",
      date: "2023-10-03",
      time: "19:00 - 20:00",
      image: "https://flowbite.com/docs/images/people/profile-picture-3.jpg",
    },
    {
      id: 5,
      name: "Michael Gough",
      date: "2023-10-01",
      time: "20:00 - 21:00",
      image: "https://flowbite.com/docs/images/people/profile-picture-2.jpg",
    },
  ];

  const handleRowClick = (reservation) => {
    setSelectedReservation(reservation);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedReservation(null);
  };

  const dateChange = (date, dateString) => {
    console.log(dateString);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="w-full md:max-w-2xl mx-auto">
      <div className="p-4 w-full bg-white rounded-lg border shadow-md sm:p-8 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
            Резервации
          </h3>
          <input
            class="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-1/2 h-10 focus:border-gray-700 focus:ring-2 focus:ring-gray-700"
            type="date"
            id="dob"
          />
          {/* <DatePicker
            onChange={dateChange}
            prevIcon={<LeftOutlined />}
            nextIcon={<RightOutlined />}
            defaultValue={dayjs(today, "DD/MM/YYYY")}
            format={"DD/MM/YYYY"}
          /> */}
        </div>
        <List className="bg-white dark:bg-dark-secondary border gap-4 border-gray-200 dark:border-gray-700 rounded-lg">
          {reservations.length > 0 ? (
            reservations.map((reservation) => (
              <ListItem
                key={reservation.id}
                onClick={() => handleRowClick(reservation)}
                className="flex border border-gray-200 dark:border-gray-700 justify-between items-start cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-tertiary"
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className="flex-shrink-0">
                    <img
                      className="w-8 h-8 rounded-full"
                      src={reservation.image}
                      alt={`${reservation.name}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-start font-medium m-1 text-gray-900 truncate dark:text-white">
                      {reservation.name}
                    </p>
                    <p className="text-sm text-start text-gray-500 truncate dark:text-gray-400">
                      {reservation.date}
                    </p>
                  </div>
                </div>
                  <div className="inline-flex items-center justify-center text-base font-semibold text-gray-900 dark:text-white">
                    {reservation.time}
                  </div>
              </ListItem>
            ))
          ) : (
            <Typography variant="paragraph" className="text-gray-500 dark:text-dark-text-secondary p-4">
              Нема слободни термини.
            </Typography>
          )}
        </List>
      </div>
      {selectedReservation && (
        <UserModalDetails
          isOpen={isModalVisible}
          reservation={selectedReservation}
          onClose={handleCloseModal}
        />
      )}
      <FullScreenLoader loading={loading} />
    </div>
  );
}
