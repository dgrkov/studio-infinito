import React from "react";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import Reservations from "./UserReservations";

import "./UserProfile.css";

function UserProfile() {
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
                  Никола Петровски
                </Typography>
                <Typography
                  variant="small"
                  className="font-normal text-gray-600 dark:text-dark-text-primary mb-0"
                >
                  nikola.petrovski@mail.com
                </Typography>
                <Typography
                  variant="small"
                  className="font-normal dark:text-dark-text-primary text-gray-600"
                >
                  +389 71 326 943
                </Typography>
              </div>
            </div>
          </div>
          <div className="mt-10" >
            <Reservations />
          </div>
          {/* <Typography
            variant="small"
            className="font-normal text-gray-600 mt-6"
          >
            Passionate UI/UX designer focused on creating intuitive and engaging
            digital experiences. <br /> Driven by design thinking, creativity,
            and a love for problem-solving.
          </Typography> */}
        </CardBody>
      </Card>
    </section>
  );
}

export default UserProfile;
