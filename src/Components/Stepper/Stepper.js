import React from "react";
import { Stepper, Step, Typography } from "@material-tailwind/react";
import { CogIcon, UserIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";

import '../Home/Main.css'

export function StepperWithContent(props) {
  const [isLastStep, setIsLastStep] = React.useState(false);
  const [isFirstStep, setIsFirstStep] = React.useState(false);

  const handleStepClick = (step) => {
    if (step === props.activeStep) return;
    if (step > props.activeStep) return;

    props.onStepChange(step);
  };

  return (
    <div className="w-full px-10 md:px-48 py-4 mb-12 lg:mb-16 dark:bg-dark-primary">
      <Stepper
        activeStep={props.activeStep}
        isLastStep={(value) => setIsLastStep(value)}
        isFirstStep={(value) => setIsFirstStep(value)}
      >
        <Step onClick={() => handleStepClick(0)}>
          <UserIcon className="h-5 w-5" />
          <div className={`absolute md:-bottom-[4.5rem] w-max text-center ${props.activeStep === 0 ? "-bottom-[3.5rem]" : "-bottom-[3rem]"} `}>
            <Typography
              variant="h6"
              className={`font-normal text-sm md:text-base ${
                props.activeStep === 0 
                  ? "text-gray-800 dark:text-dark-text-primary" 
                  : "text-gray-500 dark:text-dark-text-secondary"
              }`}
            >
              Step 1
            </Typography>
            <Typography
              className={`font-normal text-[0.4rem] transition-all md:text-base ${
                props.activeStep === 0 
                  ? "text-gray-800 dark:text-dark-text-primary text-[0.7rem]"
                  : "text-gray-500 dark:text-dark-text-secondary"
              }`}
            >
              Избери вработен.
            </Typography>
          </div>
        </Step>
        <Step onClick={() => handleStepClick(1)}>
          <CogIcon className="h-5 w-5" />
          <div className={`absolute md:-bottom-[4.5rem] w-max text-center ${props.activeStep === 1 ? "-bottom-[3.5rem]" : "-bottom-[3rem]"} `}>
            <Typography
              variant="h6"
              className={`font-normal text-sm md:text-base ${
                props.activeStep === 1 
                  ? "text-gray-800 dark:text-dark-text-primary" 
                  : "text-gray-500 dark:text-dark-text-secondary"
              }`}
            >
              Step 2
            </Typography>
            <Typography
              className={`font-normal text-[0.4rem] transition-all md:text-base ${
                props.activeStep === 1 
                  ? "text-gray-800 dark:text-dark-text-primary text-[0.7rem]" 
                  : "text-gray-500 dark:text-dark-text-secondary"
              }`}
            >
              Избери тип на побарувачка.
            </Typography>
          </div>
        </Step>
        <Step onClick={() => handleStepClick(2)}>
          <CalendarDaysIcon className="h-5 w-5" />
          <div className={`absolute md:-bottom-[4.5rem] w-max text-center ${props.activeStep === 2 ? "-bottom-[3.5rem]" : "-bottom-[3rem]"} `}>
            <Typography
              variant="h6"
              className={`font-normal text-sm md:text-base ${
                props.activeStep === 2 
                  ? "text-gray-800 dark:text-dark-text-primary" 
                  : "text-gray-500 dark:text-dark-text-secondary"
              }`}
            >
              Step 3
            </Typography>
            <Typography
              className={`font-normal text-[0.4rem] transition-all md:text-base ${
                props.activeStep === 2 
                  ? "text-gray-800 dark:text-dark-text-primary text-[0.7rem]" 
                  : "text-gray-500 dark:text-dark-text-secondary"
              }`}
            >
              Избери датум и час.
            </Typography>
          </div>
        </Step>
      </Stepper>
    </div>
  );
}
