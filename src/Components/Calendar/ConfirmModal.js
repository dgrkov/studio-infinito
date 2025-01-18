import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter, Typography } from "@material-tailwind/react";
import { tr } from "date-fns/locale";
import FullScreenLoader from "../FullScrennLoader/FullScreenLoader";

export function ConfirmModal({ isOpen, setOpen }) {
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen, setOpen]);
  const navigate = useNavigate();

  const handleClose = () => {
    setOpen(false);
  }

  const handleConfirm = () => {
    setLoading(true);
    setTimeout( () => {
        navigate("/home", { state: { head_message: "Резервацијата е успешна", message: "Успешно резервираште на 01.01.2023 од 15:00", type: "success" } });
        setOpen(false);
    }, 1500)
  }

  return (
    <Dialog open={isOpen} handler={handleClose}>
      <DialogHeader>
        <Typography variant="h5" color="blue-gray">
          Потврда на термин
        </Typography>
      </DialogHeader>
      <DialogBody divider className="grid place-items-center gap-4">
        <div className="flex justify-between items-center w-full py-2 border-b-2 border-gray-200">
            <p className="text-gray-400 ml-4">Одбран вработен</p>
            <p className="text-black mr-4">Александар</p>
        </div>
        <div className="flex justify-between items-center w-full py-2 border-b-2 border-gray-200">
            <p className="text-gray-400 ml-4">Одбрана услуга</p>
            <p className="text-black mr-4">Шишање</p>
        </div>
        <div className="flex justify-between items-center w-full py-2 border-b-2 border-gray-200">
            <p className="text-gray-400 ml-4">Датум</p>
            <p className="text-black mr-4">01.01.2023</p>
        </div>
        <div className="flex justify-between items-center w-full py-2 border-b-2 border-gray-200">
            <p className="text-gray-400 ml-4">Време</p>
            <p className="text-black mr-4">15:00 - 15:30</p>
        </div>
        <div className="flex justify-between items-center w-full py-2">
            <p className="text-gray-400 ml-4">Цена</p>
            <p className="text-indigo-600 mr-4">400 МКД</p>
        </div>
      </DialogBody>
      <DialogFooter className="flex flex-row w-full justify-center gap-5">
        <Button disabled={loading} variant="text" fullWidth color="blue-gray" onClick={handleClose}>
            Откажи
        </Button>
        <div className={`text-center flex justify-center w-full`}>
          <Button
            onClick={handleConfirm}
            fullWidth
            loading={loading}
          >
              Резервирај
          </Button>
      </div>
      </DialogFooter>
      <FullScreenLoader loading={loading} />
    </Dialog>
  );
}
