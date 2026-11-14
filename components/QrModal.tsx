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
          dark: "#001a3a",
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in font-body">
      <div className="luxury-card p-6 sm:p-8 max-w-sm w-full relative text-center border border-[var(--border-soft)] shadow-[0_20px_50px_rgba(0,15,35,0.85)]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-[var(--color-text-muted)] hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="font-heading font-medium text-lg text-[var(--color-text-offwhite)] mb-1">
          Share Your Showcase
        </h3>
        <p className="text-xs text-[var(--color-text-muted)] mb-5">
          Scan to visit linklet.bio/{username}
        </p>

        {/* QR Code Canvas */}
        <div className="bg-white p-3.5 rounded-2xl inline-block shadow-inner mb-5">
          <canvas ref={canvasRef} className="block mx-auto rounded-xl" />
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={handleDownload}
            className="w-full py-2.5 luxury-btn-lime text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download QR Code
          </button>

          <button
            onClick={handleCopy}
            className="w-full py-2.5 luxury-btn-outline text-xs uppercase tracking-wider flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-[var(--color-acid-lime)]" />
                <span className="text-[var(--color-acid-lime)]">Copied URL</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[var(--color-acid-lime)]" />
                <span>Copy Profile URL</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
