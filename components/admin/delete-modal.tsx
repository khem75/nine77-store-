'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useTransition } from 'react';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title?: string;
  description?: string;
}

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Product',
  description = 'Are you sure you want to delete this product? This action cannot be undone.',
}: DeleteModalProps) {
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      await onConfirm();
      onClose();
    });
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={!isPending ? onClose : undefined}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-[400px] mx-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-black/[0.06] overflow-hidden">
              {/* Icon + Content */}
              <div className="p-6">
                <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mb-4">
                  <AlertTriangle size={22} className="text-red-500" />
                </div>
                <h2 className="text-[16px] font-semibold text-[#111111] mb-2">{title}</h2>
                <p className="text-[13.5px] text-[#6B6B70] leading-relaxed">{description}</p>
              </div>

              {/* Actions */}
              <div className="px-6 pb-6 flex items-center gap-3">
                <button
                  onClick={onClose}
                  disabled={isPending}
                  className="admin-btn-secondary flex-1 justify-center"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={isPending}
                  className="admin-btn-danger flex-1 justify-center"
                >
                  {isPending ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Deleting…
                    </>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
