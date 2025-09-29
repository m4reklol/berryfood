import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ 
  message, 
  type, 
  isVisible, 
  onClose, 
  duration = 2000 
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[10000] animate-slide-down">
      <div className={`flex items-center space-x-3 px-6 py-4 rounded-xl shadow-2xl border-2 min-w-[320px] max-w-md ${
        type === 'success' 
          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-700' 
          : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200 text-red-700'
      }`}>
        {/* Icon */}
        {type === 'success' ? (
          <CheckCircle className="w-6 h-6 flex-shrink-0" />
        ) : (
          <AlertCircle className="w-6 h-6 flex-shrink-0" />
        )}
        
        {/* Message */}
        <span className="font-semibold flex-1">
          {message}
        </span>
        
        {/* Close button */}
        <button
          onClick={onClose}
          className={`p-1 rounded-full transition-colors duration-200 flex-shrink-0 ${
            type === 'success'
              ? 'hover:bg-green-100 text-green-600'
              : 'hover:bg-red-100 text-red-600'
          }`}
          aria-label="Zavřít notifikaci"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      {/* Custom animation styles */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
        
        .animate-slide-down {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Toast;