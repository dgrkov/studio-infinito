import React, { useState, useEffect } from "react";
import { List, ListItem, Typography } from "@material-tailwind/react";
import dayjs from "dayjs";
import "antd/dist/reset.css";
import UserModalDetails from "./UserModalDetails";
import FullScreenLoader from "../FullScrennLoader/FullScreenLoader";
import { Axios } from '../Axios';

const axios = new Axios();

export default function Reservations({ reservations = [] }) {
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRowClick = (reservation) => {
    if (isModalVisible) return;

    setSelectedReservation(reservation);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedReservation(null);
  };

  const parseReservationStatus = (status) => {
    switch (status) {
      case "pending":
        return "На чекање";
      case "confirmed":
        return "Одобрен";
      case "completed":
        return "Завршен";
      case "canceled":
        return "Откажан";
      default:
        return "На чекање";
    }
  }


  return (
    <div className={`w-full md:max-w-2xl mx-auto ${isModalVisible ? "pointer-events-none" : ""}`}>
      <div className="p-4 w-full bg-white rounded-lg border shadow-md sm:p-8 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
            Резервации
          </h3>
        </div>
        <List className={`bg-white dark:bg-dark-secondary border gap-4 border-gray-200 dark:border-gray-700 rounded-lg ${isModalVisible ? "pointer-events-none" : ""}`}>
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
                    <p className="text-sm text-start font-medium m-1 text-gray-900 truncate dark:text-white mb-2">
                      {reservation.name} - {reservation.service}
                    </p>
                    <div className="w-full flex justify-between items-center">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        <p className="mb-1">{reservation.date}</p>
                        <p>{reservation.time}</p>
                      </div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mr-2">
                        {parseReservationStatus(reservation.status)}
                      </p>
                    </div>
                  </div>
                </div>
              </ListItem>
            ))
          ) : (
            <Typography variant="paragraph" className="text-gray-500 dark:text-dark-text-secondary p-4">
                Немате направено резервации. <br/> Кликнете <a className="underline text-blue-200" href="/home" >тука</a> за да направите резервација.
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
