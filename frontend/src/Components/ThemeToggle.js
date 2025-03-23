import React, { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";

const ThemeToggle = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const toggleTheme = () => {
    console.log("Called");
    setDarkMode((prev) => !prev);
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div className="w-full">
      <button onClick={toggleTheme} className="w-full py-auto rounded-md">
        {darkMode ? <SunIcon className="h-6 w-6 text-yellow-600" /> : <MoonIcon className="h-6 w-6 text-gray-500" />}
      </button>
    </div>
  );
};

export default ThemeToggle;