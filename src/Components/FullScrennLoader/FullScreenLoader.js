import React, { useState, useEffect } from "react";

export default function FullScreenLoader({ loading }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (loading) {
      setTimeout(() => setVisible(true));
    } else {
      const timeout = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [loading]);

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50 transition-opacity duration-300 ${
        loading ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid"
          width="209"
          height="209"
          style={{
            shapeRendering: "auto",
            display: "block",
            background: "transparent",
          }}
        >
          <g>
            <path
              style={{
                transform: "scale(0.77)",
                transformOrigin: "50px 50px",
              }}
              strokeLinecap="round"
              d="M24.3 30C11.4 30 5 43.3 5 50s6.4 20 19.3 20c19.3 0 32.1-40 51.4-40 C88.6 30 95 43.3 95 50s-6.4 20-19.3 20C56.4 70 43.6 30 24.3 30z"
              strokeDasharray="166.78280334472657 89.80612487792968"
              strokeWidth="3"
              stroke="#585858"
              fill="none"
            >
              <animate
                values="0;256.58892822265625"
                keyTimes="0;1"
                dur="1.1s"
                repeatCount="indefinite"
                attributeName="stroke-dashoffset"
              />
            </path>
          </g>
        </svg>
    </div>
  );
}
