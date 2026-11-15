"use client";

import React, { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Download, X, Copy, Check } from "lucide-react";

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
        width: 240,
        margin: 2,
        color: {
          dark: "#18181B",
          light: "#ffffff",
        },
      }).catch((err) => console.error("QR Code rendering failed:", err));
    }
  }, [isOpen, url]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = `${username}-linklet-qr.png`;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in font-body">
      <div className="p-6 sm:p-8 max-w-sm w-full relative text-center rounded-[16px] bg-[#FFFFFF] border border-[#E5E7EB] shadow-xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-[#9CA3AF] hover:text-[#18181B] hover:bg-gray-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="font-heading font-bold text-2xl text-[#18181B] mb-1">
          Share Your Link
        </h3>
        <p className="text-xs text-[#6B7280] mb-5 font-body font-medium">
          Scan to visit linklet.bio/{username}
        </p>

        {/* QR Code Canvas */}
        <div className="bg-[#FFFDF9] p-3.5 rounded-[14px] inline-block border border-[#E5E7EB] shadow-xs mb-5">
          <canvas ref={canvasRef} className="block mx-auto rounded-[8px]" />
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={handleDownload}
            className="w-full py-2.5 btn-champagne text-xs uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download QR Code
          </button>

          <button
            onClick={handleCopy}
            className="w-full py-2.5 btn-outline text-xs uppercase tracking-wider flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-[#E67E22]" />
                <span className="text-[#E67E22]">Copied URL!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#6B7280]" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
