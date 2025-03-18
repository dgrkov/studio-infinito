import React, { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import Reservations from "./UserReservations";
import dayjs from "dayjs";
import FullScreenLoader from "../FullScrennLoader/FullScreenLoader";
import { Axios } from "../Axios";
import { Cookie } from "../Cookie"

import "./UserProfile.css";

const axios = new Axios();
const cookie = new Cookie();

function UserProfile() {
  const [loading, setLoading] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [userDetails, setUserDetails] = useState({});

  function isEmptyObject(arg) {
    return typeof arg === 'object' && Object.keys(arg).length === 0;
  }

  useEffect(() => {
    setLoading(true);
    const user_id = cookie.getCookie("user_id");
    axios.post(`Appointments/user-appointments/${user_id}`)
      .then((resp) => {
        if (resp.status === 200) {
          if (resp.data.length === 0) return;


          setUserDetails({
            name: resp.data[0].full_name,
            email: resp.data[0].email,
            phone: resp.data[0].phone,
            image: "https://flowbite.com/docs/images/people/profile-picture-1.jpg", // Placeholder image
            });

          if (isEmptyObject(resp.data[0].appointment_id)) return;
          const mappedReservations = resp.data.map(item => ({
            id: item.appointment_id,
            name: item.full_name,
            date: dayjs(item.appointment_date).format("YYYY-MM-DD"),
            time: item.appointment_time,
            service: item.name,
            status: item.status,
            image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80", // Placeholder image
          }));
          setReservations(mappedReservations);
        }
      })
      .catch(error => console.error("Error fetching appointments:", error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="container mx-auto md:px-8 py-10">
      <Card shadow={false} className="border border-gray-300 dark:bg-gray-600 rounded-2xl">
        <CardHeader shadow={false} className="h-60 !rounded-lg overflow-hidden">
          <div
            id="user-image"
            className="w-full h-full object-cover object-center"
          ></div>
        </CardHeader>
        <CardBody>
          <div className="flex lg:gap-0 gap-6 flex-wrap justify-between items-center">
            <div className="flex items-center gap-3">
              <Avatar className="w-20 h-20" src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80" alt="avatar" variant="rounded" />
              <div className="mt-5">
                <Typography className="mb-0 dark:text-dark-text-primary" color="blue-gray" variant="h6">
                  {userDetails.name || ""}
                </Typography>
                <Typography
                  variant="small"
                  className="font-normal text-gray-600 dark:text-dark-text-primary mb-0"
                >
                  {userDetails.email || ""}
                </Typography>
                <Typography
                  variant="small"
                  className="font-normal dark:text-dark-text-primary text-gray-600"
                >
                  {userDetails.phone || ""}
                </Typography>
              </div>
            </div>
          </div>
          <div className="mt-10" >
            <Reservations reservations={reservations} />
          </div>
        </CardBody>
      </Card>
      <FullScreenLoader loading={loading} />
    </section>
  );
}

export default UserProfile;
