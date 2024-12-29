import React from "react";
import { Stepper, Step, Button, Typography } from "@material-tailwind/react";
import {
  CogIcon,
  UserIcon,
  BuildingLibraryIcon,
} from "@heroicons/react/24/outline";
 
export function StepperWithContent(props) {
  // const [activeStep, setActiveStep] = React.useState(0);
  const [isLastStep, setIsLastStep] = React.useState(false);
  const [isFirstStep, setIsFirstStep] = React.useState(false);
 
  // const handleNext = () => !isLastStep && setActiveStep((cur) => cur + 1);
  // const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1);
 
  return (
    <div className="w-full px-14 py-4 mb-16">
      <Stepper
        activeStep={props.activeStep}
        isLastStep={(value) => setIsLastStep(value)}
        isFirstStep={(value) => setIsFirstStep(value)}
      >
        <Step>
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
              className="font-normal text-[0.5rem] md:text-base"
            >
              Избери вработен.
            </Typography>
          </div>
        </Step>
        <Step>
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
              className="font-normal text-wrap text-[0.5rem] md:text-base"
            >
              Избери тип на побарувачка.
            </Typography>
          </div>
        </Step>
        <Step>
          <BuildingLibraryIcon className="h-5 w-5" />
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
              className="font-normal text-[0.5rem] md:text-base"
            >
              Избери датум и час.
            </Typography>
          </div>
        </Step>
      </Stepper>
    </div>
  );
}