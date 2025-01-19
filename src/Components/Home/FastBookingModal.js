import React, { useEffect } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Select,
  Option
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import FullScreenLoader from "../FullScrennLoader/FullScreenLoader";

export function FastBookingModal({ isOpen, onClose, onSubmit }) {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(isOpen);
  const [data, setData] = React.useState({
    worker: "",
    service: ""
  });
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setOpen(false);
    setData({ worker: "", service: "" });
    onClose();
  };

  const handleSubmit = () => {
    setLoading(true);
    setTimeout( () => {
        onSubmit(data);
        handleClose();
        setLoading(false);
        navigate("/fast-booking", { state: { data } });
    }, 1000);
  };

  return (
    <Dialog 
      open={open} 
      handler={handleClose}
      className="bg-white dark:bg-dark-primary"
    >
        <FullScreenLoader loading={loading} />
      <DialogHeader className="text-gray-800 dark:text-dark-text-primary">
        Најди најбрз термин
      </DialogHeader>
      <DialogBody className="flex flex-col gap-4">
        <div className="w-full">
          <Select
            onChange={(value) => setData({ ...data, worker: value })}
            label="Избери вработен"
            className="dark:text-dark-text-primary"
          >
            <Option value="Александар">Александар</Option>
            <Option value="Марина">Марина</Option>
          </Select>
        </div>
        <div className="w-full">
          <Select
            disabled={!data.worker}
            onChange={(value) => setData({ ...data, service: value })}
            label="Избери услуга"
            className="dark:text-dark-text-primary disabled:bg-gray-100 dark:disabled:bg-dark-secondary"
            labelProps={{
              className: "disabled:text-gray-400 dark:disabled:text-dark-text-secondary"
            }}
          >
            <Option value="шишање">Шишање</Option>
            <Option value="бричење">Бричење</Option>
            <Option value="фарбање">Фарбање</Option>
          </Select>
        </div>
      </DialogBody>
      <DialogFooter className="flex flex-col gap-4 border-t border-gray-200 dark:border-dark-border-light">
        <Button
          fullWidth
          variant="outlined"
          color="red"
          onClick={handleClose}
          className="text-gray-800 dark:text-dark-text-primary"
        >
          <span>Откажи</span>
        </Button>
        <Button 
          fullWidth
          variant="gradient" 
          onClick={handleSubmit}
          disabled={!data.worker || !data.service}
          className="bg-gray-800 dark:bg-dark-accent-primary text-white dark:text-dark-text-primary"
        >
          <span>Потврди</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
