import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import FullScreenLoader from "../FullScrennLoader/FullScreenLoader";
import Notification from "../Home/Notification";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { Axios } from "../Axios";
import { notification } from "antd";

const axios = new Axios();

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message_response, setMessage_response] = useState({
    message: "",
    type: "",
    head_message: ""
  });

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "phone") {
      value = value.replace(/\D/g, "");
      if (value.length > 8) value = value.slice(0, 6);
    }

    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors({ ...errors, [name]: "" });
  };

  useEffect( () => {

    if (message_response.message !== "") {
      setTimeout(() => {
        setMessage_response({message: "", type: "", head_message: ""});
      }, 3000);
    }

  }, [message_response]);

  const validateForm = () => {
    let newErrors = {};

    if (!formData.firstname) newErrors.firstname = "Име е задолжително.";
    if (!formData.lastname) newErrors.lastname = "Презиме е задолжително.";
    if (formData.email !== "" && !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)){
      newErrors.email = "Невалидна емаил адреса.";
    }

    if (!formData.phone) {
      newErrors.phone = "Телефонскиот број е задолжителен.";
    } else if (formData.phone.length !== 8) {
      newErrors.phone = "Внесете точно 8 цифри по +389.";
    }

    if (!formData.password) {
      newErrors.password = "Пасвордот е задолжителен.";
    } else if (!/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/.test(formData.password)) {
      newErrors.password =
        "Пасвордот мора да има најмалку 8 карактери, вклучувајќи букви и броеви.";
    }    

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Потврди пасворд е задолжително.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Пасвордите не се совпаѓаат.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    const formattedData = {
      ...formData,
      phone: `+389${formData.phone}`,
    };
  

    axios.register("Auth/register", formattedData)
    .then((res) => {
      if (res.status === 200) {
        setMessage_response({message: res.data.message, type: res.data.status});
        if (res.data.status === "success") {
          setMessage_response({message: res.data.message, type: res.data.status});
          setTimeout(() => {
            setLoading(false);
            window.location.href = "/";
          }, 3000);
        }else{
          setLoading(false);
          setMessage_response({message: res.data.message, type: res.data.status});
        }
      }
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => setLoading(false));

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="mt-[2rem] overflow-auto flex items-start justify-center min-h-screen bg-gray-100 dark:bg-dark-primary">
      {message_response.message && <Notification message={message_response.message} type={message_response.type} head_message={message_response.head_message} />}
      <Card
        shadow={true}
        className="p-8 w-full max-w-md dark:bg-dark-secondary animate-fade-in-down"
      >
        <Typography
          variant="h4"
          className="text-center text-gray-900 dark:text-dark-text-primary"
        >
          Направи нов профил
        </Typography>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {[{ name: "firstname", label: "Име", type: "text" },
            { name: "lastname", label: "Презиме", type: "text" },
            { name: "email", label: "Пошта", type: "email" }
          ].map(({ name, label, type }, index) => (
            <div key={index}>
              <Typography
                variant="h6"
                className="text-gray-900 dark:text-dark-text-primary"
              >
                {label}
              </Typography>
              <Input
                name={name}
                type={type}
                size="lg"
                placeholder={`Внесете ${label}`}
                className={`border-gray-300 dark:border-dark-border focus:border-gray-900 dark:focus:border-dark-border-light text-gray-900 dark:text-dark-text-primary dark:bg-dark-secondary ${
                  errors[name] ? "border-red-500" : ""
                }`}
                value={formData[name]}
                onChange={handleChange}
              />
              {errors[name] && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm text-red-500 mt-1"
                >
                  {errors[name]}
                </motion.p>
              )}
            </div>
          ))}
        <div className="relative flex flex-col w-full">
        <Typography
            variant="h6"
            className="text-gray-900 dark:text-dark-text-primary mb-2"
        >
            Телефонски број
        </Typography>

        <div className="relative flex w-full">
          <div className="flex items-center bg-blue-gray-500/10 rounded-l-md px-3">
            <span className="text-blue-gray-700">+389</span>
          </div>
          <Input
            name="phone"
            type="tel"
            placeholder="Mobile Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full py-3 !rounded-l-none"
          />
        </div>

        {/* Error message */}
        <div className="mt-1">
            {errors.phone && (
            <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-sm text-red-500"
            >
                {errors.phone}
            </motion.p>
            )}
        </div>
        </div>

        {/* Password Input with Eye Icon */}
        {[{ name: "password", label: "Пасворд", type: showPassword ? "text" : "password" },
        { name: "confirmPassword", label: "Потврди пасворд", type: showConfirmPassword ? "text" : "password" },
        ].map(({ name, label, type }, index) => (
          <div className="mb-3 relative" key={index}>
            <Typography
              variant="h6" 
              className="text-gray-900 dark:text-dark-text-primary"
            >
              {label}
            </Typography>
            <div className="relative">
              <Input
                name={name}
                type={type}
                size="lg"
                placeholder={`Внесете ${label}`}
                className={`border-gray-300 dark:border-dark-border focus:border-gray-900 dark:focus:border-dark-border-light text-gray-900 dark:text-dark-text-primary dark:bg-dark-secondary ${
                  errors[name] ? "border-red-500" : ""
                }`}
                value={formData[name]}
                onChange={handleChange}
                icon={
                  <div 
                    className="cursor-pointer" 
                    onClick={(e) => {
                      e.stopPropagation();
                      name === "password" 
                        ? setShowPassword(!showPassword) 
                        : setShowConfirmPassword(!showConfirmPassword);
                    }}
                  >
                    {name === "password" 
                      ? (showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />)
                      : (showConfirmPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />)
                    }
                  </div>
                }
              />
            </div>
            {errors[name] && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-sm text-red-500 mt-1"
              >
                {errors[name]}
              </motion.p>
            )}
          </div>
        ))}
          <Button
            type="submit"
            className="mt-4 bg-gray-700 dark:bg-dark-button-primary hover:bg-gray-900 dark:hover:bg-dark-button-hover text-white"
            fullWidth
          >
            Регистрирај се
          </Button>
        </form>
      </Card>
      <FullScreenLoader loading={loading} />
    </div>
  );
};

export default RegisterForm;
