import React, { useState } from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import "antd/dist/reset.css";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import AdminModal from "./ModalDetails";
import "./Admin.css";
import FullScreenLoader from "../../FullScrennLoader/FullScreenLoader";

export default function Reservations() {
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const date = new Date();
  const today = dayjs(date).format("DD/MM/YYYY");

  const reservations = [
    {
      id: 1,
      name: "Neil Sims",
      email: "email@windster.com",
      time: "16:00 - 17:00",
      image: "https://flowbite.com/docs/images/people/profile-picture-1.jpg",
    },
    {
      id: 2,
      name: "Bonnie Green",
      email: "email@windster.com",
      time: "17:00 - 18:00",
      image: "https://flowbite.com/docs/images/people/profile-picture-3.jpg",
    },
    {
      id: 3,
      name: "Michael Gough",
      email: "email@windster.com",
      time: "18:00 - 19:00",
      image: "https://flowbite.com/docs/images/people/profile-picture-2.jpg",
    },
    {
      id: 4,
      name: "Lana Byrd",
      email: "email@windster.com",
      time: "19:00 - 20:00",
      image: "https://flowbite.com/docs/images/people/profile-picture-4.jpg",
    },
    {
      id: 5,
      name: "Thomas Lean",
      email: "email@windster.com",
      time: "20:00 - 21:00",
      image: "https://flowbite.com/docs/images/people/profile-picture-5.jpg",
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

    setTimeout( () => {
      setLoading(false);
    }, 1000)

  };

  return (
    <div className="w-full md:max-w-2xl mx-auto">
      <div className="p-4 w-full bg-white rounded-lg border shadow-md sm:p-8 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
            Резервации
          </h3>
          <DatePicker
            onChange={dateChange}
            prevIcon={<LeftOutlined />}
            nextIcon={<RightOutlined />}
            defaultValue={dayjs(today, "DD/MM/YYYY")}
            format={"DD/MM/YYYY"}
          />
        </div>
        <div className="flow-root">
          <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
            {reservations.map((reservation) => (
              <li
                key={reservation.id}
                className="py-3 sm:py-4 cursor-pointer"
                onClick={() => handleRowClick(reservation)}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <img
                      className="w-8 h-8 rounded-full"
                      src={reservation.image}
                      alt={`${reservation.name} image`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                      {reservation.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                      {reservation.email}
                    </p>
                  </div>
                  <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                    {reservation.time}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {selectedReservation && (
        <AdminModal
          isOpen={isModalVisible}
          reservation={selectedReservation}
          onClose={handleCloseModal}
        />
      )}
      <FullScreenLoader loading={loading} />
    </div>
  );
}
