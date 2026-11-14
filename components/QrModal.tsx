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
          dark: "#120306",
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in font-sans">
      <div className="luxury-card p-6 sm:p-8 max-w-sm w-full relative text-center border border-[#d97706]/35 shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-xl font-serif font-bold text-white mb-1">
          QR Code
        </h3>
        <p className="text-xs text-slate-300 mb-5">
          Scan to visit your Linklet page at{" "}
          <span className="text-[#f59e0b] font-medium">/{username}</span>
        </p>

        {/* QR Canvas */}
        <div className="p-3 bg-white rounded-2xl border border-[#d97706]/40 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex justify-center items-center mx-auto w-fit">
          <canvas ref={canvasRef} className="rounded-lg" />
        </div>

        {/* URL Display */}
        <div className="mt-4 flex items-center gap-2 p-2.5 rounded-xl border border-[#d97706]/25 bg-[#140307]/90 text-xs text-white truncate">
          <span className="truncate flex-1 text-left font-mono text-[11px] text-slate-200">
            {url}
          </span>
          <button
            onClick={handleCopy}
            className="p-1 text-[#f59e0b] hover:text-white transition-colors shrink-0"
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
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 luxury-btn-gold text-xs font-semibold uppercase tracking-wider"
          >
            <Download className="w-3.5 h-3.5" />
            Download
          </button>
          <button
            onClick={onClose}
            className="py-2.5 px-3 luxury-btn-outline text-xs font-semibold uppercase tracking-wider text-slate-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
