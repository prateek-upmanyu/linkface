"use client";

import React, { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Download, X, Copy, Check, QrCode as QrIcon } from "lucide-react";

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  url: string;
}

export function QrModal({ isOpen, onClose, username, url }: QrModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && canvasRef.current && url) {
      QRCode.toCanvas(canvasRef.current, url, {
        width: 260,
        margin: 2,
        color: {
          dark: "#0f172a",
          light: "#ffffff",
        },
      }).catch((err) => console.error("QR Code rendering failed:", err));
    }
  }, [isOpen, url]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = `${username}-qr-code.png`;
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Clipboard copy failed:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs font-mono">
      <div className="mc-panel p-6 max-w-sm w-full shadow-[0_8px_0_#000000] relative text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 mc-btn text-white"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-base font-bold uppercase tracking-wider text-white mc-text-shadow mb-1">
          QR Code Scroll
        </h3>
        <p className="text-[11px] text-[#b0adb8] mb-4">
          Scan to visit <span className="text-[#55ffff]">/{username}</span>
        </p>

        {/* QR Canvas */}
        <div className="p-3 bg-white border-2 border-black shadow-[inset_2px_2px_0_#000] flex justify-center items-center mx-auto w-fit">
          <canvas ref={canvasRef} />
        </div>

        {/* URL Display */}
        <div className="mt-3 flex items-center gap-2 p-2 mc-input text-[11px] text-[#55ffff] truncate">
          <span className="truncate flex-1 text-left">{url}</span>
          <button
            onClick={handleCopy}
            className="p-1 hover:text-white transition-colors shrink-0"
            title="Copy URL"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#55ff55]" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Actions */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-1.5 py-2 px-3 mc-btn-gold text-black font-bold text-[10px] uppercase tracking-wider"
          >
            <Download className="w-3.5 h-3.5" />
            Download
          </button>
          <button
            onClick={onClose}
            className="py-2 px-3 mc-btn text-white text-[10px] uppercase tracking-wider"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
