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
import { Axios } from "../Axios";

const axios = new Axios();

export function FastBookingModal({ isOpen, onClose, onSubmit }) {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(isOpen);
  const [data, setData] = React.useState({ appointmentDto: {
    hairstylist: {},
    serviceType: {}
  }});
  const [loading, setLoading] = React.useState(false);
  const [services, setServices] = React.useState([]);

  useEffect(() => {
    axios.get(`Appointments/get-services`).then((res) => {
      if (res.status === 200) {
        setServices(res.data);
      }
    });

    setOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  const handleSubmit = () => {
    setLoading(true);
  
    const requestData = {
      hairstylist: {
        hairstylist_id: data.appointmentDto.hairstylist.hairstylist_id,
        hairstylist: data.appointmentDto.hairstylist.hairstylist
      },
      serviceType: {
        key: data.appointmentDto.serviceType.key,
        service_id: data.appointmentDto.serviceType.service_id,
        name: data.appointmentDto.serviceType.name,
        description: data.appointmentDto.serviceType.description,
        price: data.appointmentDto.serviceType.price,
        duration: data.appointmentDto.serviceType.duration
      },
      page_number: 1,
      page_size: 20
    };
  
    axios.post(`Appointments/fast-booking`, requestData).then((res) => {
      if (res.status === 200) {
        onSubmit(data);
        handleClose();
        setLoading(false);
        const appointments = res.data;
        navigate("/fast-booking", { state: { data: { appointments, requestData }} });
      }
    });
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
            onChange={(value) => {
              const selectedHairstylist = value === "1" ? "Александар" : "Марина"; // Map the value to name
              setData({
                ...data,
                appointmentDto: {
                  ...data.appointmentDto,
                  hairstylist: {
                    hairstylist_id: value,
                    hairstylist: selectedHairstylist
                  }
                }
              });
            }}
            label="Избери вработен"
            className="dark:text-dark-text-primary"
          >
            <Option value="1">Александар</Option>
            <Option value="2">Марина</Option>
          </Select>
        </div>
        <div className="w-full">
          <Select
            disabled={!data.appointmentDto.hairstylist}
            onChange={(value) => {
              const selectedService = services.find(
                (service) => service.service_id === parseInt(value)
              );
              setData({
                ...data,
                appointmentDto: {
                  ...data.appointmentDto,
                  serviceType: selectedService
                }
              });
            }}
            label="Избери услуга"
            className="dark:text-dark-text-primary disabled:bg-gray-100 dark:disabled:bg-dark-secondary"
            labelProps={{
              className: "disabled:text-gray-400 dark:disabled:text-dark-text-secondary"
            }}
          >
            {services.map((service) => (
              <Option key={service.service_id} value={service.service_id}>
                {service.name}
              </Option>
            ))}
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
          onClick={handleSubmit}
          disabled={!data.appointmentDto.hairstylist || !data.appointmentDto.serviceType?.service_id}
          className=" dark:bg-dark-button-primary text-white dark:text-dark-text-primary"
        >
          <span>Потврди</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
