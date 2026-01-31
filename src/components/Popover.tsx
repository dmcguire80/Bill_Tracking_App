import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface PopoverProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const Popover = ({ isOpen, onClose, children }: PopoverProps) => {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />

      {/* Popover - centered for mobile-friendly UX */}
      <div
        ref={popoverRef}
        className="fixed z-50 bg-slate-800 border border-white/10 rounded-lg shadow-2xl min-w-[200px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
          <span className="text-sm font-medium text-neutral-300">Actions</span>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded text-neutral-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-2">{children}</div>
      </div>
    </>
  );
};
