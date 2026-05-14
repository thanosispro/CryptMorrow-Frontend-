import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
   Shield,
   ArrowRight,
   ChevronRight,
   User,
   Mail,
   Zap,
   Globe,
   Cpu,
   Lock,
   Sparkles,
   ArrowLeft,
   ShieldCheck
} from 'lucide-react';

export default function Login() {
   const router = useRouter();
   const { login, user } = useAuth();
   const { showToast } = useToast();

   const [loading, setLoading] = useState(false);
   const [showUsernamePrompt, setShowUsernamePrompt] = useState(false);
   const [pendingGoogleData, setPendingGoogleData] = useState(null);
   const [usernameInput, setUsernameInput] = useState('');

   useEffect(() => {
      if (user) {
         router.push('/');
      }
   }, [user, router]);

   useEffect(() => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      return () => {
         if (document.body.contains(script)) {
            document.body.removeChild(script);
         }
      };
   }, []);

   const handleCredentialResponse = async (response) => {
      console.log(response)
      setLoading(true);
      try {
         const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: response.credential })
         });
         const data = await res.json();
         console.log(data)
         if (data.status === 'success') {
            login(data.user, data.access, data.refresh);
         } else if (data.status === 'needs_username') {
            console.log("first time")
            setPendingGoogleData({
               email: data.email,
               name: data.name,
               picture: data.picture
            });
            setShowUsernamePrompt(true);
         } else {
            showToast(data.error || 'Login failed. Please try again.', 'error');
         }
      } catch (err) {
         console.log(err)
         showToast('Connection failed. Please try again later.', 'error');
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      const timer = setInterval(() => {
         if (window.google) {
            clearInterval(timer);
            window.google.accounts.id.initialize({
               client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
               callback: handleCredentialResponse
            });
            window.google.accounts.id.renderButton(
               document.getElementById('google-button-container'),
               {
                  theme: 'outline',
                  size: 'large',
                  type: 'standard',
                  shape: 'rectangular',
                  width: 380,
                  logo_alignment: 'center',
                  text: 'continue_with'
               }
            );
         }
      }, 100);
      return () => clearInterval(timer);
   }, []);

   const handleRegister = async () => {
      if (!usernameInput.trim()) return showToast('Username is required', 'error');
      setLoading(true);
      try {
         const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               username: usernameInput,
               email: pendingGoogleData.email,
               name: pendingGoogleData.name,
               picture: pendingGoogleData.picture
            })
         });
         const data = await res.json();
         if (data.status === 'success') {
            login(data.user, data.access, data.refresh);
            setShowUsernamePrompt(false);
         } else {
            showToast(data.error || 'Registration failed.', 'error');
         }
      } catch (err) {
         showToast('Connection error during registration.', 'error');
      } finally {
         setLoading(false);
      }
   };

   return (
      <>
         <Head><title>Sign In | CryptMorrow</title></Head>
         <div className="min-h-screen flex bg-base-bg font-sans text-text-primary overflow-hidden relative">

            {/* Visual Brand Side - Refined Light Theme */}
            <div className="hidden lg:flex w-[45%] relative bg-slate-50 overflow-hidden border-r border-border-subtle flex-col p-16 justify-between shrink-0">
               <div className="absolute inset-0 z-0 opacity-60">
                  <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-pulse-soft" />
                  <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] animate-pulse-soft" />
                  <Image
                     src="/login-bg.png"
                     alt="Dashboard Mockup"
                     fill
                     className="object-cover mix-blend-overlay opacity-20 grayscale"
                     priority
                  />
               </div>

               <div className="relative z-10">
                  <motion.div
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     className="flex items-center gap-4 mb-24"
                  >
                     <div className="w-14 h-14 relative overflow-hidden rounded-2xl shadow-xl shadow-text-primary/10 border border-white/10 animate-float">
                        <Image 
                           src="/logo.png" 
                           alt="CryptMorrow Logo" 
                           fill 
                           className="object-cover"
                        />
                     </div>
                     <span className="text-4xl font-display font-black tracking-tighter text-text-primary uppercase">CryptMorrow</span>
                  </motion.div>

                  <motion.div
                     initial={{ opacity: 0, y: 30 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: 0.2 }}
                     className="max-w-md"
                  >
                     <h1 className="text-5xl sm:text-6xl font-display font-extrabold leading-[1.05] text-text-primary mb-8 tracking-tight">
                        The future of <span className="text-primary italic">market</span> insights.
                     </h1>
                     <p className="text-text-secondary text-xl font-medium leading-relaxed mb-12">
                        Access advanced market predictions and real-time data streams in a single unified interface.
                     </p>

                     <div className="flex flex-col gap-6">
                        {[
                           { icon: Shield, text: "Secure, encrypted user sessions", color: "text-primary", bg: "bg-primary/5" },
                           { icon: Globe, text: "Verified global market data", color: "text-secondary", bg: "bg-secondary/5" },
                           { icon: Zap, text: "Fast, real-time AI analysis", color: "text-accent", bg: "bg-accent/5" }
                        ].map((item, i) => (
                           <div key={i} className="flex items-center gap-5 text-sm font-bold text-text-secondary group">
                              <div className={`w-12 h-12 rounded-xl ${item.bg} border border-current/10 flex items-center justify-center ${item.color} shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-500`}>
                                 <item.icon className="w-6 h-6" />
                              </div>
                              <span className="group-hover:text-text-primary transition-colors">{item.text}</span>
                           </div>
                        ))}
                     </div>
                  </motion.div>
               </div>

               <div className="relative z-10 pt-12 border-t border-border-subtle">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-4 text-[10px] font-black text-text-tertiary uppercase tracking-[0.25em]">
                        <span className="w-2.5 h-2.5 rounded-full bg-success animate-pulse shadow-[0_0_12px_rgba(34,197,94,0.4)]"></span>
                        System status: Online
                     </div>
                     <div className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest opacity-40">© {new Date().getFullYear()} CryptMorrow</div>
                  </div>
               </div>
            </div>

            {/* Interaction Side */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 lg:p-24 relative bg-white overflow-y-auto min-h-screen">
               <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full max-w-[360px] sm:max-w-md mx-auto"
               >
                  <div className="mb-14">
                     <div className="lg:hidden flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 relative overflow-hidden rounded-xl border border-border-subtle shadow-lg">
                           <Image 
                              src="/logo.png" 
                              alt="CryptMorrow Logo" 
                              fill 
                              className="object-cover"
                           />
                        </div>
                        <span className="text-3xl font-display font-black tracking-tighter text-text-primary uppercase">CryptMorrow</span>
                     </div>
                     <h2 className="text-4xl font-display font-black text-text-primary mb-4 tracking-tight uppercase">Sign In</h2>
                     <p className="text-text-secondary text-lg font-medium leading-relaxed">
                        Please sign in using your account below to access your personal dashboard.
                     </p>
                  </div>
                  <div className="space-y-6 w-full">
                     <div className="relative pb-2">
                        <div className="absolute inset-0 flex items-center">
                           <div className="w-full border-t border-border-subtle"></div>
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase font-black text-text-tertiary bg-white px-5 tracking-[0.3em]">
                           Continue With
                        </div>
                     </div>

                     <div className="relative">
                        {loading && !showUsernamePrompt ? (
                           <div className="w-full h-[60px] bg-slate-50 border border-border-subtle rounded-2xl flex items-center justify-center shadow-inner">
                              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                           </div>
                        ) : (
                           <div id="google-button-container" className="flex justify-center w-full min-h-[60px] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-border-subtle bg-white"></div>
                        )}
                     </div>

                     <div className="pt-2 space-y-4">
                        {[
                           { icon: Lock, text: "Biometric Login", status: "Deprecated" },
                           { icon: Globe, text: "Social Login", status: "Locked" }
                        ].map((btn, i) => (
                           <button key={i} disabled className="w-full group px-7 py-5 rounded-[24px] border border-border-subtle bg-slate-50/50 flex items-center justify-between transition-all opacity-40 cursor-not-allowed grayscale shadow-sm">
                              <div className="flex items-center gap-5">
                                 <div className="w-10 h-10 rounded-xl bg-white border border-border-subtle flex items-center justify-center text-text-tertiary shadow-sm">
                                    <btn.icon className="w-5 h-5" />
                                 </div>
                                 <div>
                                    <span className="text-xs font-black text-text-tertiary uppercase tracking-widest block">{btn.text}</span>
                                    <span className="text-[8px] font-black text-error/60 uppercase tracking-tighter">{btn.status}</span>
                                 </div>
                              </div>
                              <ChevronRight className="w-5 h-5 text-text-tertiary/40" />
                           </button>
                        ))}
                     </div>
                  </div>

                  <div className="mt-16 p-8 rounded-[40px] bg-slate-50 border border-border-subtle shadow-sm relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                     <div className="flex gap-5 relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-white border border-primary/20 shadow-md flex items-center justify-center text-primary shrink-0 animate-float">
                           <Shield className="w-6 h-6" />
                        </div>
                        <div>
                           <h4 className="text-[11px] font-black uppercase text-text-primary tracking-widest mb-2 leading-none">Security Protocol</h4>
                           <p className="text-[12px] text-text-secondary font-medium leading-relaxed">
                              Legacy credential segments have been deprecated to enforce total operational security across all neural nodes.
                           </p>
                        </div>
                     </div>
                  </div>
               </motion.div>
            </div>

            {/* Registration Modal Overlay - Refined Light Theme */}
            <AnimatePresence>
               {showUsernamePrompt && (
                  <motion.div
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     className="fixed inset-0 z-[100] backdrop-blur-3xl bg-slate-900/20 flex items-center justify-center p-6 sm:p-8"
                  >
                     <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        className="bg-white border border-border-subtle w-full max-w-xl rounded-[56px] shadow-2xl p-10 md:p-16 relative overflow-hidden"
                     >
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 blur-[120px] rounded-full -z-10 translate-x-1/4 -translate-y-1/4 animate-pulse-soft"></div>

                        <div className="text-center mb-14">
                           <div className="relative inline-block mb-10">
                              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-[40px] overflow-hidden border-[6px] border-white shadow-2xl relative z-10 mx-auto transition-transform duration-500 hover:scale-105">
                                 <Image
                                    src={pendingGoogleData?.picture || `https://api.dicebear.com/9.x/avataaars/svg?seed=${pendingGoogleData?.email || 'user'}`}
                                    alt="Verified Identity"
                                    fill
                                    className="object-cover"
                                    referrerPolicy="no-referrer"
                                 />
                              </div>
                              <div className="absolute -bottom-3 -right-3 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-success text-white flex items-center justify-center shadow-lg shadow-success/20 z-20 border-4 border-white animate-float">
                                 <ShieldCheck className="w-8 h-8" />
                              </div>
                           </div>
                           <h3 className="text-4xl font-display font-black text-text-primary mb-4 tracking-tight uppercase">Identity Handshake</h3>
                           <p className="text-text-tertiary font-bold text-[10px] uppercase tracking-[0.25em] leading-relaxed">
                              Authorized Bridge for <span className="text-primary italic font-black">{pendingGoogleData?.email}</span>
                           </p>
                        </div>

                        <div className="space-y-12">
                           <div>
                              <label className="block text-[10px] font-black uppercase text-text-tertiary tracking-[0.4em] mb-5 px-1">Establish Terminal Alias</label>
                              <div className="relative group">
                                 <input
                                    type="text"
                                    value={usernameInput}
                                    onChange={(e) => setUsernameInput(e.target.value)}
                                    placeholder="e.g. ALPHA_COMMANDER_01"
                                    className="w-full bg-slate-50 border border-border-subtle rounded-3xl px-8 py-6 text-text-primary font-black tracking-tight focus:outline-none focus:border-primary focus:ring-[12px] focus:ring-primary/5 transition-all text-2xl placeholder:font-bold placeholder:text-text-tertiary/20 uppercase"
                                 />
                                 <User className="absolute right-8 top-1/2 -translate-y-1/2 w-8 h-8 text-text-tertiary pointer-events-none group-focus-within:text-primary transition-colors duration-500" />
                              </div>
                              <p className="text-[10px] text-text-tertiary font-black mt-6 px-3 flex items-center gap-3 uppercase tracking-widest opacity-60">
                                 <Sparkles className="w-4 h-4 text-warning animate-pulse" /> This identifier will represent your node across the neural matrix.
                              </p>
                           </div>

                           <div className="flex flex-col sm:flex-row gap-5">
                              <button
                                 onClick={() => setShowUsernamePrompt(false)}
                                 className="flex-1 py-6 rounded-2xl bg-slate-50 border border-border-subtle text-text-secondary font-black uppercase tracking-widest text-[11px] hover:bg-white hover:shadow-md active:scale-95 transition-all flex items-center justify-center gap-3"
                              >
                                 <ArrowLeft className="w-5 h-5" /> Abort_Handshake
                              </button>
                              <button
                                 onClick={handleRegister} disabled={loading}
                                 className="flex-[1.5] py-6 rounded-2xl bg-text-primary text-white font-black uppercase tracking-[0.25em] text-[11px] hover:scale-[1.02] hover:shadow-xl active:scale-95 transition-all shadow-lg flex items-center justify-center gap-4 disabled:opacity-50 group"
                              >
                                 {loading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : (
                                    <>
                                       <span>Initialize Node</span>
                                       <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-500" />
                                    </>
                                 )}
                              </button>
                           </div>
                        </div>
                     </motion.div>
                  </motion.div>
               )}
            </AnimatePresence>
         </div>
      </>
   );
}
