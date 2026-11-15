"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { Check, AlertCircle, Info, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <aside aria-label="Notifications" className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none font-body">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className={`p-3.5 rounded-[14px] border flex items-center justify-between gap-3 shadow-lg pointer-events-auto select-none bg-white ${
                toast.type === "success"
                  ? "border-[#F4D03F] text-[#18181B]"
                  : toast.type === "error"
                  ? "border-rose-300 text-[#18181B]"
                  : "border-sky-300 text-[#18181B]"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {toast.type === "success" && (
                  <div className="w-5 h-5 rounded-full bg-[#F9E79F] flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-[#B9770E]" strokeWidth={2.5} />
                  </div>
                )}
                {toast.type === "error" && (
                  <div className="w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                    <AlertCircle className="w-3 h-3 text-rose-500" strokeWidth={2} />
                  </div>
                )}
                {toast.type === "info" && (
                  <div className="w-5 h-5 rounded-full bg-sky-100 flex items-center justify-center shrink-0">
                    <Info className="w-3 h-3 text-sky-500" strokeWidth={2} />
                  </div>
                )}
                <span className="text-xs font-semibold tracking-tight truncate">
                  {toast.message}
                </span>
              </div>

              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-[#9CA3AF] hover:text-[#18181B] transition-colors shrink-0 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </aside>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
