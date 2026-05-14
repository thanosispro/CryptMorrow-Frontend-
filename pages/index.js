import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import {
  TrendingUp,
  Shield,
  Zap,
  BarChart3,
  Globe,
  Cpu,
  Lock,
  ChevronRight,
  Play,
  ArrowRight,
  Target,
  BarChart,
  Activity,
  LineChart,
  PieChart
} from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  const { user } = useAuth();
  return (
    <>
      <Head>
        <title>CryptMorrow | Smart AI Crypto Predictions</title>
        <meta name="description" content="Advanced AI tools for clear and simple crypto market predictions." />
      </Head>

      <div className="flex flex-col w-full relative overflow-hidden">
        {/* Ambient Background Elements - GPU Optimized */}
        <div className="absolute top-[-5%] right-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse-soft" />
        <div className="absolute top-[15%] left-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] -z-10 animate-pulse-soft" />

        {/* Section 1: Hero */}
        <section className="relative bg-cyan-100 pt-20 pb-20 lg:pt-32 lg:pb-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <motion.div
                initial="initial"
                animate="animate"
                variants={staggerContainer}
                className="text-center lg:text-left relative z-10"
              >
                <motion.div
                  variants={fadeInUp}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/10 text-primary mb-8"
                >
                  <Zap className="w-4 h-4 fill-primary" />
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em]">Next-Gen Prediction Tool</span>
                </motion.div>

                <motion.h1
                  variants={fadeInUp}
                  className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold text-text-primary leading-[1.1] tracking-tight mb-8"
                >
                  Predict the <br className="hidden sm:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary italic">Future Prices.</span>
                </motion.h1>

                <motion.p
                  variants={fadeInUp}
                  className="text-base sm:text-lg lg:text-xl text-text-secondary leading-relaxed max-w-xl mx-auto lg:mx-0 mb-10 font-medium"
                >
                  Our advanced AI models analyze millions of market trends to give you clear and accurate price predictions.
                </motion.p>

                <motion.div
                  variants={fadeInUp}
                  className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6"
                >
                  <Link href={user ? "/analyze" : "/login"} className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-primary text-white font-bold text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center gap-2">
                    Open Dashboard <ChevronRight className="w-5 h-5" />
                  </Link>
                  <Link href="/about" className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-white border border-border-subtle text-text-secondary font-bold text-lg hover:border-primary/20 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm">
                    How it Works
                  </Link>
                </motion.div>

                <motion.div
                  variants={fadeInUp}
                  className="mt-16 flex items-center justify-center lg:justify-start gap-10 opacity-50 transition-opacity hover:opacity-100"
                >
                  <div className="flex flex-col uppercase tracking-widest text-[10px] font-black text-text-tertiary">
                    <span>Trusted</span>
                    <span>Technology</span>
                  </div>
                  <div className="flex gap-8 items-center flex-wrap justify-center text-text-tertiary">
                    <Target className="w-7 h-7 hover:text-primary transition-colors" />
                    <Globe className="w-7 h-7 hover:text-secondary transition-colors" />
                    <Shield className="w-7 h-7 hover:text-success transition-colors" />
                  </div>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
                className="relative mt-8 lg:mt-0"
              >
                {/* Layered Cards Design */}
                <div className="absolute -top-12 -left-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl animate-pulse-soft" />
                <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-secondary/10 rounded-full blur-3xl animate-pulse-soft" />

                <div className="relative block-section p-3 sm:p-5 overflow-hidden group">
                  <div className="aspect-[16/10] bg-slate-50 rounded-[20px] flex items-center justify-center text-text-tertiary font-mono text-xs overflow-hidden border border-border-subtle transition-transform group-hover:scale-[1.01] duration-500">
                    {/* Visual Placeholder for Crypto Chart/Matrix */}
                    <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:20px_20px]" />
                    <div className="relative flex flex-col items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Activity className="w-8 h-8 text-primary animate-pulse" />
                        <div className="h-2 w-24 bg-primary/20 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: '100%' }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="h-full w-1/2 bg-primary"
                          />
                        </div>
                      </div>
                      <span className="text-[10px] font-bold tracking-[0.3em] uppercase">Analyzing Market Trends</span>
                    </div>
                  </div>

                  {/* Floating Elements - GPU Optimized (Transform only) */}
                  <motion.div
                    animate={{ y: [0, -12, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-6 -right-6 sm:-right-10 bg-surface p-5 rounded-2xl shadow-block-hover border border-blue-100 hidden sm:flex items-center gap-4 backdrop-blur-md"
                  >
                    <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center text-success text-xl font-bold italic shadow-inner">₿</div>
                    <div>
                      <p className="text-[10px] text-text-tertiary font-bold uppercase tracking-widest leading-none mb-1">BTC Prediction</p>
                      <p className="text-sm font-black text-text-primary">+12.4% Market Trend</p>
                    </div>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, 12, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute -bottom-6 -left-6 sm:-left-10 bg-surface p-5 rounded-2xl shadow-block-hover border border-blue-100 hidden sm:flex items-center gap-4 backdrop-blur-md"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                      <Zap className="w-6 h-6 fill-primary/20" />
                    </div>
                    <div>
                      <p className="text-[10px] text-text-tertiary font-bold uppercase tracking-widest leading-none mb-1">Live Update</p>
                      <p className="text-sm font-black text-text-primary">Highly Accurate</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>        {/* Section 2: Capability Matrix */}
        <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="mb-20 text-center max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/10 text-secondary mb-6 text-[10px] font-bold uppercase tracking-widest">
                  Smart Insights
                </div>
                <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-text-primary mb-8 tracking-tight leading-tight">Built for <br />Reliable Predictions.</h2>
                <p className="text-base sm:text-lg text-text-secondary font-medium">We don't just guess. We analyze. Our system is built on smart AI technology designed to handle market changes.</p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'Smart Analysis',
                  desc: 'Advanced AI models that find market patterns which are hard to see otherwise.',
                  icon: Cpu,
                  color: 'bg-slate-200'
                },
                {
                  title: 'Live Updates',
                  desc: 'Instant processing of global market data to give you fast insights.',
                  icon: Zap,
                  color: 'bg-warning'
                },
                {
                  title: 'Safe & Secure',
                  desc: 'Bank-level security ensuring your account and data remain private.',
                  icon: Lock,
                  color: 'bg-secondary'
                }
              ].map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="block-card p-10  hover:-translate-y-2 group"
                >
                  <div className={`p-8 rounded-[32px] bg-indigo-500 border border-blue-100 flex items-center justify-center shadow-lg group hover:scale-[1.05] transition-all mb-10 shadow-${feature.color.split('-')[1]}`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-text-primary mb-4">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-text-secondary leading-relaxed font-medium">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: Empirical Trust */}
        <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-16 lg:gap-24 items-center">
            <div className="lg:col-span-7 order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-6 sm:gap-8">
                {[
                  { label: 'Avg. Success Rate', val: '88.4%', icon: Target, color: 'text-primary' },
                  { label: 'Daily Alerts', val: '12K+', icon: Zap, color: 'text-warning' },
                  { label: 'Active Users', val: '45K+', icon: Users, color: 'text-secondary' },
                  { label: 'Uptime', val: '99.99%', icon: Shield, color: 'text-success' },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="block-card p-8 bg-[#17b4e0]"
                  >
                    <stat.icon className={`w-6 h-6 ${stat.color} mb-6`} />
                    <p className="text-3xl sm:text-4xl font-black text-text-primary mb-1 tracking-tight">{stat.val}</p>
                    <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-[0.2em]">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-5 order-1 lg:order-2 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/10 text-primary mb-6 text-[10px] font-bold uppercase tracking-widest mx-auto lg:mx-0">
                Proven Accuracy
              </div>
              <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-text-primary mb-8 leading-[1.1] tracking-tight">Proven results in every market shift.</h2>
              <p className="text-base sm:text-lg text-text-secondary font-medium mb-10">Our system is tested on over a decade of real-world data, ensuring our models stay accurate even when the market changes.</p>
              <Link href="/analyze" className="inline-flex items-center gap-2 text-primary font-black hover:gap-4 transition-all group text-lg mx-auto lg:mx-0">
                View Accuracy History <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Section 4: Get Started CTA */}
        <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto rounded-[48px] p-8 sm:p-16 lg:p-24 text-center relative overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
            {/* Animated Background Layers for CTA */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 animate-pulse-soft" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 animate-pulse-soft" />

            <div className="relative z-10">
              <motion.h2
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white mb-8 tracking-tight leading-tight"
              >
                Ready to improve <br className="hidden sm:block" /> your trading?
              </motion.h2>
              <p className="text-base sm:text-lg text-slate-100 max-w-xl mx-auto mb-12 font-medium leading-relaxed">Join many other traders using our smart AI tools for better market insights. Your journey to better trading starts here.</p>
              <Link href="/login" className="inline-flex h-16 sm:h-20 px-10 sm:px-14 items-center justify-center rounded-2xl bg-white text-slate-900 font-bold text-xl shadow-2xl hover:scale-[1.05] active:scale-95 transition-all">
                Get Started Now
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

// Minimal placeholder icons to avoid missing imports if Users was missed in lucide list
function Users(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
