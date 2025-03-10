import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { Typography, Input, Button } from "@material-tailwind/react";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/solid";
import FullScreenLoader from "../FullScrennLoader/FullScreenLoader";
import Recaptcha from "./Recaptcha";

export default function Auth() {
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisiblity = () => setPasswordShown((cur) => !cur); 
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleAuth = () => {
    setLoading(true);
    setTimeout( () => {
      navigate("/home");
    }, 1000);
  }

  return (
    <section className="grid text-center h-[90dvh] items-center p-8 dark:bg-dark-primary">
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
              <Typography
                variant="small"
                className="mb-2 block font-medium text-gray-900 dark:text-dark-text-secondary"
              >
                Your Email
              </Typography>
            </label>
            <Input
              id="email"
              color="gray"
              size="lg"
              type="email"
              name="email"
              placeholder="name@mail.com"
              className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200 dark:bg-dark-secondary dark:text-dark-text-primary"
              labelProps={{
                className: "hide",
              }}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password">
              <Typography
                variant="small"
                className="mb-2 block font-medium text-gray-900 dark:text-dark-text-secondary"
              >
                Password
              </Typography>
            </label>
            <Input
              size="lg"
              placeholder="********"
              labelProps={{
                className: "hide",
              }}
              className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200 dark:bg-dark-secondary dark:text-dark-text-primary"
              type={passwordShown ? "text" : "password"}
              icon={
                <i onClick={togglePasswordVisiblity}>
                  {passwordShown ? (
                    <EyeIcon className="h-5 w-5" />
                  ) : (
                    <EyeSlashIcon className="h-5 w-5" />
                  )}
                </i>
              }
            />
          </div>
          <Button onClick={handleAuth} color="gray" size="lg" className="mt-6 dark:bg-dark-button-primary dark:text-white" fullWidth>
              sign in
          </Button>
          <div className="!mt-4 flex justify-end">
            <Typography
              as="a"
              href="#"
              color="blue-gray"
              variant="small"
              className="font-medium dark:text-dark-text-secondary"
            >
              Forgot password
            </Typography>
          </div>
          <Button
            variant="outlined"
            size="lg"
            className="mt-6 flex h-12 items-center justify-center gap-2"
            fullWidth
          >
            <img
              src={`https://www.material-tailwind.com/logos/logo-google.png`}
              alt="google"
              className="h-6 w-6"
            />{" "}
            <p className="m-0 dark:text-dark-text-secondary" >
              sign in with google
            </p>
          </Button>
          <Recaptcha />
          {/* <Typography
            variant="small"
            color="gray"
            className="!mt-4 text-center font-normal"
          >
            Not registered?{" "}
            <a href="#" className="font-medium text-gray-900 dark:text-dark-text-secondary">
              Create account
            </a>
          </Typography> */}
        </form>
      </div>
      <FullScreenLoader loading={loading} />
    </section>
  );
}