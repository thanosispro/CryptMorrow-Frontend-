import Head from 'next/head';
import { motion } from 'framer-motion';

export default function Contact() {
  return (
    <>
      <Head><title>Contact | CryptMorrow</title></Head>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24 lg:py-32 min-h-screen flex flex-col justify-center items-center text-center relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-primary/5 rounded-full blur-[160px] -z-10 animate-pulse-soft" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[160px] -z-10 animate-float" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 w-full max-w-5xl"
        >
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-xl bg-secondary/5 border border-secondary/10 text-secondary text-[10px] font-black uppercase tracking-[0.4em] w-fit mb-12 mx-auto shadow-sm">
            Contact Support
          </div>
          <h1 className="text-5xl sm:text-7xl lg:text-9xl font-display font-extrabold text-text-primary mb-10 tracking-tighter leading-none">
            Get In <span className="text-primary italic">Touch</span>
          </h1>
          <p className="text-text-secondary max-w-3xl mx-auto mb-2 relative z-10 text-lg sm:text-2xl font-medium leading-[1.6]">
            Have questions regarding our AI models or subscription plans? Connect with our team and community on our official channels.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-24 lg:px-6">
            {[
              { name: "Discord", identifier: "D", color: "#5865F2", label: "Community & Support", delay: 0.1 },
              { name: "GitHub", identifier: "G", color: "#0F172A", label: "Developer Resources", delay: 0.2 },
              { name: "Twitter", identifier: "X", color: "#1DA1F2", label: "News & Updates", delay: 0.3 }
            ].map((channel, i) => (
              <motion.a 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: channel.delay }}
                href="#" 
                className="group block-card p-12 shadow-sm hover:shadow-xl hover:border-text-primary/20 transition-all duration-700 flex flex-col items-center relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 transition-all duration-700 group-hover:scale-150" />
                <div 
                  className="w-16 h-16 rounded-[24px] flex items-center justify-center text-white mb-10 border transition-all duration-700 shadow-lg group-hover:scale-110 group-hover:rotate-6"
                  style={{ backgroundColor: channel.color, borderColor: `${channel.color}20` }}
                >
                   <h2 className="text-2xl font-black">{channel.identifier}</h2>
                </div>
                <h2 className="text-2xl font-display font-black text-text-primary mb-3 uppercase tracking-tighter">{channel.name}</h2>
                <p className="text-text-tertiary text-[10px] font-black uppercase tracking-[0.3em]">{channel.label}</p>
                <div 
                  className="absolute bottom-0 left-0 h-1 transition-all duration-700 w-0 group-hover:w-full"
                  style={{ backgroundColor: channel.color }}
                />
              </motion.a>
            ))}
          </div>
          
          <div className="mt-32 pt-14 border-t border-border-subtle">
             <p className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.5em] animate-pulse">Secure Connection Active</p>
          </div>
        </motion.div>
      </div>
    </>
  );
}
