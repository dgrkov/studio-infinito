import React from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

export default function UserModalDetails({ isOpen, reservation, onClose }) {
  return (
    <Dialog open={isOpen} handler={onClose}>
      <DialogHeader>Reservation Details</DialogHeader>
      <DialogBody>
        <div className="flex items-center space-x-4">
          <img
            className="w-12 h-12 rounded-full"
            src={reservation.image}
            alt={`${reservation.name} image`}
          />
          <div>
            <h3 className="text-lg font-bold">{reservation.name}</h3>
            <p className="text-sm text-gray-500">{reservation.email}</p>
            <p className="text-sm text-gray-700">Time: {reservation.time}</p>
          </div>
        </div>
      </DialogBody>
      <DialogFooter>
        <Button variant="outlined" fullWidth color="red" onClick={onClose}>
          <span>Откажи термин</span>
        </Button>
        <Button fullWidth color="black" onClick={onClose} className="mt-5">
          <span>Затвори</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
