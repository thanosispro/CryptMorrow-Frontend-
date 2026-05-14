import { useToast } from '../contexts/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, Loader2 } from 'lucide-react';

export default function Toast() {
    const { toasts, removeToast } = useToast();

    return (
        <div className="fixed top-6 sm:top-24 right-4 sm:right-10 z-[200] flex flex-col items-end pointer-events-none p-4 gap-4">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        initial={{ opacity: 0, x: 50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20, scale: 0.95 }}
                        className={`
                            pointer-events-auto
                            w-[calc(100vw-40px)] sm:w-[380px]
                            px-6 py-5 rounded-[24px] border border-border-subtle shadow-2xl
                            flex items-center gap-5 bg-surface/90 backdrop-blur-2xl
                        `}
                    >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${
                            toast.type === 'error' ? 'bg-error/10 text-error border border-error/20' : 
                            toast.type === 'pending' ? 'bg-primary/10 text-primary border border-primary/20' : 
                            'bg-success/10 text-success border border-success/20'
                        }`}>
                            {toast.type === 'error' && <AlertCircle className="w-6 h-6" />}
                            {toast.type === 'pending' && <Loader2 className="w-6 h-6 animate-spin" />}
                            {toast.type === 'success' && <CheckCircle className="w-6 h-6" />}
                            {toast.type === 'info' && <Info className="w-6 h-6" />}
                        </div>
                        
                        <div className="flex-1 overflow-hidden">
                            <p className="text-[12px] font-black text-text-primary leading-none uppercase tracking-widest mb-1.5">
                                {toast.type === 'error' ? 'Matrix Error' : 
                                 toast.type === 'pending' ? 'Neural Sync' : 
                                 'System Success'}
                            </p>
                            <p className="text-[11px] text-text-tertiary font-medium line-clamp-2 uppercase tracking-tight">
                                {toast.message}
                            </p>
                        </div>
 
                        <button 
                            onClick={() => removeToast(toast.id)}
                            className="p-2 text-text-tertiary hover:text-text-primary hover:bg-base-bg rounded-full transition-all border border-transparent hover:border-border-subtle"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
