import React from 'react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-in max-w-sm">
      <div className="bg-[#2C1B14] text-[#FAF8F5] px-4 py-3 rounded-lg shadow-xl border border-[#E1BD7E]/40 flex items-center gap-3">
        <span className="material-symbols-outlined text-[#E1BD7E] text-xl shrink-0">
          spa
        </span>
        <p className="text-xs font-sans font-medium text-[#FAF8F5] leading-snug">
          {message}
        </p>
        <button
          onClick={onClose}
          className="text-[#bd9686] hover:text-[#FAF8F5] p-1 ml-auto cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">close</span>
        </button>
      </div>
    </div>
  );
};
