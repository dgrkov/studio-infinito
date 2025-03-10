import { useState } from "react";
import { motion } from "framer-motion";
import { useCountries } from "use-react-countries";
import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import FullScreenLoader from "../FullScrennLoader/FullScreenLoader";

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
  const { countries } = useCountries();

  const [country, setCountry] = useState(countries.findIndex(c => c.countryCallingCode === "+389"));
  
  const { name, flags, countryCallingCode } = countries[country];

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "phone") {
      value = value.replace(/\D/g, "");
      if (value.length > 6) value = value.slice(0, 6);
    }

    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.firstname) newErrors.firstname = "Име е задолжително.";
    if (!formData.lastname) newErrors.lastname = "Презиме е задолжително.";
    if (formData.email !== "" && !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)){
      newErrors.email = "Невалидна емаил адреса.";
    }

    if (!formData.phone) {
      newErrors.phone = "Телефонскиот број е задолжителен.";
    } else if (formData.phone.length !== 6) {
      newErrors.phone = "Внесете точно 6 цифри по +389.";
    }

    if (!formData.password) {
      newErrors.password = "Пасвордот е задолжителен.";
    } else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(formData.password)) {
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
    console.log("Form Data:", { ...formData, phone: `+389${formData.phone}` });

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="mt-[2rem] overflow-auto flex items-start justify-center min-h-screen bg-gray-100 dark:bg-dark-primary">
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
            <Menu placement="bottom-start">
            <MenuHandler>
                <Button
                ripple={false}
                variant="text"
                color="blue-gray"
                className="flex h-10 items-center gap-2 rounded-r-none border border-r-0 border-blue-gray-200 bg-blue-gray-500/10 pl-3"
                >
                <img
                    src={flags.svg}
                    alt={name}
                    className="h-4 w-4 rounded-full object-cover"
                />
                {countryCallingCode}
                </Button>
            </MenuHandler>
            <MenuList className="max-h-[20rem] max-w-[18rem] text-sm">
                {countries.map(({ name, flags, countryCallingCode }, index) => {
                return (
                    <MenuItem
                    key={name}
                    value={name}
                    className="flex items-center gap-2"
                    onClick={() => setCountry(index)}
                    >
                    <img
                        src={flags.svg}
                        alt={name}
                        className="h-5 w-5 rounded-full object-cover"
                    />
                    {name} <span className="ml-auto">{countryCallingCode}</span>
                    </MenuItem>
                );
                })}
            </MenuList>
            </Menu>

            <Input
                name="phone"
                type="tel"
                placeholder="Mobile Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded-l-none py-3"
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
          {[{ name: "password", label: "Пасворд", type: "password" },
            { name: "confirmPassword", label: "Потврди пасворд", type: "password" },
          ].map(({ name, label, type }, index) => (
            <div className="mb-3" key={index}>
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
          <Checkbox
            label={
              <Typography
                variant="small"
                className="text-gray-700 dark:text-dark-text-secondary"
              >
                Се согласувам со{" "}
                <a
                  href="#"
                  className="font-medium text-blue-600 hover:underline dark:text-dark-accent-primary"
                >
                  Условите и правилата
                </a>
              </Typography>
            }
          />
          <Button
            type="submit"
            className="mt-4 bg-gray-700 dark:bg-dark-button-primary hover:bg-gray-900 dark:hover:bg-dark-button-hover text-white"
            fullWidth
          >
            Регистрирај се
          </Button>
        </form>
        {/* <Typography className="mt-4 text-center text-gray-700 dark:text-dark-text-secondary">
          Веќе имате профил?{" "}
          <a
            href="#"
            className="font-medium text-blue-600 hover:underline dark:text-dark-accent-primary"
          >
            Најави се
          </a>
        </Typography> */}
      </Card>
      <FullScreenLoader loading={loading} />
    </div>
  );
};

export default RegisterForm;
