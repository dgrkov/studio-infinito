import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Avatar,
  Button,
} from "@material-tailwind/react";
import { useState } from "react";

import './ServiceCard.css'

export default function ServiceCardMobile(props) {
  const serviceTypes = props.serviceTypes;
  const handleWorkReq = props.handleWorkReq;

  return (
    <div className="p-5">
      {serviceTypes.map((serviceType) => (
        <Card
          color="transparent"
          shadow={false}
          className="w-full max-w-[26rem] mb-5 shadow-md p-5 relative z-10"
        >
          <CardHeader
            color="transparent"
            floated={false}
            shadow={false}
            className="mx-0 flex items-center gap-4 pt-0 pb-8"
          >
            <Avatar
              size="lg"
              variant="circular"
              src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
              alt="Александар"
            />
            <div className="flex w-full flex-col gap-0.5">
              <div className="flex items-center justify-between">
                <Typography variant="h5" color="blue-gray">
                  Александар
                </Typography>
                <div className="5 flex items-center gap-0">
                  <Typography>{serviceType.name}</Typography>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardBody className="mb-6 p-0">
            <div className="flex items-center justify-between">
              <div className="5 flex items-center gap-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20px"
                  height="20px"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12ZM3.00683 12C3.00683 16.9668 7.03321 20.9932 12 20.9932C16.9668 20.9932 20.9932 16.9668 20.9932 12C20.9932 7.03321 16.9668 3.00683 12 3.00683C7.03321 3.00683 3.00683 7.03321 3.00683 12Z"
                    fill="#0F0F0F"
                  />
                  <path
                    d="M12 5C11.4477 5 11 5.44771 11 6V12.4667C11 12.4667 11 12.7274 11.1267 12.9235C11.2115 13.0898 11.3437 13.2343 11.5174 13.3346L16.1372 16.0019C16.6155 16.278 17.2271 16.1141 17.5032 15.6358C17.7793 15.1575 17.6155 14.5459 17.1372 14.2698L13 11.8812V6C13 5.44772 12.5523 5 12 5Z"
                    fill="#0F0F0F"
                  />
                </svg>
                <Typography color="blue-gray" className="font-medium ml-3">
                  {serviceType.time}
                </Typography>
              </div>
              <Typography>{serviceType.price} ден.</Typography>
            </div>
          </CardBody>
          <CardFooter className="w-full flex justify-start p-0">
              <Button variant="text" className="flex items-end justify-end gap-2 w-full" onClick={handleWorkReq}>
                Одбери
                <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                />
              </svg>
              </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
