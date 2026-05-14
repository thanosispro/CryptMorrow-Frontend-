import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Zap, Clock, ArrowUpRight, BarChart3, Filter, Search, ChevronRight, Activity } from 'lucide-react';
import { fetchTrainedModels } from '../utils/api';

export default function MarketModels({ onSelect }) {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCoin, setFilterCoin] = useState('');
  const [filterTimeframe, setFilterTimeframe] = useState('');

  useEffect(() => {
    loadModels();
  }, [filterCoin, filterTimeframe]);

  const loadModels = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterCoin) params.crypto_name = filterCoin;
      if (filterTimeframe) params.timeframe = filterTimeframe;
      const res = await fetchTrainedModels(params);
      setModels(res.data || []);
    } catch (err) {
      console.error("Failed to load models:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-[9px] font-black uppercase tracking-widest mb-3">
              <Zap className="w-3 h-3 fill-primary/20" />
              <span>Live trained models</span>
           </div>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-text-primary tracking-tight">Market Intelligence</h2>
          <p className="text-text-secondary text-sm font-medium mt-1">Select a pre-trained AI model to view its specific predictions.</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div className="flex bg-white/50 border border-border-subtle p-1 rounded-xl shadow-inner backdrop-blur-md">
             {['', 'BTC', 'ETH', 'SOL'].map(c => (
               <button 
                 key={c}
                 onClick={() => setFilterCoin(c)}
                 className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filterCoin === c ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' : 'text-text-tertiary hover:text-text-primary hover:bg-white/80'}`}
               >
                 {c || 'All Assets'}
               </button>
             ))}
          </div>
          <div className="flex bg-white/50 border border-border-subtle p-1 rounded-xl shadow-inner backdrop-blur-md">
             {['', '1h', '4h', '1d'].map(t => (
               <button 
                 key={t}
                 onClick={() => setFilterTimeframe(t)}
                 className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filterTimeframe === t ? 'bg-secondary text-white shadow-lg shadow-secondary/20 scale-105' : 'text-text-tertiary hover:text-text-primary hover:bg-white/80'}`}
               >
                 {t || 'All TF'}
               </button>
             ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
             <div key={i} className="h-56 rounded-[32px] bg-slate-50 border border-blue-50 animate-pulse relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
             </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {models.map((model, i) => (
              <motion.div
                key={model.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                transition={{ duration: 0.5, delay: i * 0.05, ease: [0.23, 1, 0.32, 1] }}
                onClick={() => onSelect(model)}
                className="group relative cursor-pointer"
              >
                <div className="block-card p-7 sm:p-8 h-full flex flex-col relative overflow-hidden">
                  {/* Decorative element */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-[60px] -z-10 translate-x-1/2 -translate-y-1/2 group-hover:bg-primary/20 group-hover:scale-150 transition-all duration-700" />
                  
                  <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center gap-5">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black italic shadow-inner border border-white/50 ${model.crypto_name === 'BTC' ? 'bg-orange-50 text-orange-500' : model.crypto_name === 'ETH' ? 'bg-indigo-50 text-indigo-500' : 'bg-cyan-50 text-cyan-500'}`}>
                        {model.crypto_name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-text-primary tracking-tight group-hover:text-primary transition-colors">{model.crypto_name}/USD</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="w-3.5 h-3.5 text-text-tertiary" />
                          <span className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em]">{model.timeframe} Period</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-white border border-border-subtle flex items-center justify-center group-hover:bg-primary group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary/30 transition-all duration-500">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="mt-auto space-y-5">
                    <div className="grid grid-cols-2 gap-3">
                       <div className="p-4 rounded-2xl bg-slate-50 border border-border-subtle group-hover:bg-white group-hover:border-primary/10 transition-all">
                          <span className="text-[8px] font-black text-text-tertiary uppercase tracking-widest block mb-1">Reliability</span>
                          <span className="text-sm font-black text-text-primary">98.2%</span>
                       </div>
                       <div className="p-4 rounded-2xl bg-slate-50 border border-border-subtle group-hover:bg-white group-hover:border-accent/10 transition-all">
                          <span className="text-[8px] font-black text-text-tertiary uppercase tracking-widest block mb-1">Status</span>
                          <span className="text-sm font-black text-success flex items-center gap-1.5">
                             <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                             Ready
                          </span>
                       </div>
                    </div>

                    <div className="flex items-center gap-3 px-1">
                       <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden border border-white">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: '92%' }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="h-full bg-linear-to-r from-primary to-accent rounded-full shadow-sm"
                          />
                       </div>
                       <span className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">Active</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
      
      {models.length === 0 && !loading && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-24 bg-slate-50/50 rounded-[40px] border-2 border-dashed border-border-subtle"
        >
          <div className="w-20 h-20 bg-white rounded-3xl border border-border-subtle flex items-center justify-center mx-auto mb-6 shadow-sm">
             <BarChart3 className="w-10 h-10 text-text-tertiary opacity-30" />
          </div>
          <p className="text-text-primary font-black text-lg">No Trained Models Found</p>
          <p className="text-text-secondary font-medium mt-2 max-w-xs mx-auto">Try adjusting your filters or wait for the system to finalize current training cycles.</p>
        </motion.div>
      )}
    </div>
  );
}
