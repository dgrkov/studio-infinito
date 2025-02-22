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
    <Dialog open={isOpen} handler={handleClose} className="dark:bg-dark-secondary">
      <DialogHeader>
        <Typography variant="h5" className="text-gray-800 dark:text-dark-text-primary">
          Потврда на термин
        </Typography>
      </DialogHeader>
      <DialogBody divider className="grid place-items-center gap-2">
        <div className="flex justify-between items-center w-full border-b-2 border-gray-200 dark:border-dark-border">
            <p className="text-gray-400 dark:text-dark-text-muted ml-4">Одбран вработен</p>
            <p className="text-black dark:text-dark-text-primary mr-4">Александар</p>
        </div>
        <div className="flex justify-between items-center w-full border-b-2 border-gray-200 dark:border-dark-border">
            <p className="text-gray-400 dark:text-dark-text-muted ml-4">Одбрана услуга</p>
            <p className="text-black dark:text-dark-text-primary mr-4">Шишање</p>
        </div>
        <div className="flex justify-between items-center w-full border-b-2 border-gray-200 dark:border-dark-border">
            <p className="text-gray-400 dark:text-dark-text-muted ml-4">Датум</p>
            <p className="text-black dark:text-dark-text-primary mr-4">01.01.2023</p>
        </div>
        <div className="flex justify-between items-center w-full border-b-2 border-gray-200 dark:border-dark-border">
            <p className="text-gray-400 dark:text-dark-text-muted ml-4">Време</p>
            <p className="text-black dark:text-dark-text-primary mr-4">15:00 - 15:30</p>
        </div>
        <div className="flex justify-between items-center w-full">
            <p className="text-gray-400 dark:text-dark-text-muted ml-4">Цена</p>
            <p className="text-indigo-600 dark:text-dark-accent-primary mr-4">400 МКД</p>
        </div>
      </DialogBody>
      <DialogFooter className="flex flex-row w-full justify-center gap-5">
        <Button 
          variant="outlined" 
          disabled={loading} 
          fullWidth 
          className="text-red-500 border-red-500 dark:text-red-400 dark:border-red-400"
          onClick={handleClose}
        >
          Откажи
        </Button>
        <Button
          onClick={handleConfirm}
          fullWidth
          className="bg-dark-button-primary dark:hover:bg-dark-button-hover"
          loading={loading}
        >
          Резервирај
        </Button>
      </DialogFooter>
      <FullScreenLoader loading={loading} />
    </Dialog>
  );
}
