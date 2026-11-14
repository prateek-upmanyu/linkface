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
          dark: "#140407",
          light: "#faf8f5",
        },
      }).catch((err) => console.error("QR Code rendering failed:", err));
    }
  }, [isOpen, url]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = `${username}-aurum-qr.png`;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in font-sans">
      <div className="luxury-card p-6 sm:p-8 max-w-sm w-full relative text-center border border-[#d4af37]/35 shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-[#faedd0]/60 hover:text-[#d4af37] hover:bg-[#d4af37]/10 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-xl font-serif font-medium text-gold-gradient mb-1">
          Scannable Emblem
        </h3>
        <p className="text-xs text-[#faedd0]/70 mb-5">
          Scan to visit your luxury link in bio at{" "}
          <span className="text-[#d4af37]">/{username}</span>
        </p>

        {/* QR Canvas */}
        <div className="p-3 bg-[#faf8f5] rounded-2xl border border-[#d4af37]/50 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex justify-center items-center mx-auto w-fit">
          <canvas ref={canvasRef} className="rounded-lg" />
        </div>

        {/* URL Display */}
        <div className="mt-4 flex items-center gap-2 p-2.5 rounded-xl border border-[#d4af37]/25 bg-[#120609]/80 text-xs text-[#faedd0] truncate">
          <span className="truncate flex-1 text-left font-mono text-[11px] text-[#faedd0]/90">
            {url}
          </span>
          <button
            onClick={handleCopy}
            className="p-1 text-[#d4af37] hover:text-[#faedd0] transition-colors shrink-0"
            title="Copy URL"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Actions */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 luxury-btn-gold text-[11px] font-semibold uppercase tracking-wider"
          >
            <Download className="w-3.5 h-3.5" />
            Download
          </button>
          <button
            onClick={onClose}
            className="py-2.5 px-3 luxury-btn-outline text-[11px] font-semibold uppercase tracking-wider"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
