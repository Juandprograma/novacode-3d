"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

export function PolicyModal({ isOpen, onClose, title, content }: PolicyModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[1001] max-h-[90vh] md:max-h-[80vh] md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[600px] md:rounded-lg"
          >
            <div className="h-full bg-[rgba(10,10,10,0.95)] backdrop-blur-md border-t border-[#d4af37] md:border-t md:border-b md:border-l md:border-r md:border-[#d4af37]">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <h2 className="text-xl font-semibold text-[#d4af37]">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-2 text-[#d4af37] hover:text-white transition-colors"
                  aria-label="Cerrar"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)] md:max-h-[calc(80vh-80px)]">
                <div 
                  className="text-[#f5f5f5] prose prose-invert prose-p:text-[#f5f5f5] prose-h2:text-[#d4af37] prose-h2:text-lg prose-p:text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
