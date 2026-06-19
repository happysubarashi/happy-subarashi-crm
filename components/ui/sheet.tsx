"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Sheet({ open, onClose, title, children, className }: SheetProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;
  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-brand-purple-900/30 backdrop-blur-[2px] animate-fade-in"
        onClick={onClose}
      />

      {/* Sheet / Modal */}
      <div
        className={cn(
          "relative bg-white w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl",
          "max-h-[92vh] flex flex-col animate-scale-in shadow-card",
          className
        )}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-brand-purple-50 flex-shrink-0">
          <h2 className="font-display text-lg font-semibold text-brand-purple-900">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-brand-purple-50 flex items-center justify-center text-brand-purple-500 hover:bg-brand-purple-100"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-4 flex-1">{children}</div>
      </div>
    </div>,
    document.body
  );
}
