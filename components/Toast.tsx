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
              className={`p-3.5 rounded-[12px] border flex items-center justify-between gap-3 shadow-2xl pointer-events-auto select-none ${
                toast.type === "success"
                  ? "bg-[#121a2e] border-[#c9a96a]/40 text-[#f5f1e8]"
                  : toast.type === "error"
                  ? "bg-[#250d15] border-rose-500/40 text-rose-100"
                  : "bg-[#121a2e] border-[rgba(245,241,232,0.08)] text-[#f5f1e8]"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {toast.type === "success" && (
                  <div className="w-5 h-5 rounded-full bg-[#c9a96a]/20 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-[#c9a96a]" strokeWidth={2.5} />
                  </div>
                )}
                {toast.type === "error" && (
                  <div className="w-5 h-5 rounded-full bg-rose-500/20 flex items-center justify-center shrink-0">
                    <AlertCircle className="w-3 h-3 text-rose-400" strokeWidth={2} />
                  </div>
                )}
                {toast.type === "info" && (
                  <div className="w-5 h-5 rounded-full bg-sky-500/20 flex items-center justify-center shrink-0">
                    <Info className="w-3 h-3 text-sky-400" strokeWidth={2} />
                  </div>
                )}
                <span className="text-xs font-normal tracking-tight truncate">
                  {toast.message}
                </span>
              </div>

              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-[rgba(245,241,232,0.38)] hover:text-white transition-colors shrink-0 p-1"
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
