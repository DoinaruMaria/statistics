"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  ArrowLeft, 
  Clock, 
  Image as ImageIcon, 
  Notebook, 
  Target, 
  ShieldCheck,
  TrendUp, 
  Calendar
} from "@phosphor-icons/react";

export default function TradeDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [trade, setTrade] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchTradeDetails = async () => {
      if (!params?.id) return;
      try {
        setLoading(true);
        const response = await fetch(`/api/trades/${params.id}`);
        if (!response.ok) throw new Error(`Server returned ${response.status}`);
        const data = await response.json();
        setTrade(data);
      } catch (error) {
        console.error("Error loading trade details:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchTradeDetails();
  }, [params?.id]);

  if (loading) return <div className="p-20 text-center font-bold animate-pulse text-slate-400 uppercase tracking-tighter">Se încarcă datele...</div>;
  if (error || !trade) return <div className="p-20 text-center text-red-500 font-bold uppercase tracking-tighter">Tranzacția nu a putut fi găsită.</div>;

  // Formatare dată în format românesc (ex: 22.04.2026)
  const formattedDate = trade.date 
    ? new Date(trade.date).toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : "N/A";

  return (
    <main className="p-4 md:p-10 max-w-7xl mx-auto font-sans text-slate-800">
      {/* Navigation Header */}
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-all font-bold text-xs uppercase mb-6"
      >
        <ArrowLeft size={16} weight="bold" /> ÎNAPOI
      </button>
        
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content: Images & Journal */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Visual Evidence Section */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/40 backdrop-blur-md p-8 rounded-[2.5rem] border border-slate-200 shadow-lg">
              <h3 className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase mb-4 px-2">
                <ImageIcon size={16} /> Setup
              </h3>
              <div className="aspect-video rounded-2xl overflow-hidden border border-slate-100 bg-slate-100 flex items-center justify-center">
                {trade.setupImage ? (
                  <img src={trade.setupImage} alt="Setup Chart" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-slate-300 font-bold text-xs uppercase">Fără Imagine </span>
                )}
              </div>
            </div>

            <div className="bg-white/40 backdrop-blur-md p-8 rounded-[2.5rem] border border-slate-200 shadow-lg">
              <h3 className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase mb-4 px-2">
                <ImageIcon size={16} /> Lichiditate
              </h3>
              <div className="aspect-video rounded-2xl overflow-hidden border border-slate-100 bg-slate-100 flex items-center justify-center">
                {trade.liquidityImage ? (
                  <img src={trade.liquidityImage} alt="Liquidity Chart" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-slate-300 font-bold text-xs uppercase">Fără Imagine </span>
                )}
              </div>
            </div>
          </section>

          {/* Journal Section */}
          <section className="bg-white/40 backdrop-blur-md p-8 rounded-[2.5rem] border border-slate-200 shadow-lg">
            <h3 className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase mb-4 text-blue-500">
              <Notebook size={16} weight="bold" /> Observații
            </h3>
            <p className="text-slate-600 italic leading-relaxed text-sm whitespace-pre-wrap">
              {trade.notes || "Nu au fost adăugate note pentru această execuție."}
            </p>
          </section>

          {/* Additional Technical Info */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "MSS", value: trade.mss, icon: <Target /> },
              { label: "News Day", value: trade.newsDay ? "DA" : "NU", icon: <Calendar/> },
              { label: "Break Even", value: trade.be ? "DA" : "NU", icon: <ShieldCheck /> },
              { label: "Executat", value: trade.executed ? "DA" : "NU", icon: <TrendUp /> },
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-5 rounded-3xl border border-slate-200 text-center">
                <div className="text-slate-300 mb-1 flex justify-center">{item.icon}</div>
                <div className="text-[9px] font-bold text-slate-400 uppercase mb-1">{item.label}</div>
                <div className="text-xs font-bold text-slate-800 uppercase">{item.value || "N/A"}</div>
              </div>
            ))}
          </section>
        </div>

        {/* Sidebar: Technical Data */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
               <Target size={120} weight="fill" />
            </div>
            
            <h2 className="text-4xl font-bold mb-1 tracking-tighter">{trade.symbol}</h2>
            
            {/* Secțiunea de Timp actualizată cu Data calendaristică */}
            <div className="flex flex-col gap-1 text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">
              <div className="flex items-center gap-2 text-yellow-400">
                <Calendar size={14} weight="bold" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2 pl-5 text-[10px] text-slate-400 font-medium">
                <span>{trade.dayOfWeek || "N/A"} • {trade.timeHours || "N/A"}</span>
              </div>
            </div>

            <div className="space-y-4 border-t border-white/10 pt-6 relative z-10">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Order Type</span>
                <span className={`text-xs font-bold uppercase ${trade.orderType === 'long' ? 'text-blue-400' : 'text-red-400'}`}>
                  {trade.orderType || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Setup</span>
                <span className="text-xs font-bold text-yellow-400 uppercase">{trade.setup || "N/A"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Lichiditate</span>
                <span className="text-xs font-bold uppercase">{trade.typeOfLiquidity || "N/A"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Stop Loss</span>
                <span className="text-xs font-bold">{trade.stopLoss ? `${trade.stopLoss} pts` : "N/A"}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Result (RR)</span>
                <span className={`text-2xl font-bold ${Number(trade.rr) > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {trade.rr ?? "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Time & Distance Details */}
          <div className="bg-white/40 backdrop-blur-md p-8 rounded-[2.5rem] border border-slate-200 shadow-lg">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-4 flex items-center gap-2 px-2">
              <Clock size={14} weight="bold" /> Detalii tehnice
            </h4>
            <div className="space-y-3">
              {/* Afișare condiționată HOD Time */}
              {trade.hodTime && trade.hodTime !== "N/A" && (
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">HOD Time</span>
                  <span className="text-xs font-bold text-slate-800">{trade.hodTime}</span>
                </div>
              )}

              {/* Afișare condiționată LOD Time */}
              {trade.lodTime && trade.lodTime !== "N/A" && (
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">LOD Time</span>
                  <span className="text-xs font-bold text-slate-800">{trade.lodTime}</span>
                </div>
              )}

              {/* Restul câmpurilor aliniate vizual */}
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Time to Setup</span>
                <span className="text-xs font-bold text-slate-800">{trade.timeToSetup ? `${trade.timeToSetup} min` : "N/A"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Oldness (1m)</span>
                <span className="text-xs font-bold text-slate-800">{trade.liquidityOldness ? `${trade.liquidityOldness} candles` : "N/A"}</span>
              </div>
              {trade.athDistance && trade.athDistance !== "N/A" && (
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">ATH Distance</span>
                  <span className="text-xs font-bold text-slate-800">{trade.athDistance}</span>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}