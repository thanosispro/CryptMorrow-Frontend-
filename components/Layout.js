import Navbar from './Navbar';
import Footer from './Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import Lenis from 'lenis';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Layout({ children }) {
  const router = useRouter();
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-base-bg selection:bg-primary/20 selection:text-primary relative overflow-x-hidden">
      <Head>
        <link rel="icon" href="/logo.png" />
        <title>CryptMorrow | AI Crypto Predictions</title>
      </Head>

      {/* Dynamic Background Glows */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10 translate-x-1/3 -translate-y-1/3" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] -z-10 -translate-x-1/3 translate-y-1/3" />

      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main
          key={router.asPath}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="grow pt-20 pb-12"
        >
          {children}
        </motion.main>
      </AnimatePresence>
      <Footer />
    </div>
  );
}
