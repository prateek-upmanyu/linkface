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
          background: "linear-gradient(135deg, #F4D03F 0%, #F39C12 50%, #E67E22 100%)",
          borderRadius: "14px",
          boxShadow: "0 2px 8px rgba(230, 126, 34, 0.4)",
        }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11 9C9 7 6 7 4 9C2 11 2 14 4 16L8 20C10 22 13 22 15 20C17 18 17 15 15 13L13 11"
            stroke="#FFFFFF"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            transform="translate(4, 1)"
          />
          <path
            d="M21 23C23 25 26 25 28 23C30 21 30 18 28 16L24 12C22 10 19 10 17 12C15 14 15 17 17 19L19 21"
            stroke="#FFFFFF"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            transform="translate(-4, -1)"
          />
          <circle cx="16" cy="16" r="1.8" fill="#FFFFFF" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
