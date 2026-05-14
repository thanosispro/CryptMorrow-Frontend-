import {
  TrendingUp,
  X,           // ← Twitter replacement
  Code2,       // or GitBranch as Github alternative
  UserRound,   // or Building2 for LinkedIn
  Mail,
  Globe,
  Shield,
  Zap,
  Users
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const today = new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const footerLinks = [
    {
      title: 'Platform',
      links: [
        { name: 'Analytics', href: '/analyze' },
        { name: 'Market Data', href: '/datas' },
        { name: 'Pricing', href: '/pricing' },
        { name: 'API Docs', href: '#' },
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Contact', href: '/contact' },
        { name: 'Careers', href: '#' },
        { name: 'Blog', href: '#' },
      ]
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '#' },
        { name: 'Terms of Service', href: '#' },
        { name: 'Cookie Policy', href: '#' },
        { name: 'Security', href: '#' },
      ]
    }
  ];

  return (
    <footer className="bg-[#cdeeee] border-t border-border-subtle mt-32 pt-24 pb-12 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -z-10 translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-12 mb-20">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-8 group">
              <div className="w-10 h-10 relative overflow-hidden rounded-xl shadow-lg shadow-primary/10 group-hover:scale-110 transition-transform">
                <Image 
                  src="/logo.png" 
                  alt="CryptMorrow Logo" 
                  fill 
                  className="object-cover"
                />
              </div>
              <span className="text-2xl font-display font-extrabold text-text-primary tracking-tight">
                Crypt<span className="text-primary italic">Morrow</span>
              </span>
            </Link>
            <p className="text-text-secondary text-lg leading-relaxed mb-8 max-w-sm font-medium">
              Your partner in crypto growth. Advanced crypto analytics powered by intelligent AI models.
            </p>
            <div className="flex items-center gap-4">
              {[X, Code2, UserRound, Mail].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-xl border border-border-subtle flex items-center justify-center text-text-tertiary hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {footerLinks.map((group) => (
            <div key={group.title} className="lg:col-span-1">
              <h3 className="text-[11px] font-bold text-text-primary uppercase tracking-[0.2em] mb-8">{group.title}</h3>
              <ul className="space-y-4">
                {group.links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-text-secondary hover:text-primary transition-colors text-[15px] font-medium inline-block hover:translate-x-1 transition-transform">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Location/Trust Column */}
          <div className="lg:col-span-1">
            <h3 className="text-[11px] font-bold text-text-primary uppercase tracking-[0.2em] mb-8">Our Locations</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <Globe className="w-5 h-5 text-primary shrink-0" />
                <p className="text-sm text-text-secondary leading-relaxed font-medium">
                  Kathmandu HQ, Bagmati,<br />Nepal
                </p>
              </div>
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-border-subtle">
                <Shield className="w-4 h-4 text-success" />
                <span className="text-[11px] font-bold text-text-secondary uppercase tracking-widest">ISO 27001 Certified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-border-subtle flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div className="flex flex-col gap-2">
            <p className="text-text-tertiary text-[13px] font-medium">© {new Date().getFullYear()} CryptMorrow. Professional Market Predictions.</p>
            <p className="text-[10px] text-text-tertiary font-mono uppercase tracking-[0.1em]">Status Update: {today}</p>
          </div>
          <div className="flex items-center gap-8 text-text-tertiary text-[13px] font-bold">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-warning" />
              <span>Speed: Optimal</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <span>Active Users: 1,400+</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
