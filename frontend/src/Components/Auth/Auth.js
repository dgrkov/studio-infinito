import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Input, Button } from "@material-tailwind/react";
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
  const [message_response, setMessage_response] = useState("");
  const [type, setType] = useState("");
  const [head_message, setHead_message] = useState("");

  const handleAuth = async () => {
    setLoading(true);
  
    const body = {
      EmailOrPhone: email,
      Password: password,
      rememberMe: true
    };
  
    axios.login("Auth/login", body)
      .then((res) => {
        console.log(res);
  
        if (res.status === 200 && res.data[0]?.ok) {
          const parsedData = JSON.parse(res.data[0].ok);
          cookie.setCookie("access_token", parsedData.access_token, parsedData.valid_to);
  
          setLoading(false);
          navigate("/home");
        } else {
          setMessage_response(res.data[0].error || "Login failed");
          setType('error');
          setHead_message('Error');
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Login Error:", err);
        setMessage_response("An error occurred. Please try again.");
        setType('error');
        setHead_message('Error');
        setLoading(false);
      });
  };
  

  return (
    <section className="grid text-center h-[90dvh] items-center p-8 dark:bg-dark-primary">
      <Notification message={message_response} type={type} head_message={head_message} />
      <div>
        <Typography variant="h3" color="blue-gray" className="mb-2 dark:text-dark-text-primary">
          Sign In
        </Typography>
        <Typography className="mb-10 text-gray-600 font-normal text-[18px] dark:text-dark-text-secondary">
          Enter your email and password to sign in
        </Typography>
        <form action="#" className="mx-auto max-w-[24rem] text-left">
          <div className="mb-6">
            <label htmlFor="email">
              <Typography variant="small" className="mb-2 block font-medium text-gray-900 dark:text-dark-text-secondary">
                Your Email
              </Typography>
            </label>
            <Input
              id="email"
              color="gray"
              size="lg"
              type="email"
              name="email"
              value={email} // ✅ Bind state
              onChange={(e) => setEmail(e.target.value)} // ✅ Update state
              placeholder="name@mail.com"
              className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200 dark:bg-dark-secondary dark:text-dark-text-primary"
              labelProps={{ className: "hide" }}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password">
              <Typography variant="small" className="mb-2 block font-medium text-gray-900 dark:text-dark-text-secondary">
                Password
              </Typography>
            </label>
            <Input
              size="lg"
              placeholder="********"
              labelProps={{ className: "hide" }}
              className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200 dark:bg-dark-secondary dark:text-dark-text-primary"
              type={passwordShown ? "text" : "password"}
              value={password} // ✅ Bind state
              onChange={(e) => setPassword(e.target.value)} // ✅ Update state
              icon={
                <i className="cursor-pointer" onClick={togglePasswordVisiblity}>
                  {passwordShown ? <EyeIcon className="h-5 w-5" /> : <EyeSlashIcon className="h-5 w-5" />}
                </i>
              }
            />
          </div>
          <Button onClick={handleAuth} color="gray" size="lg" className="mt-6 dark:bg-dark-button-primary dark:text-white" fullWidth>
            Sign In
          </Button>
          <div className="!mt-4 flex justify-end">
            <Typography as="a" href="#" color="blue-gray" variant="small" className="font-medium dark:text-dark-text-secondary">
              Forgot password?
            </Typography>
          </div>
          <Button variant="outlined" size="lg" className="mt-6 flex h-12 items-center justify-center gap-2" fullWidth>
            <img src="https://www.material-tailwind.com/logos/logo-google.png" alt="google" className="h-6 w-6" />
            <p className="m-0 dark:text-dark-text-secondary">Sign in with Google</p>
          </Button>
          <Recaptcha />
        </form>
      </div>
      <FullScreenLoader loading={loading} />
    </section>
  );
}
