"use client";
import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#1a1a1b] z-50">
      <div className="bg-glass backdrop-blur-sm border border-orange-400/40 rounded-2xl p-8 shadow-glow transition-all hover:shadow-orange-500/30 w-[90vw] max-w-[600px] relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-white text-xl hover:text-red-400 cursor-pointer"
        >
          &times;
        </button>

        {children}
      </div>
    </div>
  );
}
