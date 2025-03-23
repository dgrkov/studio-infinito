import { useEffect, useState } from "react";

export default function Notification({ message, type, description = "" }) {
  const [show, setShow] = useState(true);

  // Reset show state when message changes
  useEffect(() => {
    if (message) {
      setShow(true);
    }
  }, [message]);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        setShow(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  // Icon mapping based on notification type
  const getIcon = () => {
    switch (type) {
      case "success":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m4.5 12.75 6 6 9-13.5"
            ></path>
          </svg>
        );
      case "error":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            ></path>
          </svg>
        );
      case "warning":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            ></path>
          </svg>
        );
      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
            ></path>
          </svg>
        );
    }
  };

  // Color styles based on notification type
  const getColorStyles = () => {
    switch (type) {
      case "success":
        return "text-green-500";
      case "error":
        return "text-red-500";
      case "warning":
        return "text-orange-500";
      default:
        return "text-blue-500";
    }
  };

  if (!message || !type || !show) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 sm:bottom-4 sm:left-4 sm:translate-x-0 flex flex-col gap-2 w-[70%] sm:w-[350px] text-[10px] sm:text-xs z-50">
      <div className="cursor-default flex items-center w-full h-auto min-h-16 sm:min-h-14 rounded-lg bg-gray-200 dark:bg-[#232531] px-[10px] py-2 shadow-lg">
        
        {/* SVG Icon - 15% */}
        <div className={`flex-[15%] ${getColorStyles()} bg-gray-300 dark:bg-white/5 backdrop-blur-xl p-3 rounded-lg flex justify-center items-center`}>
          {getIcon()}
        </div>
        
        {/* Message & Description - 70% */}
        <div className="flex-[70%] flex flex-col gap-1">
          <p className={`m-2 text-black dark:text-white ${description ? "text-md" : "text-md"}`}>{message}</p>
          {description && <p className=" text-gray-600 dark:text-gray-500">{description}</p>}
        </div>
        
        {/* Close Button - 15% */}
        <button
          onClick={() => setShow(false)}
          className="flex-[15%] text-gray-600 hover:bg-white/5 p-1 rounded-md transition-colors ease-linear flex justify-center items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
  
      </div>
    </div>
  );
  
}