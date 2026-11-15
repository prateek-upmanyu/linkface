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
          backgroundColor: "#000000",
          borderRadius: "50%",
          border: "2.5px solid #FACC15",
          boxShadow: "0 0 8px rgba(250, 204, 21, 0.4)",
        }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Connecting diagonal center link */}
          <path
            d="M17 23L23 17"
            stroke="#FACC15"
            strokeWidth="3.8"
            strokeLinecap="round"
          />
          {/* Top-Right Loop */}
          <path
            d="M20 14L23.5 10.5C25.5 8.5 28.5 8.5 30.5 10.5C32.5 12.5 32.5 15.5 30.5 17.5L27 21"
            stroke="#FACC15"
            strokeWidth="3.8"
            strokeLinecap="round"
          />
          {/* Bottom-Left Loop */}
          <path
            d="M20 26L16.5 29.5C14.5 31.5 11.5 31.5 9.5 29.5C7.5 27.5 7.5 24.5 9.5 22.5L13 19"
            stroke="#FACC15"
            strokeWidth="3.8"
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
