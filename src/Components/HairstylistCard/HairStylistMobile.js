"use client";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./HairstylistMobile.css"

import * as React from "react";
import { Navigation, Pagination } from "swiper/modules";
import { IconButton } from "@material-tailwind/react";
import { NavArrowRight, NavArrowLeft } from "iconoir-react";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { Card, CardHeader, CardBody, Typography, Avatar } from "@material-tailwind/react";

function CustomNavigation() {
  const swiper = useSwiper();

  return (
    <>
      <IconButton
        isCircular
        size="lg"
        variant="ghost"
        color="secondary"
        onClick={() => swiper.slidePrev()}
        className="dark !absolute left-2 top-1/2 z-10 -translate-y-1/2"
      >
        <NavArrowLeft className="h-7 w-7 -translate-x-0.5 stroke-2" />
      </IconButton>

      <IconButton
        isCircular
        size="lg"
        variant="ghost"
        color="secondary"
        onClick={() => swiper.slideNext()}
        className="dark !absolute right-2 top-1/2 z-10 -translate-y-1/2"
      >
        <NavArrowRight className="h-7 w-7 translate-x-px stroke-2" />
      </IconButton>
    </>
  );
}

function customPagination(_, className) {
  return `<span class="${className} w-4 h-4 [&.swiper-pagination-bullet-active]:!opacity-100 [&.swiper-pagination-bullet-active]:[background:rgb(var(--color-background))] !opacity-50 ![background:rgb(var(--color-background))]"></span>`;
}

export default function HairstylistCarousel({ employee, onCardClick }) {

  const handleCardClick = (hairstylist) => {
    if (onCardClick) {
      onCardClick(hairstylist);
    }
  };

  return (
    <div className="flex justify-center items-center h-[70dvh] w-full">
      <Swiper
        pagination={{
          enabled: true,
          clickable: true,
          dynamicBullets: true,
          renderBullet: customPagination,
        }}
        modules={[Navigation, Pagination]}
        className="relative rounded-lg h-full w-full max-w-[28rem]"
      >
        {employee.map((hairstylist, index) => (
          <SwiperSlide key={index} className="select-none h-full">
            <Card
              shadow={false}
              className="relative grid h-full w-full max-w-[28rem] items-end justify-center overflow-hidden text-center"
              onClick={() => handleCardClick(hairstylist)}
            >
              <CardHeader
                floated={false}
                shadow={false}
                color="transparent"
                className="absolute inset-0 m-0 rounded-none bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1552960562-daf630e9278b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80')`,
                }}
              >
                <div className="to-bg-black-10 absolute inset-0 h-full w-full bg-gradient-to-t from-black/80 via-black/50" />
              </CardHeader>
              <CardBody className="relative py-20 px-6 md:px-12">
                <Typography
                  variant="h2"
                  color="white"
                  className="mb-6 font-medium leading-[1.5]"
                >
                  {hairstylist}
                </Typography>
                <Typography variant="h5" className="mb-4 text-gray-400">
                  {hairstylist.role} MOBILE CARD
                </Typography>
                <Avatar
                  size="xl"
                  variant="circular"
                  alt={hairstylist}
                  className="border-2 border-white"
                  src={hairstylist.avatar}
                />
              </CardBody>
            </Card>
          </SwiperSlide>
        ))}
        <CustomNavigation />
      </Swiper>
    </div>
  );
}
