import Head from 'next/head';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { motion } from 'framer-motion';
import { 
  User, 
  Settings, 
  ShieldCheck, 
  Database, 
  Zap, 
  Lock, 
  Edit3, 
  CheckCircle2, 
  BarChart3,
  Calendar,
  AlertCircle
} from 'lucide-react';

export default function Profile() {
  const { user, login } = useAuth();
  const [newUsername, setNewUsername] = useState(user?.username || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch real-time user data to ensure latest credits and membership
  useEffect(() => {
    const fetchUserData = async () => {
      const token = Cookies.get('cryptmorrow_access_token');
      if (!token) return;

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/user/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.id) {
          const tokenRefresh = Cookies.get('cryptmorrow_refresh_token');
          login(data, token, tokenRefresh);
          setNewUsername(data.username);
        }
      } catch (err) {
        console.error('Failed to fetch real-time user data:', err);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdate = async () => {
    if (!newUsername.trim()) return;
    setLoading(true);
    setMessage('');
    try {
      const token = Cookies.get('cryptmorrow_access_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/update_username/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username: newUsername })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setMessage('success:Username updated successfully.');
        // Update local context
        const tokenRefresh = Cookies.get('cryptmorrow_refresh_token');
        login({ ...user, username: newUsername }, token, tokenRefresh);
      } else {
        setMessage(`error:${data.error || 'Failed to update username.'}`);
      }
    } catch (err) {
      setMessage('error:Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 bg-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-error/5 rounded-full blur-[120px] -z-10 animate-pulse-soft" />
        <div className="w-24 h-24 rounded-[32px] bg-error/5 border border-error/10 flex items-center justify-center text-error mb-10 shadow-sm animate-float">
           <Lock className="w-10 h-10" />
        </div>
        <h2 className="text-4xl font-display font-extrabold text-text-primary tracking-tight mb-4">Access Denied</h2>
        <p className="text-text-secondary text-lg font-medium max-w-md text-center leading-relaxed">
          Please log in to view your profile and manage your account settings.
        </p>
        <div className="mt-12 flex gap-4">
           <button onClick={() => window.location.href = '/login'} className="px-8 py-4 bg-text-primary text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-xl">
             Log In Now
           </button>
        </div>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <>
      <Head><title>Account Settings | CryptMorrow</title></Head>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16 min-h-screen relative">
        {/* Ambient glows */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 -translate-x-1/2 -translate-y-1/2 animate-pulse-soft" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] -z-10 translate-x-1/2 translate-y-1/2 animate-pulse-soft" />

        {/* Header Section */}
        <div className="mb-16 lg:mb-20 relative z-10 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-6">
              <User className="w-4 h-4 fill-primary/20" />
              <span>Account Control</span>
            </div>
          <h1 className="text-4xl lg:text-7xl font-display font-extrabold text-text-primary tracking-tight mb-6">
            Account <span className="text-secondary">Overview</span>
          </h1>
          <p className="text-text-secondary text-base sm:text-xl max-w-2xl font-medium leading-relaxed">
            Manage your account settings, view your subscription status, and track your activity logs all in one place.
          </p>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10"
        >
          {/* Main Profile Card */}
          <motion.div 
            variants={item}
            className="lg:col-span-2 block-section p-8 sm:p-12 shadow-sm relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 blur-[120px] pointer-events-none -z-10 animate-pulse-soft" />
             
             <div className="flex flex-col md:flex-row gap-12 lg:gap-16">
                {/* Avatar & Side Info */}
                <div className="flex flex-col items-center gap-10 text-center md:border-r border-border-subtle md:pr-12 lg:pr-16 grow-0 min-w-[200px]">
                   <div className="relative group">
                      <div className="w-32 h-32 lg:w-44 lg:h-44 rounded-[40px] border-8 border-white shadow-xl overflow-hidden relative z-10 transition-transform duration-500 group-hover:scale-105">
                        <img src={user.profile_pic || "https://api.dicebear.com/9.x/avataaars/svg?seed=cryptmorrow_user"} alt="Profile" className="w-full h-full object-cover" />
                      </div>
                      <div className="absolute -bottom-3 -right-3 w-14 h-14 rounded-2xl bg-success text-white flex items-center justify-center shadow-lg shadow-success/20 z-20 border-4 border-white animate-float">
                         <ShieldCheck className="w-7 h-7" />
                      </div>
                   </div>
                   
                    <div className="space-y-4 w-full">
                      <div className="px-6 py-4 rounded-2xl bg-white border border-blue-100 shadow-sm relative overflow-hidden group">
                         <div className="absolute top-0 right-0 w-16 h-16 bg-success/5 rounded-full blur-xl translate-x-1/2 -translate-y-1/2 transition-all group-hover:scale-150" />
                         <span className="text-[9px] text-text-tertiary font-black uppercase tracking-[0.25em] block mb-2 relative z-10">Status</span>
                         <span className="text-[10px] font-black text-text-primary flex items-center justify-center gap-2 uppercase tracking-widest relative z-10">
                            <div className="w-2 h-2 rounded-full bg-success animate-pulse" /> Logged In
                         </span>
                      </div>

                      <div className="px-6 py-4 rounded-2xl bg-white border border-blue-100 shadow-sm overflow-hidden group relative">
                         <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-full blur-xl translate-x-1/2 -translate-y-1/2 transition-all group-hover:scale-150" />
                         <span className="text-[9px] text-text-tertiary font-black uppercase tracking-[0.25em] block mb-2 relative z-10">Email Address</span>
                         <span className="text-[11px] font-bold text-text-secondary truncate block w-full relative z-10" title={user.email}>{user.email}</span>
                      </div>
                   </div>
                </div>

                {/* Configuration Section */}
                <div className="flex-1 space-y-12">
                   <div>
                      <div className="flex items-center gap-4 mb-10 pb-6 border-b border-border-subtle">
                         <div className="w-12 h-12 rounded-xl bg-secondary/5 flex items-center justify-center text-secondary border border-secondary/10 shadow-sm">
                            <Settings className="w-6 h-6" />
                         </div>
                         <div>
                            <h3 className="text-xl font-display font-extrabold text-text-primary tracking-tight">ACCOUNT SETTINGS</h3>
                            <p className="text-[10px] text-text-tertiary font-black uppercase tracking-widest mt-1">Change Your Details</p>
                         </div>
                      </div>
                      
                      <div className="space-y-10">
                          <div>
                            <label className="block text-[10px] text-text-tertiary font-black uppercase tracking-[0.3em] mb-4 px-1">Display Username</label>
                            <div className="relative group">
                               <input 
                                 type="text" 
                                 value={newUsername}
                                 onChange={(e) => setNewUsername(e.target.value)}
                                 className="w-full bg-white border border-blue-100 rounded-2xl px-7 py-5 text-text-primary font-black tracking-tight focus:outline-none focus:border-primary focus:ring-8 focus:ring-primary/5 transition-all text-xl placeholder:font-bold placeholder:text-text-tertiary/20 uppercase shadow-sm" 
                               />
                               <Edit3 className="absolute right-7 top-1/2 -translate-y-1/2 w-6 h-6 text-text-tertiary pointer-events-none group-focus-within:text-primary transition-colors duration-500" />
                            </div>
                            
                            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                               <button 
                                 onClick={handleUpdate} 
                                 disabled={loading} 
                                 className="w-full sm:w-auto px-10 py-5 bg-text-primary text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-slate-800 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
                               >
                                 {loading ? <Zap className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4 fill-white/20" />}
                                 <span>{loading ? 'UPDATING...' : 'Save Changes'}</span>
                               </button>

                               {message && (
                                 <motion.div 
                                   initial={{ opacity: 0, scale: 0.9 }}
                                   animate={{ opacity: 1, scale: 1 }}
                                   className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm ${message.startsWith('success') ? 'bg-success/5 text-success border border-success/10' : 'bg-error/5 text-error border border-error/10'}`}
                                 >
                                    {message.startsWith('success') ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                    {message.split(':')[1]}
                                 </motion.div>
                               )}
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="pt-12 mt-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                         <div className="p-6 rounded-[28px] bg-white border border-blue-100 shadow-sm group hover:border-primary/20 transition-all cursor-default overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                            <p className="text-[9px] text-text-tertiary font-black uppercase tracking-widest mb-2 relative z-10">User ID</p>
                            <p className="text-base font-black text-text-primary font-mono tracking-tighter relative z-10">USER_{user.id?.toString().padStart(8, '0')}</p>
                         </div>
                         <div className="p-6 rounded-[28px] bg-white border border-blue-100 shadow-sm group hover:border-success/20 transition-all cursor-default overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-success/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                            <p className="text-[9px] text-text-tertiary font-black uppercase tracking-widest mb-2 relative z-10">Account Status</p>
                            <p className="text-base font-black text-text-primary font-mono tracking-tighter uppercase flex items-center gap-2 relative z-10">
                               <div className="w-2 h-2 rounded-full bg-success shadow-[0_0_10px_rgba(34,197,94,0.6)] animate-pulse" /> Verified
                            </p>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </motion.div>

          {/* Sidebar Info Cards */}
          <div className="space-y-8">
            {/* Membership Card */}
            <motion.div variants={item} className="block-card p-10 shadow-lg relative overflow-hidden group border-primary/20 bg-primary/5">
               <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 blur-[80px] rounded-full group-hover:bg-primary/20 transition-colors pointer-events-none -z-10 animate-pulse-soft" />
               <div className="relative z-10">
                  <div className="flex items-center justify-between mb-10">
                     <span className="text-[10px] font-black uppercase text-primary tracking-[0.3em]">Subscription Plan</span>
                     <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-primary/10 flex items-center justify-center text-primary animate-float">
                        <Zap className="w-6 h-6 fill-primary/10" />
                     </div>
                  </div>
                  
                  <div className="mb-10">
                     <h4 className="text-5xl font-display font-black text-text-primary tracking-tighter mb-2">
                       {user.membership_type !== 'basic' ? `${user.membership_type.toUpperCase()}` : 'BASIC'}
                     </h4>
                     <p className="text-text-tertiary text-[10px] font-black uppercase tracking-[0.4em]">Access Level</p>
                  </div>

                  <div className="space-y-6 mb-12">
                     <div className="flex justify-between items-center text-[10px]">
                        <span className="text-text-tertiary font-black uppercase tracking-widest">Reliability</span>
                        <span className="text-primary font-mono font-black">HIGH</span>
                     </div>
                     <div className="w-full h-2 bg-white rounded-full overflow-hidden shadow-inner p-0.5 border border-primary/5">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(((user.credit_analysis || 0) / 30) * 100, 100)}%` }}
                          transition={{ duration: 1.5, delay: 0.5 }}
                          className="h-full bg-primary rounded-full shadow-[0_0_15px_rgba(37,99,235,0.4)]" 
                        />
                     </div>
                  </div>

                  <div className="flex items-center gap-5 px-6 py-5 rounded-2xl bg-white border border-primary/10 text-text-primary shadow-sm mb-6">
                    <Database className="w-6 h-6 text-primary" />
                    <div className="flex flex-col">
                      <span className="text-[9px] text-text-tertiary font-black uppercase tracking-widest mb-1 text-left">Daily Credits Left</span>
                      <span className="text-xl font-black font-mono tracking-tight text-primary">
                        {user.credit_analysis || 0} / {user.membership_type === 'full' ? 30 : user.membership_type === 'half' ? 15 : 2}
                      </span>
                    </div>
                  </div>

                  {user.expiry_date && (
                    <div className="flex items-center gap-5 px-6 py-5 rounded-2xl bg-white border border-primary/10 text-text-primary shadow-sm group-hover:shadow-md transition-shadow">
                       <Calendar className="w-6 h-6 text-primary" />
                       <div className="flex flex-col">
                          <span className="text-[9px] text-text-tertiary font-black uppercase tracking-widest mb-1 text-left">Plan Expires On</span>
                          <span className="text-[11px] font-black font-mono tracking-tight uppercase">
                             {new Date(user.expiry_date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                          </span>
                       </div>
                    </div>
                  )}
               </div>
            </motion.div>

            {/* Stats Card */}
            <motion.div variants={item} className="block-card p-10 shadow-sm relative overflow-hidden group">
               <div className="absolute bottom-0 right-0 w-32 h-32 bg-secondary/5 blur-[80px] rounded-full pointer-events-none -z-10 animate-pulse-soft" />
               
               <div className="flex items-center gap-4 mb-12 pb-6 border-b border-border-subtle">
                  <div className="w-12 h-12 rounded-xl bg-secondary/5 flex items-center justify-center text-secondary border border-secondary/10 shadow-sm">
                     <BarChart3 className="w-6 h-6" />
                  </div>
                  <div>
                     <h3 className="text-lg font-display font-extrabold text-text-primary uppercase tracking-tight">Your Activity</h3>
                     <p className="text-[10px] text-text-tertiary font-black uppercase tracking-widest mt-1">Stats Overview</p>
                  </div>
               </div>

               <div className="space-y-10">
                  <div className="flex items-center justify-between group/stat">
                     <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-border-subtle flex items-center justify-center text-success group-hover/stat:scale-110 group-hover/stat:bg-white group-hover/stat:shadow-md transition-all">
                           <Database className="w-6 h-6 fill-success/5" />
                        </div>
                        <div>
                           <p className="text-[11px] font-black text-text-primary uppercase tracking-widest leading-none mb-1.5">AI Trainings</p>
                           <p className="text-[9px] font-bold text-text-tertiary uppercase tracking-[0.2em] leading-none">Times models were trained</p>
                        </div>
                     </div>
                     <span className="text-2xl font-black text-text-primary font-mono tracking-tighter">{user.total_train?.toLocaleString() || 0}</span>
                  </div>

                  <div className="flex items-center justify-between group/stat">
                     <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-border-subtle flex items-center justify-center text-primary group-hover/stat:scale-110 group-hover/stat:bg-white group-hover/stat:shadow-md transition-all">
                           <Zap className="w-6 h-6 fill-primary/5" />
                        </div>
                        <div>
                           <p className="text-[11px] font-black text-text-primary uppercase tracking-widest leading-none mb-1.5">AI Predictions</p>
                           <p className="text-[9px] font-bold text-text-tertiary uppercase tracking-[0.2em] leading-none">Total predictions made</p>
                        </div>
                     </div>
                     <span className="text-2xl font-black text-text-primary font-mono tracking-tighter">{user.total_analysis?.toLocaleString() || 0}</span>
                  </div>
               </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
