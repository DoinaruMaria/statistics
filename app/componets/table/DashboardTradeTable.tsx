// DashboardTradeTable.tsx
import { TrendUp, TrendDown, ChartLine, Notepad, CaretRight} from "@phosphor-icons/react";
import Link from "next/link";

export const DashboardTradeTable = ({ trades, loading } : any) => {
  const getStatusStyles = (rr: number) => {
    if (rr > 1) return { bg: "#f0fdf4", text: "#166534", border: "#bbf7d0", label: "TP" };
    if (rr === 1) return { bg: "#fff7ed", text: "#9a3412", border: "#ffedd5", label: "BE" };
    return { bg: "#fef2f2", text: "#991b1b", border: "#fecaca", label: "SL" };
  };

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="p-10 text-center text-slate-400">Se încarcă datele...</div>
      ) : trades.length === 0 ? (
        <div className="p-10 text-center text-slate-400">Nu există tranzacții.</div>
      ) : (
        trades.map((trade: any) => {
          const config = getStatusStyles(Number(trade.rr));
          return (
          <Link
            href={`/trades/${trade._id}`} 
            key={trade._id}
            className="grid grid-cols-6 gap-4 items-center bg-white p-4 px-6 rounded-2xl border border-slate-100 shadow-sm hover:border-yellow-400 hover:shadow-md transition-all group cursor-pointer"
          >
            {/* Data */}
              <div className="flex flex-col">
                <span className="text-sm font-bold">{new Date(trade.date).toLocaleDateString('ro-RO')}</span>
                <span className="text-[10px] text-slate-400 uppercase">{trade.dayOfWeek}</span>
              </div>

              {/* Simbol */}
              <div className="font-bold text-slate-700">{trade.symbol}</div>

              {/* Tip - Folosim culori diferite pentru Long/Short */}
              <div>
                {trade.orderType === 'long' ? (
                  <TrendUp size={28} weight="bold" className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"/>
                ) : (
                  <TrendDown size={28} weight="bold" className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"/> 
                )}
              </div>

              {/* Lichiditate */}
              <div className="text-xs text-slate-500 font-medium truncate">{trade.typeOfLiquidity}</div>

              {/* RR Status */}
              <div className="text-center">
                <span className="text-[9px] font-black px-3 py-1.5 rounded-full border" style={{ backgroundColor: config.bg, color: config.text, borderColor: config.border }}>
                  {config.label}
                </span>
              </div>

              {/* Execuție */}
              <div className="flex justify-end">
                {trade.executed ? (
                  <div title="Executat"><ChartLine size={24}weight="fill" className="text-slate-300" /></div>
                ) : (
                  <div title="Doar Notat"><Notepad size={24} weight="fill" className="text-slate-200" /></div>
                )}
              </div>
          </Link>
          );
        })
      )}
    </div>
  );
};