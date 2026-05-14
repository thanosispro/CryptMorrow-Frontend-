import Head from 'next/head';
import { motion } from 'framer-motion';
import {
  BarChart3,
  ShieldSecret,
  MapPin,
  Globe2,
  Cpu,
  Target,
  Zap,
  Lock,
  Sparkles
} from 'lucide-react';

export default function About() {
  const currentYear = new Date().getFullYear();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <>
      <Head><title>Origins | CryptMorrow</title></Head>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-24 min-h-screen relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px] -z-10 translate-x-1/2 translate-y-1/2" />

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mb-24 relative z-10"
        >
          <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.25em] mb-8">
            <Globe2 className="w-4 h-4" />
            <span>Institutional Matrix</span>
          </div>
          <h1 className="text-4xl sm:text-6xl lg:text-8xl font-display font-extrabold text-text-primary tracking-tight leading-[0.95] mb-10">
            The Science of <span className="text-secondary italic">Pathways</span>.
          </h1>
          <p className="text-text-secondary text-base sm:text-xl font-medium leading-relaxed max-w-3xl">
            At CryptMorrow, our foundation is built on deep learning computational models.
            We utilize proprietary neural networks to outline potential pathways for the digital asset economy.
            <span className="text-text-primary font-black ml-2 uppercase tracking-widest text-sm">We compute the future.</span>
          </p>
        </motion.div>

        <motion.section
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10"
        >
          {/* Large Feature Card */}
          <motion.div
            variants={item}
            className="md:col-span-2 bg-surface border border-border-subtle rounded-[48px] p-8 sm:p-16 lg:p-24 relative overflow-hidden group shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[150px] rounded-full translate-x-1/4 -translate-y-1/4 pointer-events-none -z-10" />
            <div className="relative z-10 max-w-3xl">
              <div className="w-20 h-20 rounded-[32px] bg-primary text-white flex items-center justify-center mb-12 shadow-2xl shadow-primary/30 group-hover:scale-110 transition-transform duration-500">
                <Cpu className="w-10 h-10" />
              </div>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold text-text-primary mb-10 leading-tight tracking-tight">Computational Precision & Resonance</h2>
              <p className="text-text-tertiary text-base sm:text-xl font-medium leading-relaxed mb-16 max-w-2xl">
                When market paradigms are stable, our algorithms achieve a performance rate of <strong className="text-text-primary font-black underline underline-offset-8 decoration-primary/50">80% to 100%</strong>. We pride ourselves on recognizing stable trend clusters and maximizing profitable operational windows through neural inference.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="px-8 py-4 rounded-2xl bg-base-bg/50 border border-border-subtle text-text-primary font-black uppercase tracking-widest text-[10px] backdrop-blur-xl shadow-inner">80-100% Precision Threshold</div>
                <div className="px-8 py-4 rounded-2xl bg-base-bg/50 border border-border-subtle text-text-primary font-black uppercase tracking-widest text-[10px] backdrop-blur-xl shadow-inner">Zero Latency Synchronization</div>
              </div>
            </div>
          </motion.div>

          {/* Secondary Cards */}
          <motion.div
            variants={item}
            className="bg-surface border border-border-subtle p-10 sm:p-14 rounded-[48px] relative overflow-hidden group hover:border-secondary/40 transition-all duration-500 shadow-2xl flex flex-col"
          >
            <div className="w-14 h-14 rounded-2xl bg-secondary/10 border border-secondary/20 text-secondary flex items-center justify-center mb-10 shadow-lg shadow-secondary/5">
              <Zap className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-display font-extrabold text-text-primary mb-6 uppercase tracking-tight">AI Sovereignty</h3>
            <p className="text-text-secondary font-medium leading-relaxed text-base">
              We are a specialized, localized entity completely reliant on proprietary backend models.
              Our intellectual property remains closed to ensure the operational integrity and exclusiveness of our outputs across the global matrix.
            </p>
          </motion.div>

          <motion.div
            variants={item}
            className="bg-surface border border-border-subtle p-10 sm:p-14 rounded-[48px] relative overflow-hidden group hover:border-primary/40 transition-all duration-500 shadow-2xl flex flex-col"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mb-10 shadow-lg shadow-primary/5">
              <Target className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-display font-extrabold text-text-primary mb-6 uppercase tracking-tight">Operational Integrity</h3>
            <p className="text-text-secondary font-medium leading-relaxed text-base">
              Market footprints and user identity matrices are encrypted end-to-end. We protect your privacy and personal data rigorously through secure cryptographic protocols and decentralized node verification.
            </p>
            <div className="mt-auto pt-10 border-t border-border-subtle flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-base-bg border border-border-subtle flex items-center justify-center text-text-tertiary shadow-inner">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black text-text-primary uppercase tracking-[0.3em]">Kathmandu, Nexus Central</span>
            </div>
          </motion.div>

        </motion.section>
      </div>
    </>
  );
}
