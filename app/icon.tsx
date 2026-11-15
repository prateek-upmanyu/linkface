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
          backgroundColor: "#FFFDF9",
          borderRadius: "12px",
          border: "2px solid #F4D03F",
          boxShadow: "0 2px 8px rgba(243, 156, 18, 0.2)",
        }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Top-Right Loop */}
          <path
            d="M23 15L27 11C29.7 8.3 34.3 8.3 37 11C39.7 13.7 39.7 18.3 37 21L33 25C30.3 27.7 25.7 27.7 23 25"
            stroke="#F39C12"
            strokeWidth="4.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Bottom-Left Loop */}
          <path
            d="M25 33L21 37C18.3 39.7 13.7 39.7 11 37C8.3 34.3 8.3 29.7 11 27L15 23C17.7 20.3 22.3 20.3 25 23"
            stroke="#E67E22"
            strokeWidth="4.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Interlocking Diagonal Center */}
          <path
            d="M19.5 28.5L28.5 19.5"
            stroke="#F59E0B"
            strokeWidth="4.4"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
