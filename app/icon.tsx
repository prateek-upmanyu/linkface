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
          border: "1.5px solid rgba(243, 156, 18, 0.4)",
        }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Top Yellow Ribbon Stem */}
          <path
            d="M12 6H18C19.1 6 20 6.9 20 8V19L14 23L10 18V8C10 6.9 10.9 6 12 6Z"
            fill="#F59E0B"
          />
          {/* Overlapping Amber Fold */}
          <path
            d="M14 18L20 14L26 21H18L14 18Z"
            fill="#F97316"
          />
          {/* Bottom Red-Orange Horizontal Loop */}
          <path
            d="M14 23H25C27.2 23 29 24.8 29 27C29 29.2 27.2 31 25 31H14C11.8 31 10 29.2 10 27V23H14Z"
            fill="#DC2626"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
