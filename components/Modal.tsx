
import React from 'react';
import { Icon } from './Icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="bg-light-card dark:bg-dark-card w-full max-w-md rounded-2xl shadow-soft-lg m-4 p-6 text-light-text dark:text-dark-text border border-light-border dark:border-dark-border transition-all transform scale-95 opacity-0 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 id="modal-title" className="text-xl font-bold">{title}</h2>
          <button 
            onClick={onClose} 
            aria-label="بستن مودال"
            className="p-1 rounded-full text-light-muted-text dark:text-dark-muted-text hover:bg-light-bg dark:hover:bg-dark-bg transition-colors"
          >
            <Icon name="close" className="text-2xl" />
          </button>
        </div>
        <div>{children}</div>
      </div>
       <style>{`
        @keyframes scale-in {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default Modal;