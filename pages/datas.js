import Head from 'next/head';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Cookies from 'js-cookie';
import { useToast } from '../contexts/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Database,
  Download,
  Filter,
  Search,
  ChevronRight,
  ShieldCheck,
  Zap,
  Lock,
  LayoutList,
  BarChart2,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function Datas() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [coin, setCoin] = useState('BTC');
  const [limit, setLimit] = useState(30);
  const [timeframe, setTimeframe] = useState('histoday');

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const maxAllowedLimit = !user ? 100 : (user.membership_type === 'full' ? 5000 : (user.membership_type === 'half' ? 2000 : 800));

  const fetchDatas = async () => {
    if (!user) {
      showToast("Please log in to fetch real-time market data.", 'error');
      // router.push('/login'); // We might not want to redirect here, just show the toast
      return;
    }

    setLoading(true);
    setData(null);

    try {
      const token = Cookies.get('cryptmorrow_access_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/market-data/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ coin, limit, timeframe })
      });
      const json = await res.json();

      if (res.ok && json.status === 'success') {
        setData(json.data.reverse());
        showToast(`Successfully loaded ${json.data.length} data points for ${coin}.`, 'success');
      } else {
        showToast(json.error || "Failed to load market data.", 'error');
      }
    } catch (err) {
      showToast("Connection timed out. Please try again.", 'error');
    } finally {
      setLoading(false);
    }
  };

  const downloadToCSV = () => {
    if (!data || data.length === 0) return;

    const headers = [
      'Timeline', 'High', 'Low', 'Open', 'Close',
      'Vol (Base)', 'Vol (Quote)',
      'RSI', 'MACD', 'MACD_Signal',
      'BB_Upper', 'BB_Middle', 'BB_Lower',
      'Pattern_Doji', 'Pattern_Hammer'
    ];

    const rows = data.map(d => [
      new Date(d.time * 1000).toLocaleString(),
      d.high,
      d.low,
      d.open,
      d.close,
      d.volumefrom,
      d.volumeto,
      d.rsi ? d.rsi.toFixed(4) : 'N/A',
      d.macd ? d.macd.toFixed(6) : 'N/A',
      d.macd_signal ? d.macd_signal.toFixed(6) : 'N/A',
      d.bb_upper ? d.bb_upper.toFixed(4) : 'N/A',
      d.bb_middle ? d.bb_middle.toFixed(4) : 'N/A',
      d.bb_lower ? d.bb_lower.toFixed(4) : 'N/A',
      d.pattern_doji ? 'TRUE' : 'FALSE',
      d.pattern_hammer ? 'TRUE' : 'FALSE'
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `CryptMorrow_Market_Data_${coin}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Head>
        <title>Historical Market Data | CryptMorrow</title>
      </Head>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16 min-h-screen relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[120px] -z-10 translate-x-1/3 -translate-y-1/3 animate-pulse-soft" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 -translate-x-1/3 translate-y-1/3 animate-pulse-soft" />

        {/* Header Section */}
        <div className="mb-16 relative z-10 text-center lg:text-left">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-xl bg-secondary/5 border border-secondary/10 text-secondary text-[10px] font-black uppercase tracking-[0.3em] mb-6 shadow-sm">
            <Database className="w-4 h-4 fill-secondary/10" />
            <span>Market Data Source</span>
          </div>
          <h1 className="text-4xl sm:text-6xl lg:text-8xl font-display font-extrabold text-text-primary tracking-tighter leading-none mb-8">
            Historical <span className="text-secondary italic">Data</span>
          </h1>
          <p className="text-text-secondary text-base sm:text-xl max-w-2xl font-medium leading-relaxed">
            Browse, analyze, and export historical price data with built-in technical indicators and AI-powered signals.
          </p>
        </div>

        {/* Auth Status Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 relative z-10"
        >
          {!user ? (
            <div className="bg-error/5 border border-error/10 p-6 rounded-[32px] flex items-center gap-5 text-error backdrop-blur-md shadow-sm animate-pulse-soft">
              <Lock className="w-6 h-6 shrink-0" />
              <p className="text-[11px] font-black uppercase tracking-[0.3em] leading-relaxed">Access Restricted: Please log in to download market data</p>
            </div>
          ) : (
            <div className="block-section p-8 rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm relative overflow-hidden group">
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <div className="flex items-center gap-5 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform duration-500">
                  <ShieldCheck className="w-7 h-7 fill-primary/10" />
                </div>
                <div>
                  <p className="text-[10px] text-text-tertiary font-black uppercase tracking-[0.3em] mb-1.5">Secure Access</p>
                  <p className="text-base font-bold text-text-primary">Authorized as <span className="text-primary italic font-black uppercase tracking-tight">@{user.username}</span></p>
                </div>
              </div>
              <div className="flex items-center gap-10 relative z-10 w-full md:w-auto mt-4 md:mt-0">
                <div className="flex flex-col items-end flex-1 md:flex-none">
                  <span className="text-[10px] text-text-tertiary font-black uppercase tracking-widest mb-1">Subscription Plan</span>
                  <span className="text-sm font-black text-text-primary tracking-tighter uppercase">{user.membership_type || 'BASIC'} Level</span>
                </div>
                <div className="h-12 w-px bg-border-subtle hidden md:block" />
                <div className="flex flex-col items-end flex-1 md:flex-none">
                  <span className="text-[10px] text-text-tertiary font-black uppercase tracking-widest mb-1">Data Limit</span>
                  <span className="text-sm font-black text-primary tracking-tighter uppercase">{maxAllowedLimit} Days</span>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 mb-16 relative z-10">
          {/* Controls Panel */}
          <div className="col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="block-section p-10 rounded-[48px] shadow-sm relative overflow-hidden h-full flex flex-col"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

              <div className="flex items-center gap-4 mb-12 pb-6 border-b border-border-subtle">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-border-subtle flex items-center justify-center text-secondary shadow-sm">
                  <Filter className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-display font-extrabold text-text-primary uppercase tracking-tight">Data Filters</h2>
                  <p className="text-[10px] text-text-tertiary font-black uppercase tracking-widest mt-1">Select Market</p>
                </div>
              </div>

              <div className="space-y-10 flex-1">
                <div>
                  <label className="block text-[10px] text-text-tertiary uppercase tracking-[0.3em] mb-4 font-black px-1">Select Coin</label>
                  <div className="relative group">
                    <select
                      value={coin} onChange={e => setCoin(e.target.value)}
                      className="w-full bg-white border border-blue-100 rounded-2xl px-6 py-5 text-text-primary text-base font-black focus:outline-none focus:border-secondary focus:ring-8 focus:ring-secondary/5 transition-all appearance-none cursor-pointer uppercase tracking-tight shadow-sm"
                    >
                      <option value="BTC">Bitcoin</option>
                      <option value="ETH">Ethereum</option>
                      <option value="SOL">Solana</option>
                      <option value="BNB">Binance</option>
                      <option value="XRP">Ripple</option>
                    </select>
                    <Layers className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary pointer-events-none group-focus-within:text-secondary transition-colors duration-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-text-tertiary uppercase tracking-[0.3em] mb-4 font-black px-1">Data Range (1 - {maxAllowedLimit})</label>
                  <div className="relative group">
                    <input
                      type="number" value={limit} onChange={e => setLimit(Number(e.target.value))}
                      min="1" max={maxAllowedLimit}
                      className="w-full bg-white border border-blue-100 rounded-2xl px-6 py-5 text-text-primary text-base font-black focus:outline-none focus:border-secondary focus:ring-8 focus:ring-secondary/5 transition-all uppercase tracking-tight shadow-sm"
                    />
                    <LayoutList className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary pointer-events-none group-focus-within:text-secondary transition-colors duration-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-text-tertiary uppercase tracking-[0.3em] mb-4 font-black px-1">Timeframe</label>
                  <div className="relative group">
                    <select
                      value={timeframe} onChange={e => setTimeframe(e.target.value)}
                      className="w-full bg-white border border-blue-100 rounded-2xl px-6 py-5 text-text-primary text-base font-black focus:outline-none focus:border-secondary focus:ring-8 focus:ring-secondary/5 transition-all appearance-none cursor-pointer uppercase tracking-tight shadow-sm"
                    >
                      <option value="histohour">Hourly (1H)</option>
                      <option value="2h">2 Hours (2H)</option>
                      <option value="3h">3 Hours (3H)</option>
                      <option value="4h">4 Hours (4H)</option>
                      <option value="histoday">Daily (1D)</option>
                      <option value="weekly">Weekly (1W)</option>
                    </select>
                    <Calendar className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary pointer-events-none group-focus-within:text-secondary transition-colors duration-500" />
                  </div>
                </div>

                <div className="pt-8">
                  <button
                    onClick={fetchDatas} disabled={loading}
                    className="w-full bg-text-primary text-white font-black py-6 rounded-3xl hover:bg-slate-800 active:scale-95 transition-all disabled:opacity-50 flex justify-center items-center gap-4 shadow-xl group uppercase tracking-[0.3em] text-[11px]"
                  >
                    {loading ? <Zap className="w-5 h-5 animate-spin" /> : (
                      <>
                        <span>Load Data</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Results Panel */}
          <div className="col-span-1 xl:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="block-section border-none rounded-[48px] overflow-hidden flex flex-col shadow-sm h-[700px] xl:h-[800px] relative"
            >
              <div className="p-8 sm:p-10 border-b border-border-subtle flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 bg-white relative z-20 shadow-sm">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-[24px] bg-secondary/5 border border-secondary/10 flex items-center justify-center text-secondary shadow-sm group-hover:scale-110 transition-all">
                    <BarChart2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-extrabold text-text-primary tracking-tight">DATA PREVIEW</h3>
                    <div className="text-[10px] text-secondary font-black uppercase tracking-[0.25em] mt-1.5 flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse shadow-[0_0_10px_rgba(37,99,235,0.4)]" /> Market Data
                    </div>
                  </div>
                </div>
                <button
                  onClick={downloadToCSV} disabled={!data}
                  className="w-full sm:w-auto px-8 py-4 bg-slate-50 hover:bg-white text-text-primary text-[10px] font-black uppercase tracking-[0.25em] rounded-2xl flex items-center justify-center gap-4 transition-all border border-border-subtle shadow-sm disabled:opacity-50 group hover:shadow-md active:scale-95"
                >
                  <Download className="w-5 h-5 text-secondary group-hover:translate-y-1 transition-transform duration-500" />
                  <span>Export CSV</span>
                </button>
              </div>

              <div className="flex-grow p-0 overflow-auto relative z-10 custom-scrollbar scroll-smooth bg-slate-50/30">
                {data && data.length > 30 && (
                  <div className="px-10 py-4 bg-primary/5 border-b border-primary/10 flex items-center gap-3">
                    <Zap className="w-4 h-4 text-primary" />
                    <p className="text-[11px] font-bold text-primary uppercase tracking-wider">
                      Currently viewing top 30 records for performance. Download the entire CSV for full analysis of all {data.length} data points.
                    </p>
                  </div>
                )}
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead className="text-[9px] text-text-tertiary font-black uppercase bg-white/80 backdrop-blur-xl border-b border-border-subtle sticky top-0 z-20">
                    <tr>
                      <th className="px-8 py-4 tracking-[0.2em]">Date & Time</th>
                      <th className="px-6 py-4 tracking-[0.2em]">Price Info</th>
                      <th className="px-6 py-4 tracking-[0.2em] text-secondary">Indicators</th>
                      <th className="px-6 py-4 tracking-[0.2em] text-primary">Patterns</th>
                      <th className="px-8 py-4 tracking-[0.2em] text-right">Volume</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle font-medium text-xs">
                    {data ? data.slice(0, 30).map((d, i) => (
                      <tr
                        key={i}
                        className="hover:bg-white transition-colors group cursor-default"
                      >
                        <td className="px-8 py-5 text-text-tertiary text-[10px] font-mono whitespace-nowrap uppercase tracking-tighter">
                          {new Date(d.time * 1000).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).replace(',', '')}
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="text-base font-black text-text-primary tracking-tighter">${d.close?.toLocaleString()}</div>
                            <div className={`px-2 py-0.5 rounded-lg text-[9px] font-black border flex items-center gap-1 ${d.close >= d.open ? 'bg-success/5 text-success border-success/10' : 'bg-error/5 text-error border-error/10'}`}>
                              {d.close >= d.open ? '▲' : '▼'} {Math.abs(((d.close - d.open) / d.open) * 100).toFixed(2)}%
                            </div>
                          </div>
                          <div className="flex gap-3 mt-1 font-mono text-[9px] text-text-tertiary uppercase font-bold tracking-tighter">
                            <span>O: {d.open?.toFixed(1)}</span>
                            <span>H: {d.high?.toFixed(1)}</span>
                            <span>L: {d.low?.toFixed(1)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-1 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  style={{ width: `${d.rsi}%` }}
                                  className={`h-full rounded-full ${d.rsi > 70 ? 'bg-error' : d.rsi < 30 ? 'bg-success' : 'bg-primary'}`}
                                />
                              </div>
                              <span className={`text-[10px] font-black font-mono ${d.rsi > 70 ? 'text-error' : d.rsi < 30 ? 'text-success' : 'text-text-primary'}`}>{d.rsi?.toFixed(1)}</span>
                            </div>
                            <div className="text-[9px] font-black">
                              <span className="text-text-tertiary uppercase tracking-widest mr-1">MACD:</span>
                              <span className={d.macd > d.macd_signal ? 'text-success' : 'text-error'}>{d.macd?.toFixed(4)}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-wrap gap-2">
                            {d.pattern_doji && (
                              <span className="bg-primary/5 text-primary px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-wider border border-primary/20">Doji</span>
                            )}
                            {d.pattern_hammer && (
                              <span className="bg-secondary/5 text-secondary px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-wider border border-secondary/20">Hammer</span>
                            )}
                            {!d.pattern_doji && !d.pattern_hammer && (
                              <span className="text-text-tertiary text-[9px] font-bold uppercase tracking-widest opacity-30">—</span>
                            )}
                          </div>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="text-text-primary text-xs font-black tracking-tighter">${(d.volumeto / 1000000).toFixed(2)}M</div>
                          <div className="text-[8px] text-text-tertiary font-black uppercase tracking-widest opacity-50">Volume</div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="5" className="py-48">
                          <div className="flex flex-col items-center justify-center text-center px-10">
                            <h4 className="text-xl font-display font-extrabold text-text-primary tracking-tight uppercase">No Data Loaded</h4>
                            <p className="text-text-secondary text-sm mt-3 max-w-sm font-medium">Select parameters above to view history.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {loading && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-xl z-[100] flex flex-col items-center justify-center p-16">
                  <div className="relative">
                    <div className="w-20 h-20 border-8 border-slate-100 rounded-full" />
                    <div className="absolute top-0 left-0 w-20 h-20 border-8 border-primary border-t-transparent rounded-full animate-spin shadow-2xl shadow-primary/20" />
                    <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-primary animate-pulse" />
                  </div>
                  <p className="mt-12 text-text-primary font-black tracking-[0.5em] text-[11px] uppercase animate-pulse">Loading Market Data</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}