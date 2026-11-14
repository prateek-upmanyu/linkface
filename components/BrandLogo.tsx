import React from "react";

export function BrandLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <div
      className={`border-2 border-black flex items-center justify-center select-none shadow-[2px_2px_0px_#000000] shrink-0 bg-[#5c8e32] ${className}`}
      title="CraftLink"
    >
      {/* Pixelated Minecraft Grass Block Icon */}
      <svg
        viewBox="0 0 16 16"
        className="w-full h-full"
        style={{ shapeRendering: "crispEdges" }}
      >
        {/* Grass Top */}
        <rect x="0" y="0" width="16" height="5" fill="#5c8e32" />
        <rect x="1" y="5" width="2" height="2" fill="#5c8e32" />
        <rect x="5" y="5" width="2" height="3" fill="#5c8e32" />
        <rect x="9" y="5" width="2" height="2" fill="#5c8e32" />
        <rect x="13" y="5" width="2" height="3" fill="#5c8e32" />

        {/* Highlights */}
        <rect x="0" y="0" width="16" height="1" fill="#7ebd3e" />
        <rect x="0" y="1" width="1" height="4" fill="#7ebd3e" />

        {/* Dirt Bottom */}
        <rect x="0" y="5" width="1" height="11" fill="#866043" />
        <rect x="3" y="5" width="2" height="11" fill="#866043" />
        <rect x="7" y="5" width="2" height="11" fill="#866043" />
        <rect x="11" y="5" width="2" height="11" fill="#866043" />
        <rect x="15" y="5" width="1" height="11" fill="#866043" />
        <rect x="0" y="8" width="16" height="8" fill="#866043" />

        {/* Dirt Dark Pixels */}
        <rect x="2" y="9" width="2" height="2" fill="#573d26" />
        <rect x="8" y="11" width="2" height="2" fill="#573d26" />
        <rect x="12" y="9" width="2" height="2" fill="#573d26" />
        <rect x="5" y="13" width="2" height="2" fill="#573d26" />
      </svg>
    </div>
  );
}
