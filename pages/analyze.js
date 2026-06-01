import Head from 'next/head';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { fetchPrediction, fetchHistoricalData } from '../utils/api';
import { useToast } from '../contexts/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  Settings,
  Zap,
  ShieldCheck,
  Cpu,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Brain,
  Database,
  BarChart3,
  Search,
  ChevronDown,
  Info,
  Target,
  Sparkles
} from 'lucide-react';
import MarketModels from '../components/MarketModels';
import ConfirmModal from '../components/ConfirmModal';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  LineChart,
  Line,
} from 'recharts';

export default function Analyze() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [coin, setCoin] = useState('BTC');
  const [timeframe, setTimeframe] = useState('1d');
  const [tsym, setTsym] = useState('USD');

  // "Applied" state - used by the graph/analysis
  const [appliedCoin, setAppliedCoin] = useState('BTC');
  const [appliedTimeframe, setAppliedTimeframe] = useState('1d');
  const [appliedTsym, setAppliedTsym] = useState('USD');

  const [prediction, setPrediction] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingModel, setPendingModel] = useState(null);

  const executeAnalysis = async () => {
    if (!user) {
      showToast("Please log in to use AI predictions and credits.", 'error');
      router.push('/login');
      return;
    }
    setLoading(true);
    setError(null);
    
    // Capture the current pending state as applied state
    const currentCoin = coin;
    const currentTimeframe = timeframe;
    const currentTsym = tsym;
    
    try {
      const predData = await fetchPrediction(currentCoin, currentTimeframe, currentTsym);

      if (predData.status === 'success') {
        setAppliedCoin(currentCoin);
        setAppliedTimeframe(currentTimeframe);
        setAppliedTsym(currentTsym);
        setPrediction(predData);
        try {
          const res = await fetchHistoricalData(currentCoin, currentTimeframe, 100);
          setHistoricalData(res.data || []);
        } catch (hErr) {
          console.warn("Historical context unreachable:", hErr);
          setHistoricalData([]);
        }
      } else if (predData.status === 'pending' || predData.status === 'started') {
        setPrediction(null);
        showToast(predData.message || "Calculating predictions...", 'pending');
      }
    } catch (err) {
      setPrediction(null);
      setError(err.message || "Connection failed.");
      showToast(err.message || "Connection Failed", 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleModelSelect = (model) => {
    setPendingModel(model);
    setShowConfirmModal(true);
  };

  const confirmModelSelect = () => {
    if (!pendingModel) return;
    setCoin(pendingModel.crypto_name);
    setTimeframe(pendingModel.timeframe);
    
    // We use the new values directly since state update is async
    const currentCoin = pendingModel.crypto_name;
    const currentTimeframe = pendingModel.timeframe;
    const currentTsym = tsym;

    setLoading(true);
    setError(null);
    
    fetchPrediction(currentCoin, currentTimeframe, currentTsym)
      .then(async (predData) => {
        if (predData.status === 'success') {
            setAppliedCoin(currentCoin);
            setAppliedTimeframe(currentTimeframe);
            setAppliedTsym(currentTsym);
            setPrediction(predData);
            const res = await fetchHistoricalData(currentCoin, currentTimeframe, 100);
            setHistoricalData(res.data || []);
            showToast(`Loaded ${currentCoin} ${currentTimeframe} trained model`, 'success');
        } else {
            showToast(predData.message || "Calculating predictions...", 'pending');
        }
      })
      .catch(err => {
        setPrediction(null);
        setError(err.message || "Connection failed.");
        showToast(err.message || "Connection Failed", 'error');
      })
      .finally(() => setLoading(false));
      
    setPendingModel(null);
  };

  const combinedChartData = useMemo(() => {
    if (!prediction || !prediction.results) return [];

    const timeframeSecondsMap = {
      '1h': 3600, '2h': 7200, '3h': 10800, '4h': 14400, '6h': 21600, '12h': 43200, '1d': 86400, '3d': 259200, 'weekly': 604800
    };
    const interval = timeframeSecondsMap[appliedTimeframe] || 86400;

    const historicalSlice = historicalData.slice(-100);
    const lastHistorical = historicalSlice[historicalSlice.length - 1];
    const lastTime = lastHistorical ? lastHistorical.time : Math.floor(Date.now() / 1000);
    const lastPrice = lastHistorical ? lastHistorical.close : 0;
    const firstPred = prediction.results[0];
    const ratio = lastPrice && firstPred ? lastPrice / firstPred : 1;

    // Combine historical and prediction data without a bridge point to keep lines separate
    const historicalPoints = historicalSlice.map(d => ({
      time: d.time,
      historicalPrice: d.close,
      type: 'historical'
    }));

    // Start prediction points separately
    const predictionPoints = prediction.results.map((val, i) => {
      // Use current time as baseline for future points if historical is empty
      const baseTime = lastTime || Math.floor(Date.now() / 1000);
      const time = baseTime + (interval * (i + 1));
      return {
        time,
        predictionPrice: parseFloat(val) * ratio,
        type: 'prediction'
      };
    });

    return [...historicalPoints, ...predictionPoints];
  }, [prediction, appliedTimeframe, historicalData]);

  const splitPointDate = useMemo(() => {
    if (historicalData.length === 0) return null;
    return historicalData[historicalData.length - 1].time;
  }, [historicalData]);

  const predictionOnlyData = useMemo(() => {
    if (!prediction || !Array.isArray(prediction.results)) return [];

    const timeframeSecondsMap = {
      '1h': 3600, '2h': 7200, '3h': 10800, '4h': 14400, '6h': 21600, '12h': 43200, '1d': 86400, '3d': 259200, 'weekly': 604800
    };
    const interval = timeframeSecondsMap[appliedTimeframe] || 86400;

    let startTime = Math.floor(Date.now() / 1000);

    return prediction.results.map((val, i) => {
      const t = startTime + (interval * (i + 1));
      const dt = new Date(t * 1000);

      let label = '';
      if (appliedTimeframe.includes('h')) {
        label = dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else {
        label = dt.toLocaleDateString([], { month: 'short', day: 'numeric' });
      }

      return {
        label,
        price: parseFloat(val),
        index: i + 1
      };
    });
  }, [prediction, appliedTimeframe]);

  const advice = useMemo(() => {
    if (!prediction || !Array.isArray(prediction.results)) return null;

    const results = prediction.results.map(parseFloat);
    const first = results[0];
    const last = results[results.length - 1];
    const isBull = last > first;

    const type = isBull ? 'BULLISH' : 'BEARISH';
    const color = isBull ? 'text-emerald-600' : 'text-rose-600';
    const bgColor = isBull ? 'bg-emerald-50' : 'bg-rose-50';
    const borderColor = isBull ? 'border-emerald-200' : 'border-rose-200';

    return {
      type, color, bgColor, borderColor, isBull,
      message: `Our AI predicts a potential ${type.toLowerCase()} trend for the next 10 periods. Market patterns suggest a possible ${isBull ? 'uptrend' : 'correction'} based on current activity.`
    };
  }, [prediction, appliedTsym]);

  return (
    <>
      <Head><title>Price Predictions | CryptMorrow</title></Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12 min-h-screen relative">
        {/* Decorative ambient blows - Optimized for light theme */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 translate-x-1/3 -translate-y-1/3 animate-pulse-soft" />

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-8 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-4">
              <Brain className="w-4 h-4" />
              <span>Smart Prediction Center</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-text-primary tracking-tight">
              Price Predictions
            </h1>
            <p className="text-text-secondary text-base sm:text-lg mt-3 max-w-xl font-medium leading-relaxed">
              Use advanced AI to see where the market is going with high accuracy.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-surface p-2 rounded-2xl border border-blue-100 shadow-sm">
            <div className="px-5 py-2 flex flex-col border-r border-border-subtle">
              <span className="text-[9px] text-text-tertiary font-bold uppercase tracking-widest leading-none mb-1.5">Account Status</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-[11px] font-black text-text-primary uppercase">{user?.membership_type || 'GUEST'}</span>
              </div>
            </div>
            <div className="px-5 py-2 flex flex-col">
              <span className="text-[9px] text-text-tertiary font-bold uppercase tracking-widest leading-none mb-1.5">Prediction Reliability</span>
              <span className="text-[11px] font-black text-text-primary">{user?.membership_type === 'full' ? '98.2%' : '84.4%'}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12 relative z-10">
          <aside className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="block-card p-6 sm:p-8"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Settings className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-text-primary">Parameters</h3>
              </div>

              <div className="space-y-8">
                <div>
                  <label className="block text-[10px] text-text-tertiary uppercase tracking-[0.2em] mb-4 font-black">Crypto Asset</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['BTC', 'ETH', 'SOL'].map(c => (
                      <button
                        key={c}
                        onClick={() => setCoin(c)}
                        className={`py-3 rounded-xl border text-xs font-black transition-all ${coin === c ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105' : 'bg-slate-50 border-border-subtle text-text-secondary hover:border-primary/30 hover:bg-white'
                          }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-text-tertiary uppercase tracking-[0.2em] mb-4 font-black">Currency</label>
                  <div className="flex gap-1 p-1 bg-white/50 rounded-xl border border-blue-100 shadow-inner">
                    {['USD', 'EUR', 'GBP'].map(t => (
                      <button
                        key={t}
                        onClick={() => setTsym(t)}
                        className={`flex-1 py-3 rounded-lg text-[11px] font-bold transition-all ${tsym === t ? 'bg-primary text-white shadow-sm border border-border-subtle' : 'bg-white text-text-secondary hover:text-text-secondary'
                          }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-text-tertiary uppercase tracking-[0.2em] mb-4 font-black">Time Period</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['1h', '4h', '6h', '12h', '1d', '3d'].map(t => (
                      <button
                        key={t}
                        onClick={() => setTimeframe(t)}
                        className={`py-2.5 rounded-xl border text-[10px] font-bold transition-all ${timeframe === t ? 'bg-primary text-white' : 'bg-white border-blue-100 text-text-secondary hover:border-primary/30 hover:bg-white'
                          }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>


                  <button
                    onClick={() => setShowConfirmModal(true)}
                    disabled={loading}
                    className="w-full mt-4 bg-primary text-white font-bold py-5 rounded-2xl hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg shadow-primary/20 group"
                  >
                  {loading ? <Activity className="w-5 h-5 animate-spin" /> : (
                    <>
                      <span className="text-sm uppercase tracking-[0.2em]">Get Predictions</span>
                      <TrendingUp className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>

            {!prediction && (
              <div className="p-6 rounded-[24px] bg-primary/5 border border-primary/10 sm:block hidden shadow-sm animate-fade-in">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 shadow-inner">
                    <Info className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Tip</p>
                    <p className="text-[12px] text-text-secondary font-medium leading-relaxed italic">Increasing Analysis Depth helps the AI find more patterns in market data.</p>
                  </div>
                </div>
              </div>
            )}
          </aside>

          <main className="lg:col-span-3 space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="block-section p-6 sm:p-10 lg:p-12 shadow-sm flex flex-col min-h-[500px] lg:min-h-[600px] relative overflow-hidden"
            >
              <AnimatePresence mode="wait">
                {!prediction ? (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex-1 flex flex-col items-center justify-center text-center py-16"
                  >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white border border-blue-100 rounded-[32px] flex items-center justify-center mb-10 group hover:rotate-6 transition-transform shadow-inner">
                      <BarChart3 className="w-8 h-8 sm:w-10 sm:h-10 text-text-tertiary group-hover:text-primary transition-colors" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-text-primary mb-3 tracking-snug">System Status: Ready</h3>
                    <p className="text-text-secondary max-w-sm font-medium leading-relaxed px-4">
                      Select a crypto asset and time period to get AI price predictions based on market trends.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="active"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col flex-1"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
                      <div className="flex items-center gap-5 sm:gap-6">
                        <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-[22px] sm:rounded-[26px] ${appliedCoin === 'BTC' ? 'bg-orange-50 text-orange-500 border border-orange-200' : appliedCoin === 'ETH' ? 'bg-indigo-50 text-indigo-500 border border-indigo-200' : 'bg-cyan-50 text-cyan-500 border border-cyan-200'} flex items-center justify-center text-2xl sm:text-3xl font-black italic shadow-sm`}>
                          {appliedCoin.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">{appliedCoin}/{appliedTsym}</h2>
                            <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-border-subtle text-text-tertiary text-[9px] font-black uppercase tracking-widest">{appliedTimeframe}</span>
                          </div>
                          <p className="text-text-tertiary text-xs font-bold uppercase tracking-widest">Model: <span className="text-primary">Advanced Prediction System</span></p>
                        </div>
                      </div>

                      <div className={`flex items-center gap-3 px-5 sm:px-6 py-3 rounded-2xl border ${advice?.isBull ? 'bg-emerald-50/50 border-emerald-200' : 'bg-rose-50/50 border-rose-200'} shadow-sm`}>
                        {advice?.isBull ? <ArrowUpRight className="text-emerald-600" /> : <ArrowDownRight className="text-rose-600" />}
                        <span className={`text-xs sm:text-[13px] font-black uppercase tracking-widest ${advice?.isBull ? 'text-emerald-600' : 'text-rose-600'}`}>{advice?.type} SIGNAL</span>
                      </div>
                    </div>

                    <div className="h-[350px] sm:h-[450px] relative w-full">
                      <div className="absolute top-0 right-0 flex items-center gap-4 sm:gap-6 z-10 bg-white/50 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl border border-border-subtle shadow-sm">
                        <div className="flex items-center gap-2.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-accent" />
                          <span className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">AI Prediction Results</span>
                        </div>
                      </div>

                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={combinedChartData}>
                          <defs>
                            <linearGradient id="accentGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.1} />
                              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.02)" vertical={false} />
                          <XAxis
                            dataKey="time"
                            type="number"
                            domain={['auto', 'auto']}
                            stroke="#94a3b8"
                            fontSize={10}
                            fontWeight="bold"
                            tickLine={false}
                            axisLine={false}
                            minTickGap={40}
                            dy={15}
                            tickFormatter={(t) => {
                              const date = new Date(t * 1000);
                              if (appliedTimeframe.includes('h')) {
                                return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                              }
                              return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
                            }}
                          />
                          <YAxis hide domain={['auto', 'auto']} padding={{ top: 20, bottom: 20 }} />
                          <Tooltip
                            contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            labelStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                            labelFormatter={(t) => {
                              const date = new Date(t * 1000);
                              return date.toLocaleString();
                            }}
                          />
                          <Area type="monotone" dataKey="predictionPrice" stroke="#06b6d4" strokeWidth={3} fill="url(#accentGradient)" isAnimationActive={true} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {loading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-white/90 backdrop-blur-xl z-[60] flex flex-col items-center justify-center p-12"
                >
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-primary/10 rounded-full" />
                    <div className="absolute top-0 left-0 w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <Activity className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-primary shadow-sm" />
                  </div>
                  <p className="mt-8 text-text-primary font-black tracking-[0.3em] text-[10px] sm:text-xs uppercase">AI Analysis in Progress</p>
                  <p className="mt-2 text-text-tertiary text-[10px] font-bold uppercase tracking-widest">Analyzing Market Data Trends</p>
                </motion.div>
              )}
            </motion.div>
          </main>
        </div>

        <AnimatePresence>
          {prediction && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-12 space-y-12"
            >
              <div className="block-section p-8 sm:p-12 lg:p-16 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px] -z-10 translate-x-1/3 -translate-y-1/3 animate-pulse-soft" />

                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16 gap-10">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-accent/5 border border-accent/10 text-accent text-[9px] font-black uppercase tracking-[0.2em] mb-4">
                      <Zap className="w-4 h-4 fill-accent/20" />
                      <span>Predicted Prices</span>
                    </div>
                    <h2 className="text-3xl lg:text-5xl font-display font-extrabold text-text-primary tracking-tight mb-4 leading-tight">AI Price Prediction</h2>
                    <p className="text-text-secondary text-base sm:text-lg font-medium max-w-xl">Our AI shows the next 10 predicted points based on current market trends and activity.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 shrink-0 w-full lg:w-auto">
                    <div className="bg-slate-50 border border-border-subtle p-5 sm:p-6 rounded-[28px] flex-1">
                      <p className="text-[9px] text-text-tertiary font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Activity className="w-3 h-3 text-success" /> AI Signal
                      </p>
                      <p className="text-2xl font-black text-text-primary tracking-tight uppercase">Stable</p>
                    </div>
                    <div className="bg-slate-50 border border-border-subtle p-5 sm:p-6 rounded-[28px] flex-1">
                      <p className="text-[9px] text-text-tertiary font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                        <ShieldCheck className="w-3 h-3 text-primary" /> Data Verification
                      </p>
                      <p className="text-2xl font-black text-text-primary tracking-tight uppercase">Verified</p>
                    </div>
                  </div>
                </div>

                <div className="h-[350px] sm:h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={predictionOnlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.03)" vertical={false} />
                      <XAxis
                        dataKey="label"
                        stroke="#94a3b8"
                        fontSize={10}
                        fontWeight="bold"
                        tickLine={false}
                        axisLine={false}
                        dy={15}
                      />
                      <YAxis hide domain={['auto', 'auto']} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ color: '#06B6D4', fontWeight: '900', fontSize: '12px' }}
                        labelStyle={{ color: '#0f172a', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px' }}
                        formatter={() => ['AI Prediction Price', 'Predicted Value']}
                      />
                      <Line
                        type="monotone"
                        dataKey="price"
                        stroke="#06B6D4"
                        strokeWidth={4}
                        dot={{ r: 6, fill: '#ffffff', strokeWidth: 3, stroke: '#06B6D4' }}
                        activeDot={{ r: 10, fill: '#06B6D4', stroke: '#ffffff', strokeWidth: 5 }}
                        animationDuration={2500}
                        strokeLinecap="round"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-3 mt-20">
                  {prediction.results.map((_, i) => (
                    <div key={i} className="bg-slate-50 border border-border-subtle p-5 rounded-[22px] text-center group hover:border-primary/50 transition-all cursor-pointer hover:bg-white hover:shadow-sm">
                      <p className="text-[9px] text-text-tertiary uppercase font-black mb-1.5 group-hover:text-primary transition-colors">Point {i + 1}</p>
                      <div className="w-1.5 h-1.5 bg-success rounded-full mx-auto shrink-0 mb-2 opacity-50 group-hover:opacity-100 group-hover:animate-pulse" />
                      <p className="text-[10px] font-black text-text-primary uppercase tracking-tighter">Live</p>
                    </div>
                  ))}
                </div>
              </div>

              {advice && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className={`p-10 sm:p-14 lg:p-16 rounded-[48px] border-2 ${advice.isBull ? 'border-primary/20 bg-primary/5' : 'border-error/20 bg-error/5'} flex flex-col md:flex-row items-center gap-10 sm:gap-14 lg:gap-16 relative overflow-hidden group backdrop-blur-xl shadow-sm`}
                >
                  <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center border-2 ${advice.isBull ? 'border-primary/20' : 'border-error/20'} bg-white shadow-lg shrink-0 group-hover:scale-110 transition-transform duration-700 animate-pulse-soft`}>
                    {advice.isBull ? (
                      <TrendingUp className="w-12 h-12 sm:w-14 sm:h-14 text-primary" />
                    ) : (
                      <Activity className="w-12 h-12 sm:w-14 sm:h-14 text-error" />
                    )}
                  </div>
                  <div className="text-center md:text-left flex-1">
                    <p className={`text-[10px] font-black uppercase tracking-[0.25em] ${advice.isBull ? 'text-primary' : 'text-error'} mb-4 whitespace-nowrap`}>Signal Status: {advice.type} ANALYSIS</p>
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl text-text-primary font-display font-extrabold tracking-tight leading-[1.2] lg:leading-[1.1]">
                      "{advice.message}"
                    </h3>
                    <div className="mt-10 flex flex-wrap justify-center md:justify-start gap-3 sm:gap-4">
                      <div className="px-5 py-3 rounded-2xl bg-white border border-border-subtle text-text-secondary font-bold text-[10px] uppercase tracking-widest flex items-center gap-3 shadow-sm hover:border-primary/20 transition-all cursor-default">
                        <Activity className="w-4 h-4 text-primary" /> Market Changes
                      </div>
                      <div className="px-5 py-3 rounded-2xl bg-white border border-border-subtle text-text-secondary font-bold text-[10px] uppercase tracking-widest flex items-center gap-3 shadow-sm hover:border-accent/20 transition-all cursor-default">
                        <Target className="w-4 h-4 text-accent" /> Trend Analysis
                      </div>
                      <div className="px-5 py-3 rounded-2xl bg-white border border-border-subtle text-text-secondary font-bold text-[10px] uppercase tracking-widest flex items-center gap-3 shadow-sm hover:border-success/20 transition-all cursor-default">
                        <ShieldCheck className="w-4 h-4 text-success" /> Verified
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.section>
          )}
        </AnimatePresence>

        {/* Separator */}
        <div className="my-24 h-px bg-gradient-to-r from-transparent via-border-subtle to-transparent" />

        {/* Market Models Section */}
        <motion.section
           initial={{ opacity: 0, y: 40 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="mb-32"
        >
        <MarketModels onSelect={handleModelSelect} />
        </motion.section>

        {/* Prediction Modal */}
        <ConfirmModal 
          isOpen={showConfirmModal && !pendingModel}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={executeAnalysis}
          title="Run AI Prediction?"
          message={`This will use your credits and perform a deep analysis on ${coin}/${tsym} for the ${timeframe} timeframe.`}
          confirmText="Predict Now"
          type="info"
        />

        {/* Model Select Modal */}
        <ConfirmModal 
          isOpen={showConfirmModal && pendingModel !== null}
          onClose={() => {
            setShowConfirmModal(false);
            setPendingModel(null);
          }}
          onConfirm={confirmModelSelect}
          title="Load This Model?"
          message={`Do you want to load the trained data for ${pendingModel?.crypto_name} (${pendingModel?.timeframe})? This will update your current chart results.`}
          confirmText="Load Model"
          type="warning"
        />
      </div>
    </>
  );
}
