import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X, Check, ArrowRight } from 'lucide-react';
import Portal from './Portal';

export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Are you sure?", 
  message = "This action cannot be undone.", 
  confirmText = "Confirm", 
  cancelText = "Cancel",
  type = "warning" // warning, danger, info
}) {
  if (!isOpen) return null;

  const themes = {
    warning: {
      icon: <AlertCircle className="w-8 h-8 text-warning" />,
      bg: "bg-warning/5",
      border: "border-warning/20",
      button: "bg-warning text-white shadow-warning/20",
      accent: "text-warning"
    },
    danger: {
      icon: <AlertCircle className="w-8 h-8 text-error" />,
      bg: "bg-error/5",
      border: "border-error/20",
      button: "bg-error text-white shadow-error/20",
      accent: "text-error"
    },
    info: {
      icon: <AlertCircle className="w-8 h-8 text-primary" />,
      bg: "bg-primary/5",
      border: "border-primary/20",
      button: "bg-primary text-white shadow-primary/20",
      accent: "text-primary"
    }
  };

  const theme = themes[type] || themes.warning;

  return (
    <Portal>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-999 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[40px] border border-border-subtle shadow-2xl w-full max-w-md overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 p-6">
                <button 
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-slate-50 text-text-tertiary transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-10 pt-12 text-center">
                <div className={`w-20 h-20 mx-auto rounded-3xl ${theme.bg} border-2 ${theme.border} flex items-center justify-center mb-8 shadow-sm`}>
                  {theme.icon}
                </div>
                
                <h3 className="text-2xl font-display font-black text-text-primary tracking-tight mb-4">
                  {title}
                </h3>
                <p className="text-text-secondary font-medium leading-relaxed mb-10 px-4">
                  {message}
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 py-5 rounded-2xl bg-slate-50 border border-border-subtle text-text-primary font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white hover:shadow-sm active:scale-95 transition-all"
                  >
                    {cancelText}
                  </button>
                  <button
                    onClick={() => {
                        onConfirm();
                        onClose();
                    }}
                    className={`flex-1 py-5 rounded-2xl ${theme.button} font-black text-[10px] uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 group`}
                  >
                    <span>{confirmText}</span>
                    <Check className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
              
              {/* Decorative background element */}
              <div className={`absolute -bottom-10 -right-10 w-40 h-40 ${theme.bg} rounded-full blur-3xl opacity-50 -z-10`} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  );
}
