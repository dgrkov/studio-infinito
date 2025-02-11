import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  //Button,
} from "@material-tailwind/react";
import ServiceCard from '../HTMLElements/ServiceCard'; // Import the ServiceCard component
import ServiceButton from '../HTMLElements/ServiceButton';

export default function ServiceCardMobile(props) {
  const serviceTypes = props.serviceTypes;
  const handleWorkReq = props.handleWorkReq;

  return (
    <div className="p-5 flex justify-center flex-col items-center dark:bg-dark-primary">
      {serviceTypes.map((serviceType) => (
        <ServiceCard 
          key={serviceType.name}
          onClick={handleWorkReq}
          serviceType={serviceType}
          handleWorkReq={handleWorkReq}
          onClick={handleWorkReq}
        >
          {/* <img
            src="https://images.unsplash.com/photo-1629367494173-c78a56567877?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=927&q=80"
            alt="card-image"
            className="h-48 sm:h-64 lg:h-72 xl:h-[25rem] w-full object-cover"
          />
          <div className="mb-2 flex items-center justify-between">
            <Typography className="font-medium text-gray-900 dark:text-dark-text-primary">
              {serviceType.name}
            </Typography>
            <Typography className="font-medium text-gray-900 dark:text-dark-text-primary">
              {serviceType.price} ден.
            </Typography>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20px"
              height="20px"
              viewBox="0 0 24 24"
              fill="none"
              className="text-black dark:text-dark-text-primary"
            >
              <path
                d="M23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12ZM3.00683 12C3.00683 16.9668 7.03321 20.9932 12 20.9932C16.9668 20.9932 20.9932 16.9668 20.9932 12C20.9932 7.03321 16.9668 3.00683 12 3.00683C7.03321 3.00683 3.00683 7.03321 3.00683 12Z"
                className="fill-current"
              />
              <path
                d="M12 5C11.4477 5 11 5.44771 11 6V12.4667C11 12.4667 11 12.7274 11.1267 12.9235C11.2115 13.0898 11.3437 13.2343 11.5174 13.3346L16.1372 16.0019C16.6155 16.278 17.2271 16.1141 17.5032 15.6358C17.7793 15.1575 17.6155 14.5459 17.1372 14.2698L13 11.8812V6C13 5.44772 12.5523 5 12 5Z"
                className="fill-current"
              />
            </svg>
            <Typography className="font-medium m-0 text-gray-900 dark:text-dark-text-primary">
              {serviceType.time}
            </Typography>
          </div>
          <CardFooter className="pt-0">
            <ServiceButton
              text={'Одбери'}
              class_name={"w-full"}
              onClick={handleWorkReq}
            />
          </CardFooter> 
          */}
        </ServiceCard>
      ))}
    </div>
  );
}