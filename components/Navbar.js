import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import Image from 'next/image';
import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  LogOut, 
  User as UserIcon, 
  ChevronDown, 
  TrendingUp, 
  LayoutDashboard, 
  Tag, 
  Database, 
  Info, 
  Mail 
} from 'lucide-react';
import ConfirmModal from './ConfirmModal';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [avatarError, setAvatarError] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const avatarSrc = useMemo(() => {
    if (avatarError || !user?.profile_pic) {
      return `https://api.dicebear.com/9.x/avataaars/svg?seed=${user?.username || 'cryptmorrow'}`;
    }
    return user.profile_pic;
  }, [avatarError, user]);

  const navLinks = [
    { name: 'Home', href: '/', icon: LayoutDashboard },
    { name: 'Analyze', href: '/analyze', icon: TrendingUp },
    { name: 'Pricing', href: '/pricing', icon: Tag },
    { name: 'Market Data', href: '/datas', icon: Database },
    { name: 'About', href: '/about', icon: Info },
    { name: 'Contact', href: '/contact', icon: Mail },
  ];

  return (
    <nav 
      className={`fixed top-0 z-100 w-full transition-all duration-500 ${
        isScrolled ? 'bg-white/70 backdrop-blur-xl border-b border-border-subtle py-3 shadow-sm' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group relative z-101">
          <div className="w-10 h-10 relative overflow-hidden rounded-xl shadow-lg shadow-primary/10 group-hover:scale-110 transition-transform">
             <Image 
                src="/logo.png" 
                alt="CryptMorrow Logo" 
                fill 
                className="object-cover"
             />
          </div>
          <span className="text-xl sm:text-2xl font-display font-extrabold text-text-primary tracking-tight">
            Crypt<span className="text-primary italic">Morrow</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1 bg-white/50 border border-border-subtle p-1.5 rounded-2xl backdrop-blur-md shadow-sm">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className="px-5 py-2 text-sm font-bold text-text-secondary hover:text-primary hover:bg-white rounded-xl transition-all"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3 relative z-101">
          {user ? (
            <div className="flex items-center gap-2 sm:gap-4">
              <Link href="/profile" className="flex items-center gap-3 p-1 pr-4 bg-white hover:bg-slate-50 border border-border-subtle rounded-full transition-all group shadow-sm">
                <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-primary/10 overflow-hidden bg-slate-100">
                  <Image 
                    src={avatarSrc} 
                    alt="Avatar" 
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                    onError={() => setAvatarError(true)}
                  />
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-[12px] font-bold text-text-primary leading-none mb-1">{user.username}</p>
                  <p className="text-[9px] text-primary font-bold uppercase tracking-widest leading-none">
                    {user.membership_type !== 'basic' ? 'Premium' : 'Standard'}
                  </p>
                </div>
              </Link>
              <button 
                onClick={() => setShowLogoutConfirm(true)} 
                className="p-2 sm:p-2.5 text-text-secondary hover:text-error hover:bg-error/5 rounded-xl transition-all"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
               <Link href="/login" className="hidden sm:block px-4 py-2 text-sm font-bold text-text-secondary hover:text-text-primary transition-colors">
                Sign In
              </Link>
              <Link href="/login" className="px-5 sm:px-7 py-2.5 rounded-xl bg-primary text-white text-xs sm:text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.05] active:scale-95 transition-all">
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Toggle */}
          <button 
            className="lg:hidden p-2 text-text-secondary hover:bg-slate-100 rounded-xl transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-[calc(100%+8px)] left-4 right-4 bg-white/90 backdrop-blur-xl border border-border-subtle rounded-block shadow-2xl overflow-hidden lg:hidden"
          >
            <div className="p-3 grid grid-cols-1 gap-1">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-text-secondary group-hover:text-primary transition-colors">
                    <link.icon className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-text-secondary group-hover:text-text-primary transition-colors">{link.name}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Logout Confirmation */}
      <ConfirmModal 
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={logout}
        title="Sign Out?"
        message="Are you sure you want to log out of your session?"
        confirmText="Logout"
        type="danger"
      />
    </nav>
  );
}
