import { Check, ArrowRight, Zap, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function SuccessPage() {
  const { syncProfile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Sync profile immediately to reflect new membership status
    syncProfile();
    // Redirect to home after a short delay
    const timer = setTimeout(() => {
      router.push('/');
    }, 5000);
    return () => clearTimeout(timer);
  }, [syncProfile, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-text-primary p-6 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-success/5 rounded-full blur-[140px] -z-10 animate-pulse-soft" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -z-10 animate-float" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-md w-full p-12 sm:p-16 bg-white border border-border-subtle rounded-[56px] shadow-sm text-center relative z-10"
      >
        <div className="relative inline-block mb-12">
           <div className="w-24 h-24 bg-white border border-border-subtle rounded-[40px] flex items-center justify-center mx-auto shadow-sm group-hover:scale-110 transition-transform duration-700">
              <Check className="w-12 h-12 text-success" />
           </div>
           <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-success text-white flex items-center justify-center shadow-lg border-4 border-white animate-float">
              <ShieldCheck className="w-6 h-6" />
           </div>
        </div>
        
        <h1 className="text-4xl font-display font-black mb-6 tracking-tighter uppercase leading-none">Protocol <span className="text-success italic">Activated</span></h1>
        <p className="text-text-secondary mb-14 text-lg font-medium leading-relaxed">
          Operational handshake complete. Your neural bandwidth has been successfully reallocated to the master node.
          
          <span className="block mt-8 text-[11px] text-text-tertiary font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3">
             <Zap className="w-4 h-4 text-primary animate-pulse" /> Redirecting to Terminal_01 in 5.0s
          </span>
        </p>
        
        <button 
          onClick={() => router.push('/')}
          className="w-full py-6 px-10 bg-text-primary text-white rounded-[24px] font-black text-[11px] uppercase tracking-[0.4em] hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-text-primary/10 flex items-center justify-center gap-4 group"
        >
          <span>Return to Nexus</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" />
        </button>
      </motion.div>
    </div>
  );
}
