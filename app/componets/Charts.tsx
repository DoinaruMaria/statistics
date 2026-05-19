"use client";
import { WarningCircle } from '@phosphor-icons/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, XAxis, Bar } from 'recharts';

export const Charts = ({ trades } : { trades: any[] }) => {
  // Calculăm datele
  const executedTrades = trades.filter(t => t.executed === true );
  const total = executedTrades.length;
  const wins = trades.filter(t => t.executed && Number(t.rr) > 1).length;
  const losses = total - wins;

  // --- CALCUL NY LUNCH BREAK (Indicator Special) ---
  // Ajustează orele "19:00" și "20:30" în funcție de ora brokerului tău
  const nyLunchTrades = executedTrades.filter(t => t.timeHours >= "19:00" && t.timeHours <= "20:30").length;

  const data = [
    { name: "Wins", value: wins || 0 },
    { name: "Losses", value: losses || 0 },
  ];

  // --- LOGICA PENTRU SESIUNI ---
  const sessionStats = [
    {
      name: 'London/FRK',
      total: trades.filter(t => t.timeHours >= "08:00" && t.timeHours <= "15:00").length,
      wins: trades.filter(t => t.timeHours >= "08:00" && t.timeHours <= "15:00" && Number(t.rr) > 1).length
    },
    {
      name: 'New York',
      total: trades.filter(t => t.timeHours >= "15:00" && t.timeHours <= "18:00").length,
      wins: trades.filter(t => t.timeHours >= "15:00" && t.timeHours <= "18:00" && Number(t.rr) > 1).length
    }
  ];

  // --- LOGICA PENTRU LICHIDITĂȚI ---
  // Extragem toate tipurile unice de lichiditate și numărăm trade-urile pentru fiecare
  const liqCounts = trades.reduce((acc, t) => {
    acc[t.typeOfLiquidity] = (acc[t.typeOfLiquidity] || 0) + 1;
    return acc;
  }, {});

  const liqData = Object.keys(liqCounts).map(key => ({
    name: key,
    value: liqCounts[key]
  }));

  const COLORS_LIQ = ['#fbbf24', '#38bdf8', '#818cf8', '#c084fc', '#f472b6'];
  const COLORS = ['#22c55e', '#ef4444']; 

  return (
    <aside className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
      {/* CARD RATĂ DE SUCCES */}
      <div className="p-8 rounded-[2.5rem] border border-slate-200 shadow-sm bg-white flex flex-col items-center">
        <h3 className="text-[12px] uppercase text-slate-400 font-bold mb-6">Win rate</h3>
        
        <div className="h-48 w-48 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={68}
                outerRadius={88}
                paddingAngle={10}
                dataKey="value"
                stroke="none"
                startAngle={90}
                endAngle={450}
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          
          {/* Textul central suprapus */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[9px] text-slate-400 font-bold uppercase">Total</span>
            <span className="text-3xl font-black text-slate-800 leading-none">
              {total > 0 ? ((wins / total) * 100).toFixed(0) : 0}%
            </span>
            <span className="text-[9px] text-slate-400 font-bold mt-1 uppercase">{total} Trades</span>
          </div>
        </div>
      </div>

      {/* 1. CHART SESIUNI (Bar Chart) */}
      <div className="p-6 rounded-[2rem] border border-slate-200 shadow-sm bg-white">
        <h3 className="text-[12px] uppercase text-slate-400 font-bold mb-4 text-center">Performanță pe Sesiuni</h3>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sessionStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={10} fontWeight="bold" />
              <Tooltip cursor={{fill: '#f8fafc'}} />
              <Bar dataKey="total" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Total Trades" />
              <Bar dataKey="wins" fill="#22c55e" radius={[4, 4, 0, 0]} name="Wins" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* 3. INDICATOR NY LUNCH BREAK (Noul câmp cerut) */}
      <div className={`p-6 rounded-[2rem] border transition-all ${nyLunchTrades > 0 ? 'bg-amber-50 border-amber-100' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${nyLunchTrades > 0 ? 'bg-amber-200 text-amber-700' : 'bg-slate-100 text-slate-400'}`}>
            <WarningCircle size={20} weight="fill" />
          </div>
          <div>
            <h4 className="text-[11px] font-black text-slate-700 uppercase tracking-tight">NY Lunch Break</h4>
            <p className="text-[10px] text-slate-500 font-medium">
              {nyLunchTrades} trade-uri detectate
            </p>
          </div>
        </div>
        {nyLunchTrades > 0 && (
          <p className="mt-3 text-[9px] text-amber-600 font-bold leading-tight italic">
            * Atenție: Lichiditatea scăzută în acest interval poate afecta acuratețea setup-ului.
          </p>
        )}
      </div>
      </div>

      {/* 2. CHART LICHIDITĂȚI (Donut Chart) */}
      <div className="p-6 rounded-[2rem] border border-slate-200 shadow-sm bg-white">
        <h3 className="text-[12px] uppercase text-slate-400 font-bold mb-4 text-center">Distribuție Lichiditate</h3>
        <div className="h-48 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={liqData}
                innerRadius={55}
                outerRadius={75}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {liqData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS_LIQ[index % COLORS_LIQ.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          {liqData.slice(0, 3).map((item, i) => (
            <div key={i} className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS_LIQ[i % COLORS_LIQ.length]}} />
              <span className="text-[9px] text-slate-500 font-bold uppercase">{item.name}</span>
            </div>
          ))}
        </div>
      </div>

    
    </aside>
  );
};