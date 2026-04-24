"use client";
import { useEffect, useState } from "react";
import { ITrade } from "@/app/types";
import { 
  TrendUp, 
  TrendDown, 
  ChartLine, Notepad
} from "@phosphor-icons/react";

export default function Dashboard() {
  const [trades, setTrades] = useState<ITrade[]>([]);
  const [incarcare, setIncarcare] = useState(true);

  useEffect(() => {
    const preiaTradeuri = async () => {
      try {
        const res = await fetch("/api/trades");
        const data = await res.json();
        setTrades(data);
      } catch (err) {
        console.error("Eroare la preluarea datelor:", err);
      } finally {
        setIncarcare(false);
      }
    };
    preiaTradeuri();
  }, []);

  const getStatusStyles = (rr: number) => {
    if (rr > 1) return { bg: "#f0fdf4", text: "#166534", border: "#bbf7d0", label: "PROFIT" };
    if (rr === 1) return { bg: "#fff7ed", text: "#9a3412", border: "#ffedd5", label: "BREAK EVEN" };
    return { bg: "#fef2f2", text: "#991b1b", border: "#fecaca", label: "LOSS" };
  };

  return (
    <main className="p-4 md:p-10 max-w-7xl mx-auto font-sans">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Panou Statistici</h1>
          <p className="text-sm text-slate-500">Performanța jurnalului tău de trading</p>
        </div>
        <a href="/add-trade" className="bg-yellow-400 text-slate-900 px-6 py-3 rounded-2xl text-sm font-bold hover:bg-yellow-500 transition-all shadow-lg shadow-yellow-400/20">
          + Adaugă Trade
        </a>
      </header>
      

      <div className="w-full">

        {/* Lista de rânduri */}
        <div className="space-y-4"> 
          {incarcare ? (
            <div className="bg-white/40 p-10 text-center rounded-[2rem] border border-white">Se încarcă datele...</div>
          ) : trades.length === 0 ? (
            <div className="bg-white/40 p-10 text-center rounded-[2rem] border border-white">Nu există tranzacții.</div>
          ) : (
            trades.map((trade: any) => {
              const config = getStatusStyles(Number(trade.rr));
              
              return (
                <div 
                  key={trade._id} 
                  className="grid grid-cols-6 gap-4 items-center bg-white/50 backdrop-blur-md p-4 px-8 rounded-2xl border border-white shadow-sm hover:shadow-md hover:bg-white/70 transition-all group"
                >
                  
                  {/* DATA */}
                  <div>
                    <div className="text-sm font-bold text-slate-700">
                      {new Date(trade.date).toLocaleDateString('ro-RO')}
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-tight">
                      {trade.dayOfWeek}
                    </div>
                  </div>

                  {/* ACTIV */}
                  <div className="font-bold text-slate-700 text-[14px]">
                    {trade.symbol}
                  </div>

                  {/* TIP POZIȚIE */}
                  <div>
                      {trade.orderType === 'long' ? (
                      <TrendUp size={30} color="#1e5de5" weight="bold" className="p-1 bg-blue-100 border border-blue-200 rounded-full"/>
                    ) : (
                      <TrendDown size={30} color="#1e5de5" weight="bold" className="p-1 bg-blue-100 border border-blue-200 rounded-full"/> 
                    )}
                  </div>

                  {/* LICHIDITATE */}
                  <div className="text-[14px] text-slate-600 font-medium">
                    {trade.typeOfLiquidity}
                  </div>

                  {/* STATUS */}
                  <div className="text-center">
                    <span 
                      className="text-[10px] font-black px-4 py-2 rounded-full border transition-all inline-block min-w-[100px]"
                      style={{ 
                        backgroundColor: config.bg, 
                        color: config.text, 
                        borderColor: config.border 
                      }}
                    >
                      {config.label}
                    </span>
                  </div>

                   {/* STARE EXECUTIE */}
                   <div className="flex justify-center">
                    {trade.executed ? (
                        <ChartLine size={28} weight="bold" className="p-1 bg-slate-50 text-slate-500 border border-slate-200 rounded-full"/>
                    ) : (
                        <Notepad size={28} weight="bold" className="p-1 bg-slate-50 text-slate-500 border border-slate-200 rounded-full"/>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}