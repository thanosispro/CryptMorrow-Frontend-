import { X, ArrowLeft, AlertCircle, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';

export default function CancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-text-primary p-6 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-error/5 rounded-full blur-[140px] -z-10 animate-pulse-soft" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-slate-100/50 rounded-full blur-[100px] -z-10 animate-float" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-md w-full p-12 sm:p-16 bg-white border border-border-subtle rounded-[56px] shadow-sm text-center relative z-10"
      >
        <div className="relative inline-block mb-12">
           <div className="w-24 h-24 bg-white border border-border-subtle rounded-[40px] flex items-center justify-center mx-auto shadow-sm group-hover:scale-110 transition-transform duration-700">
              <X className="w-12 h-12 text-error" />
           </div>
           <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-error text-white flex items-center justify-center shadow-lg border-4 border-white animate-float">
              <ShieldAlert className="w-6 h-6" />
           </div>
        </div>
        
        <h1 className="text-4xl font-display font-black mb-6 tracking-tighter uppercase leading-none">Protocol <span className="text-error italic">Aborted</span></h1>
        <p className="text-text-secondary mb-14 text-lg font-medium leading-relaxed">
          The transaction sequence was cancelled by the terminal user. No computational bandwidth has been allocated.
          
          <span className="block mt-8 text-[11px] text-text-tertiary font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3">
             <AlertCircle className="w-4 h-4 text-error animate-pulse" /> Zero Charges Processed
          </span>
        </p>
        
        <button 
          onClick={() => router.push('/')}
          className="w-full py-6 px-10 bg-slate-50 border border-border-subtle text-text-primary rounded-[24px] font-black text-[11px] uppercase tracking-[0.4em] hover:bg-white hover:shadow-md active:scale-95 transition-all flex items-center justify-center gap-4 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform duration-500" />
          <span>Return to Nexus</span>
        </button>
      </motion.div>
    </div>
  );
}
