import React from "react";
import { Stepper, Step, Typography } from "@material-tailwind/react";
import { CogIcon, UserIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";

export function StepperWithContent(props) {
  const [isLastStep, setIsLastStep] = React.useState(false);
  const [isFirstStep, setIsFirstStep] = React.useState(false);

  const handleStepClick = (step) => {
    if (step === props.activeStep) return;
    if (step > props.activeStep) return;

    props.onStepChange(step);
  };

  return (
    <div className="w-full px-14 py-4 mb-12">
      <Stepper
        activeStep={props.activeStep}
        isLastStep={(value) => setIsLastStep(value)}
        isFirstStep={(value) => setIsFirstStep(value)}
      >
        <Step onClick={() => handleStepClick(0)}>
          <UserIcon className="h-5 w-5" />
          <div className="absolute -bottom-[3rem] w-max text-center">
            <Typography
              variant="h6"
              color={props.activeStep === 0 ? "blue-gray" : "gray"}
              className="font-normal text-sm md:text-base"
            >
              Step 1
            </Typography>
            <Typography
              color={props.activeStep === 0 ? "blue-gray" : "gray"}
              className={`font-normal text-[0.4rem] transition-all md:text-base ${props.activeStep === 0 ? "text-[0.7rem]" : ""}`}
            >
              Избери вработен.
            </Typography>
          </div>
        </Step>
        <Step onClick={() => handleStepClick(1)}>
          <CogIcon className="h-5 w-5" />
          <div className="absolute -bottom-[3rem] w-max text-center">
            <Typography
              variant="h6"
              color={props.activeStep === 1 ? "blue-gray" : "gray"}
              className="font-normal text-sm md:text-base"
            >
              Step 2
            </Typography>
            <Typography
              color={props.activeStep === 1 ? "blue-gray" : "gray"}
              className={`font-normal text-[0.4rem] transition-all md:text-base ${props.activeStep === 1 ? "text-[0.7rem]" : ""}`}
            >
              Избери тип на побарувачка.
            </Typography>
          </div>
        </Step>
        <Step onClick={() => handleStepClick(2)}>
          <CalendarDaysIcon className="h-5 w-5" />
          <div className="absolute -bottom-[3rem] w-max text-center">
            <Typography
              variant="h6"
              color={props.activeStep === 2 ? "blue-gray" : "gray"}
              className="font-normal text-sm md:text-base"
            >
              Step 3
            </Typography>
            <Typography
              color={props.activeStep === 2 ? "blue-gray" : "gray"}
              className={`font-normal text-[0.4rem] transition-all md:text-base ${props.activeStep === 2 ? "text-[.8rem]" : ""}`}
            >
              Избери датум и час.
            </Typography>
          </div>
        </Step>
      </Stepper>
    </div>
  );
}
