import Head from 'next/head';
import { useState, useEffect } from 'react';
import { createCheckoutSession } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';
import Portal from '../components/Portal';
import { 
  Zap, 
  Check, 
  ChevronRight, 
  ShieldCheck, 
  ArrowRight, 
  X, 
  Layers, 
  Clock, 
  Cpu, 
  CreditCard,
  Crown,
  Sparkles,
  Target
} from 'lucide-react';

export default function Pricing() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [membershipType, setMembershipType] = useState('full');
  
  // Robust Body scroll lock
  useEffect(() => {
    if (selectedPlan) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflowY = 'scroll'; // Prevent layout shift
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflowY = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflowY = '';
    };
  }, [selectedPlan]);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (step > 1) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [step]);

  const plans = [
    { id: '1week', name: 'Starter Plan', duration: '1 Week', price: 250, color: 'text-success', bg: 'bg-success/5', border: 'border-success/10' },
    { id: '2week', name: 'Pro Plan', duration: '2 Weeks', price: 500, color: 'text-primary', bg: 'bg-primary/5', border: 'border-primary/10' },
    { id: '3week', name: 'Master Plan', duration: '3 Weeks', price: 1000, color: 'text-secondary', bg: 'bg-secondary/5', border: 'border-secondary/10' },
    { id: '1month', name: 'VIP Plan', duration: '1 Month', price: 1500, color: 'text-error', bg: 'bg-error/5', border: 'border-error/10' },
  ];

  const handlePurchaseClick = (plan) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    setSelectedPlan(plan);
    setStep(2);
  };

  const handleProceedCheckout = () => {
    setStep(3);
  };

  const handleFinalizePayment = async () => {
    setLoading(true);
    try {
      const { url } = await createCheckoutSession(membershipType, selectedPlan.id);
      window.location.href = url;
    } catch (err) {
      showToast(err.message || 'Failed to initiate checkout.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const closeDialog = () => {
    setStep(1);
    setSelectedPlan(null);
  };

  return (
    <>
      <Head><title>Subscription Plans | CryptMorrow</title></Head>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 min-h-screen relative">
        {/* Ambient background glows - Light theme optimized */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2 animate-pulse-soft" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2 animate-pulse-soft" />

        {/* Header Section */}
        <div className="text-center mb-16 lg:mb-24 relative z-10">
           <motion.div 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-secondary/5 border border-secondary/10 text-secondary text-[10px] font-black uppercase tracking-[0.2em] mb-8"
           >
              <Cpu className="w-4 h-4 fill-secondary/20" />
              <span>Subscription Plans</span>
            </motion.div>
          <h1 className="text-4xl lg:text-7xl font-display font-extrabold text-text-primary tracking-tight mb-8">
            Choose Your <span className="text-secondary italic">Plan</span>
          </h1>
          <p className="text-text-secondary text-base sm:text-lg mt-3 max-w-2xl mx-auto font-medium leading-relaxed">
            Our AI analysis uses advanced technology to give you the best predictions. Choose a plan that fits your needs and start trading smarter.
          </p>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-12 inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-white border border-border-subtle shadow-sm text-[10px] font-black uppercase tracking-widest text-text-tertiary"
          >
             <Sparkles className="w-4 h-4 text-warning animate-pulse" />
             <span>Renewal Bonus: <span className="text-primary italic font-black">20% discount</span> if renewing on expiry.</span>
          </motion.div>

          {user && user.membership_type !== 'basic' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-10 max-w-xl mx-auto p-5 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-center gap-4 shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                <Crown className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black uppercase text-primary tracking-widest mb-0.5 leading-none">Active Subscription</p>
                <p className="text-xs font-bold text-text-secondary leading-tight">You already have a {user?.membership_type?.toUpperCase()} plan. Please let it expire or contact support to upgrade.</p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10 mb-20">
          {plans.map((p, i) => (
            <motion.div 
              key={p.id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="block-card p-8 flex flex-col hover:-translate-y-3 shadow-xl hover:shadow-2xl h-full"
            >
              <div className="relative z-10 flex flex-col h-full">
                <h3 className="text-2xl font-display font-extrabold text-text-primary mb-2 tracking-tight group-hover:text-primary transition-colors">{p.name}</h3>
                <div className="flex items-end gap-2 mb-10">
                  <span className="text-4xl font-extrabold text-text-primary tracking-tighter">Rs {p.price}</span>
                  <span className="text-text-tertiary text-[10px] font-black mb-1.5 uppercase tracking-widest leading-none">/ Period</span>
                </div>

                <div className="space-y-5 mb-12">
                   {[
                     "Full Dashboard Access",
                     "Historical Price Data",
                     "AI Price Predictions",
                     "Live Data Updates"
                   ].map((feat, idx) => (
                     <div key={idx} className="flex items-center gap-4 text-text-secondary font-bold uppercase tracking-tighter text-[11px]">
                        <div className={`w-6 h-6 rounded-lg ${p.bg} flex items-center justify-center ${p.color} border border-current/5 shadow-sm`}>
                           <Check className="w-4 h-4" />
                        </div>
                        {feat}
                     </div>
                   ))}
                </div>

                <div className="mt-auto">
                   <button
                    onClick={() => handlePurchaseClick(p)}
                    disabled={user && user.membership_type !== 'basic'}
                    className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95 flex items-center justify-center gap-3 group disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed
                      ${p.name === 'VIP Plan' ? 'bg-error text-white shadow-lg shadow-error/20 hover:bg-error/90' : 'bg-slate-50 border border-border-subtle text-text-primary hover:border-secondary/50 hover:bg-white hover:shadow-md'}`}
                  >
                    <span>{user && user.membership_type !== 'basic' ? 'Current Member' : 'Choose Plan'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal logic overlay */}
        <AnimatePresence>
          {step > 1 && (
            <Portal>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-200 flex items-end sm:items-center justify-center bg-slate-900/90 backdrop-blur-xl p-0 sm:p-6 overflow-hidden"
              >
                <motion.div 
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="bg-white border-t sm:border border-border-subtle rounded-t-[40px] sm:rounded-[48px] shadow-2xl w-full max-w-4xl relative overflow-hidden flex flex-col h-full sm:h-auto max-h-screen sm:max-h-[85vh]"
                >
                  {/* Fixed Header */}
                  <div className="p-6 sm:p-10 border-b border-border-subtle flex justify-between items-center relative shrink-0 bg-white z-20">
                    <div className="flex items-center gap-4 sm:gap-5">
                       <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-secondary/5 border border-secondary/20 flex items-center justify-center text-secondary shadow-sm">
                          <Target className="w-7 h-7" />
                       </div>
                        <div>
                          <h3 className="text-2xl font-display font-black text-text-primary tracking-tight">
                            {step === 2 ? `Choose Access Level` : `Confirm Payment`}
                          </h3>
                          <p className="text-[10px] text-text-tertiary font-black uppercase tracking-[0.25em] mt-1.5 flex items-center gap-2">
                             Step {step - 1} of 2 <span className="w-1 h-1 rounded-full bg-border-subtle" /> Secure Connection
                          </p>
                        </div>
                    </div>
                    <button onClick={closeDialog} className="text-text-tertiary hover:text-text-primary transition-all bg-slate-50 hover:bg-white p-3.5 rounded-full border border-border-subtle shadow-sm">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Scrollable Content */}
                  <div className="overflow-y-auto p-0 grow custom-scrollbar bg-slate-50/50">
                    <AnimatePresence mode="wait">
                      {/* Step 2: Member Selection */}
                      {step === 2 && (
                        <motion.div 
                          key="step2"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="p-8 sm:p-12"
                        >
                          <p className="text-text-secondary mb-12 text-sm font-medium leading-relaxed max-w-lg">
                            Choose your access level. Each level gives you more prediction power and features with your <span className="text-text-primary font-black uppercase tracking-widest underline decoration-primary/30 underline-offset-4">{selectedPlan?.name}</span>.
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            <button
                              onClick={() => setMembershipType('half')}
                              className={`group p-6 sm:p-8 rounded-[32px] border-2 text-left transition-all relative overflow-hidden backdrop-blur-xl ${membershipType === 'half' ? 'border-primary bg-white ring-8 ring-primary/5 shadow-xl' : 'border-border-subtle bg-white hover:border-primary/20 hover:shadow-lg'}`}
                            >
                              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl mb-6 sm:mb-8 flex items-center justify-center transition-all duration-500 shadow-sm ${membershipType === 'half' ? 'bg-primary text-white scale-110' : 'bg-slate-50 text-text-tertiary group-hover:text-primary border border-border-subtle'}`}>
                                 <Layers className="w-6 h-6" />
                              </div>
                              <h4 className="text-xl font-display font-black text-text-primary mb-4 uppercase tracking-tighter">Standard</h4>
                              <div className="space-y-4">
                                 {[
                                   "10 Daily Predictions",
                                   "10 Daily AI Training Sessions",
                                   "3,000 Data Points"
                                 ].map((f, idx) => (
                                   <div key={idx} className="flex items-center gap-3 text-[10px] font-black text-text-tertiary uppercase tracking-widest">
                                      <div className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                                      <span>{f}</span>
                                   </div>
                                 ))}
                              </div>
                            </button>

                            <button
                              onClick={() => setMembershipType('full')}
                              className={`group p-6 sm:p-8 rounded-block border-2 text-left transition-all relative overflow-hidden ${membershipType === 'full' ? 'border-secondary bg-white ring-8 ring-secondary/5 shadow-xl' : 'border-border-subtle bg-white hover:border-secondary/20 hover:shadow-lg'}`}
                            >
                              <div className="absolute top-0 right-0">
                                 <div className="bg-secondary text-white text-[8px] font-black tracking-[0.3em] px-4 py-2 rounded-bl-2xl uppercase shadow-sm">Best Choice</div>
                              </div>
                              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl mb-6 sm:mb-8 flex items-center justify-center transition-all duration-500 shadow-sm ${membershipType === 'full' ? 'bg-secondary text-white scale-110' : 'bg-slate-50 text-text-tertiary group-hover:text-secondary border border-border-subtle'}`}>
                                 <ShieldCheck className="w-6 h-6" />
                              </div>
                              <h4 className="text-lg font-display font-black text-text-primary mb-3 uppercase tracking-tighter">Premium</h4>
                              <div className="space-y-3">
                                 {[
                                   "30 Daily Predictions",
                                   "15 Daily AI Training Sessions",
                                   "5,000 Data Points"
                                 ].map((f, idx) => (
                                   <div key={idx} className="flex items-center gap-3 text-[10px] font-black text-text-tertiary uppercase tracking-widest">
                                      <div className="w-1.5 h-1.5 rounded-full bg-secondary/40 group-hover:bg-secondary transition-colors" />
                                      <span>{f}</span>
                                   </div>
                                 ))}
                              </div>
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {/* Step 3: Checkout Summary */}
                      {step === 3 && (
                        <motion.div 
                          key="step3"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="p-8 sm:p-12 pb-32 sm:pb-12"
                        >
                          <div className="bg-white border border-border-subtle rounded-[40px] p-8 sm:p-10 mb-10 shadow-sm">
                            <div className="flex items-center gap-5 mb-10 pb-10 border-b border-border-subtle">
                               <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-border-subtle shadow-sm flex items-center justify-center text-primary">
                                  <Layers className="w-8 h-8" />
                               </div>
                               <div>
                                  <h4 className="text-2xl font-display font-black text-text-primary tracking-tight uppercase">{selectedPlan?.name}</h4>
                                  <p className="text-[10px] text-text-tertiary font-black uppercase tracking-[0.25em] mt-1.5">{membershipType === 'full' ? 'Premium' : 'Standard'} Plan</p>
                               </div>
                            </div>
                            
                            <div className="space-y-6 mb-10 px-2">
                               <div className="flex justify-between items-center text-[11px] font-black tracking-widest uppercase">
                                  <span className="text-text-tertiary">Base Price</span>
                                  <span className="text-text-primary font-mono">Rs {selectedPlan?.price}</span>
                               </div>
                               <div className="flex justify-between items-center text-[11px] font-black tracking-widest uppercase text-success">
                                  <span className="flex items-center gap-2">Renewal Discount <Sparkles className="w-3.5 h-3.5 animate-pulse" /></span>
                                  <span className="font-mono">-Rs {(selectedPlan?.price * 0.2).toFixed(0)}</span>
                               </div>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-between items-center bg-slate-50 -mx-8 sm:-mx-10 -mb-8 sm:-mb-10 p-8 sm:p-10 rounded-b-[40px] border-t border-border-subtle gap-6">
                              <div className="text-center sm:text-left">
                                 <span className="text-[9px] text-text-tertiary font-black uppercase tracking-[0.4em] block mb-2 leading-none">Total Price</span>
                                 <span className="text-4xl font-extrabold text-text-primary font-mono tracking-tighter">Rs {(selectedPlan?.price * 0.8).toFixed(1)}</span>
                              </div>
                              <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white border border-border-subtle text-[9px] font-black text-text-tertiary uppercase tracking-widest shadow-sm">
                                 <CreditCard className="w-4 h-4 text-primary" /> Secure Payment
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-10 flex items-center justify-center gap-3 text-[9px] font-black text-text-tertiary uppercase tracking-[0.4em] opacity-40">
                             <div className="w-4 h-4 rounded-full bg-success/20 flex items-center justify-center">
                                <Check className="w-2.5 h-2.5 text-success" />
                             </div>
                             <span>Secure 256-bit Encryption</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Fixed Footer Buttons */}
                  <div className="p-6 sm:p-10 border-t border-border-subtle bg-white z-20 shrink-0">
                    {step === 2 && (
                      <button 
                        onClick={handleProceedCheckout} 
                        className="w-full bg-text-primary text-white font-black py-6 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-4 group uppercase tracking-[0.3em] text-xs"
                      >
                        <span>Analyze Summary</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" />
                      </button>
                    )}
                    {step === 3 && (
                      <button
                        onClick={handleFinalizePayment}
                        disabled={loading}
                        className="w-full bg-secondary text-white font-black py-6 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-secondary/10 flex items-center justify-center gap-4 disabled:opacity-50 group uppercase tracking-[0.3em] text-xs"
                      >
                        {loading ? <Zap className="w-6 h-6 animate-spin" /> : (
                          <>
                            <ShieldCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span>Pay Now</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            </Portal>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
