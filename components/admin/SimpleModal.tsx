'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface SimpleModalProps {
  children: React.ReactNode;
  title: string;
  onClose: () => void;
}

export default function SimpleModal({ children, title, onClose }: SimpleModalProps) {
  // Effect to handle closing the modal with the Escape key
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, [onClose]);

  return (
    // Modal Backdrop Overlay
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/70 bg-opacity-50 flex justify-center items-center p-4"
      onClick={onClose} // Close on clicking the backdrop
    >
      {/* Modal Content */}
      <div 
        className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-auto"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            title="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}