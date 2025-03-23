import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Input, Button, Tooltip } from "@material-tailwind/react";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/solid";
import FullScreenLoader from "../FullScrennLoader/FullScreenLoader";
import Recaptcha from "./Recaptcha";
import { Axios } from "../Axios";
import Notification from "../Home/Notification";
import { Cookie } from "../Cookie";

const axios = new Axios();
const cookie = new Cookie();

export default function Auth() {
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisiblity = () => setPasswordShown((cur) => !cur);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notification, setNotification] = useState({
    message : "",
    type : "",
  });
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  useEffect( () => {
    if (isTooltipOpen) {
      setTimeout(() => {
        setIsTooltipOpen(false);
      }, 5000);
    }
  }, [isTooltipOpen])

  useEffect( () => {
    if (cookie.getCookie("access_token")) {
      navigate("/home");
    }
  })

  const handleAuth = async () => {
    setLoading(true);
  
    const body = {
      EmailOrPhone: email,
      Password: password,
      rememberMe: true,
      firebase_token: localStorage.getItem("firebase_token") || '',
    };
  
    axios.login("Auth/login", body)
      .then((res) => {

        if (res.status === 200 && res.data.status === 'success') {
          const parsedData = JSON.parse(res.data.message);
          cookie.setCookie("access_token", parsedData.access_token, parsedData.valid_to);
          cookie.setCookie("user_id", parsedData.user_id, parsedData.valid_to);
  
          axios.setAccessToken(parsedData.access_token);

          setNotification({
            message: 'Успешна најава.',
            type: res.data.status,
          })

          setLoading(false);
          setTimeout( () => {
            navigate("/home");
          }, 700)
        } else {
          setIsTooltipOpen(true);
          setNotification({
            message: res.data.message,
            type: res.data.status,
          })
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Login Error:", err);
        setLoading(false);
        setNotification({
          message: 'Настана грешка при најава. Ве молиме обидете се повторно.',
          type: 'error',
        })
      });
  };
  

  return (
    <section className="grid text-center h-[90dvh] items-center p-8 dark:bg-dark-primary">
      {notification.message && <Notification message={notification.message} type={notification.type} />}
      <div>
        <Typography variant="h3" color="blue-gray" className="mb-2 dark:text-dark-text-primary">
          Најави се
        </Typography>
        <Typography className="mb-10 text-gray-600 font-normal text-[18px] dark:text-dark-text-secondary">
          Внесете го вашиот мејл или телефонски број за најава
        </Typography>
        <form action="#" className="mx-auto max-w-[24rem] text-left">
          <div className="mb-6">
            <label htmlFor="email">
            <div className="flex items-center mb-2">
              <Typography variant="small" className="font-medium text-gray-900 dark:text-dark-text-secondary mr-1">
                Е-Пошта/Телефонски број
              </Typography>
              <Tooltip
                open={isTooltipOpen}
                onOpen={() => setIsTooltipOpen(true)}
                onClose={() => setIsTooltipOpen(false)}
                content={
                  <div className="w-80">
                    <Typography color="white" className="font-medium">
                      Информации за најава
                    </Typography>
                    <Typography
                      variant="small"
                      color="white"
                      className="font-sm opacity-80"
                    >
                      Ве молиме доколку се најавувате со телефонски број, тој треба да биде во форматот +389********
                    </Typography>
                  </div>
                }
              >
                <svg
                  onClick={() => setIsTooltipOpen(!isTooltipOpen)}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="h-5 w-5 cursor-pointer text-blue-gray-500 mb-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                  />
                </svg>
              </Tooltip>
            </div>
            </label>
            <Input
              id="email"
              color="gray"
              size="lg"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value.replace(/\s/g, ''))}
              placeholder="пример@gmail.com / +389********"
              className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200 dark:bg-dark-secondary dark:text-dark-text-primary"
              labelProps={{ className: "hide" }}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password">
              <Typography variant="small" className="mb-2 block font-medium text-gray-900 dark:text-dark-text-secondary">
                Лозинка
              </Typography>
            </label>
            <Input
              size="lg"
              placeholder="********"
              labelProps={{ className: "hide" }}
              className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200 dark:bg-dark-secondary dark:text-dark-text-primary"
              type={passwordShown ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={
                <i className="cursor-pointer" onClick={togglePasswordVisiblity}>
                  {passwordShown ? <EyeIcon className="h-5 w-5" /> : <EyeSlashIcon className="h-5 w-5" />}
                </i>
              }
            />
          </div>
          <Button onClick={handleAuth} color="gray" size="lg" className="mt-6 dark:bg-dark-button-primary dark:text-white" fullWidth>
            Најави се
          </Button>
          <div className="!mt-4 flex justify-end">
            <Typography as="a" href="#" color="blue-gray" variant="small" className="font-medium dark:text-dark-text-secondary">
              Заборави лозинка?
            </Typography>
          </div>
          <Recaptcha />
        </form>
      </div>
      <FullScreenLoader loading={loading} />
    </section>
  );
}
