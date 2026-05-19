"use client";

import { useState, useEffect } from "react";
import { ITrade } from "@/app/types";
import { DashboardTradeTable } from "@/app/componets/table/DashboardTradeTable";
import { Charts } from "@/app/componets/Charts";

export default function Dashboard() {
  const [trades, setTrades] = useState<ITrade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const preiaTradeuri = async () => {
      try {
        const res = await fetch("/api/trades");
        const data = await res.json();
        setTrades(data);
      } catch (err) {
        console.error("Eroare:", err);
      } finally {
        setLoading(false);
      }
    };
    preiaTradeuri();
  }, []);

  return (
    <main className="flex flex-col gap-8 p-8 min-h-screen">
      <Charts trades={trades} />

        <header className="flex justify-between items-center mb-6">
          <a href="/add_trade" className="bg-yellow-400 text-slate-900 px-6 py-2 rounded-xl text-sm font-bold hover:bg-yellow-500 transition-all">
            + Adaugă Trade
          </a>
        </header>
  
        <DashboardTradeTable trades={trades} loading={loading} />

      
    </main>
  );
}