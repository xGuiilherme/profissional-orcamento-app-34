import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

// Controle global de modais abertos para scroll do body
let openModalsCount = 0;

const Modal = ({ isOpen, onClose, title, children, className = '' }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      openModalsCount++;
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        contentRef.current?.focus();
      }, 10);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      if (isOpen) {
        openModalsCount = Math.max(0, openModalsCount - 1);
        if (openModalsCount === 0) {
          document.body.style.overflow = 'unset';
        }
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleClose = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={handleClose}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className={`relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-scale-in ${className}`}
        style={{ pointerEvents: 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 w-8 p-0 hover:bg-gray-200"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div
          ref={contentRef}
          tabIndex={0}
          className="flex-1 overflow-y-auto p-6"
          style={{ maxHeight: 'calc(90vh - 80px)' }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;