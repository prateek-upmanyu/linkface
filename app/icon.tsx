import { ImageResponse } from "next/og";

export const size = {
  width: 48,
  height: 48,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#18181B",
          borderRadius: "14px",
          border: "1.5px solid rgba(245, 158, 11, 0.6)",
        }}
      >
        <svg
          width="34"
          height="34"
          viewBox="0 0 44 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16 11C12.7 11 10 13.7 10 17V24C10 27.3 12.7 30 16 30C19.3 30 22 27.3 22 24V17C22 13.7 19.3 11 16 11Z"
            stroke="#F59E0B"
            strokeWidth="3.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M27 22C23.7 22 21 24.7 21 28C21 31.3 23.7 34 27 34H31C34.3 34 37 31.3 37 28C37 24.7 34.3 22 31 22H27Z"
            stroke="#EA580C"
            strokeWidth="3.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17 25L26 21"
            stroke="#FDE047"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="21.5" cy="23" r="2.8" fill="#FDE047" />
          <circle cx="21.5" cy="23" r="1.2" fill="#18181B" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
