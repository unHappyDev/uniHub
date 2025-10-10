'use client';
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div
        className="bg-neutral-800/60 backdrop-blur-sm border border-orange-400 rounded-xl p-6 shadow-lg w-[400px] relative"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-white text-xl hover:text-red-400"
        >
          ✕
        </button>

        {children}
      </div>
    </div>
  );
}
