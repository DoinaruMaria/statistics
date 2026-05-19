"use client";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { ITrade } from "@/app/types";
 import { Clock, BookOpenText, CalendarPlus } from "@phosphor-icons/react";

const dropdown_options = {
  lichiditate: [
    { nume: "HOD (Maximul Zilei)", valoare: "HOD" },
    { nume: "LOD (Minimul Zilei)", valoare: "LOD" },
    { nume: "London High", valoare: "London High" },
    { nume: "London Low", valoare: "London Low" },
    { nume: "Lichiditate Majoră", valoare: "Lichiditate majora" },
    { nume: "Lichiditate Locală", valoare: "Lichiditate locala" },
    { nume: "Lichiditate Minoră", valoare: "Lichiditate minora" },
  ],
  setup: [
    { nume: "OSG", valoare: "osg" },
    { nume: "OSG + SLG", valoare: "osg+slg" },
    { nume: "TG", valoare: "tg" },
    { nume: "TG + SLG", valoare: "tg+slg" },
    { nume: "TCG", valoare: "tcg" },
    { nume: "TCG + SLG", valoare: "tcg+slg" },
    { nume: "3G", valoare: "3g" },
    { nume: "3G + SLG", valoare: "3g+slg" },
     { nume: "3CG", valoare: "3cg" },
    { nume: "3CG + SLG", valoare: "3cg+slg" },
  ],
  mss: [
    { nume: "Normal", valoare: "normal" },
    { nume: "Agresiv", valoare: "agresiv" },
  ]
};

export default function PaginaAdaugareTrade() {
  const { register, handleSubmit, setValue, reset } = useForm<ITrade>();
  const [seIncarca, setSeIncarca] = useState(false);

  const onSubmit = async (data: ITrade) => {
    setSeIncarca(true);
    try {
      const raspuns = await fetch('/api/trades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, userId: "user_maria_01" }),
      });
      if (raspuns.ok) { alert("Tranzacție salvată!"); reset(); }
    } catch (e) { alert("Eroare de conexiune."); }
    finally { setSeIncarca(false); }
  };

  const seteazaZiuaSaptamanii = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dataSelectata = new Date(e.target.value);
    const zile = ["Duminică", "Luni", "Marți", "Miercuri", "Joi", "Vineri", "Sâmbătă"];
    setValue("dayOfWeek", zile[dataSelectata.getDay()]);
  };

  const stilInput = "w-full bg-white/70 border-2 border-slate-200 p-3 rounded-2xl focus:border-yellow-400 focus:bg-white outline-none transition-all text-sm text-slate-700 shadow-xs";
  const stilLabel = "text-xs font-bold text-slate-500 mb-1.5 ml-1 block";

  return (
    <main className="p-4 md:p-10 max-w-7xl mx-auto font-sans text-slate-800">
      <header className="mb-10 bg-white/40 backdrop-blur-md p-8 rounded-[2.5rem] border border-slate-200 shadow-lg">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 uppercase">trade nou</h1>
          <p className="text-sm text-slate-500 mt-1">Introdu detaliile tehnice ale setup-ului tău</p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* GRUP 1: TIMP ȘI ACTIV */}
        <div className="md:col-span-2 bg-white/40 p-8 rounded-[2.5rem] border border-slate-200 shadow-md">
          <h3 className="text-base font-bold mb-6 text-slate-800 uppercase border-b border-slate-200 pb-2">Detalii Timp și Activ</h3>
          <div className="grid grid-cols-2 gap-5">
            <div title="Perechea valutară sau activul (ex: BTC/USDT)">
              <label className={stilLabel}>Simbol</label>
              <input {...register("symbol")} placeholder="ex: EUR/USD" className={stilInput} />
            </div>
            <div title="Data la care s-a executat intrarea">
              <label className={stilLabel}>Data Calendaristică</label>
              <input {...register("date")} type="date" onChange={seteazaZiuaSaptamanii} className={stilInput} />
            </div>
            <div title="Ziua săptămânii (calculată automat)">
              <label className={stilLabel}>Ziua Săptămânii</label>
              <input {...register("dayOfWeek")} readOnly className={`${stilInput} bg-slate-100/50 cursor-not-allowed border-slate-100`} />
            </div>
            <div title="Ora exactă a deschiderii poziției">
              <label className={stilLabel}>Ora Intrării</label>
              <input {...register("timeHours")} type="time" className={stilInput} />
            </div>
          </div>
        </div>

        {/* GRUP 2: LICHIDITATE */}
        <div className="md:col-span-2 bg-white/40 p-8 rounded-[2.5rem] border border-slate-200 shadow-md">
          <h3 className="text-base font-bold mb-6 text-slate-800 uppercase border-b border-slate-200 pb-2">Analiza Lichidității</h3>
          <div className="grid grid-cols-2 gap-5">
            <div title="Punctul de lichiditate vizat">
              <label className={stilLabel}>Tip Lichiditate</label>
              <select {...register("typeOfLiquidity")} className={stilInput}>
                {dropdown_options.lichiditate.map(opt => (
                  <option key={opt.valoare} value={opt.valoare}>{opt.nume}</option>
                ))}
              </select>
            </div> 
            <div title="Ora formare HOD">
              <label className={stilLabel}>HOD</label>
              <input {...register("hodTime")} type="time" className={stilInput} />
            </div>
            <div title="Ora formare LOD">
              <label className={stilLabel}>LOD</label>
              <input {...register("lodTime")} type="time" className={stilInput} />
            </div>
            <div title="Valoarea trebuie exprimată în numărul de candele pe timeframe de 1 minut">
              <label className={stilLabel}>Vechime Lichiditate (Candele 1m)</label>
              <input {...register("liquidityOldness")} type="number" placeholder="ex: 120" className={stilInput} />
            </div>
            
          </div>
        </div>

        {/* GRUP 3: EXECUȚIE */}
        <div className="md:col-span-3 bg-white/40 p-8 rounded-[2.5rem] border border-slate-200 shadow-md">
          <h3 className="text-base font-bold mb-6 text-slate-800 uppercase border-b border-slate-100 pb-2">Configurare Execuție</h3> 
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
             <div title="Minute scurse de la lichiditate până la apariția setup-ului">
              <label className={stilLabel}>Timp până la Setup (min)</label>
              <input {...register("timeToSetup")} type="number" placeholder="ex: 10" className={stilInput} />
            </div>
            <div title="Distanța curentă față de All-Time High">
              <label className={stilLabel}>Distanță față de ATH</label>
              <input {...register("athDistance")} type="number" step="any" className={stilInput} />
            </div>
            <div title="Modelul tehnic de intrare">
              <label className={stilLabel}>Tip Setup</label>
              <select {...register("setup")} className={stilInput}>
                {dropdown_options.setup.map(opt => (
                  <option key={opt.valoare} value={opt.valoare}>{opt.nume}</option>
                ))}
              </select>
            </div>
            <div title="Market Structure Shift">
              <label className={stilLabel}>MSS</label>
              <select {...register("mss")} className={stilInput}>
                {dropdown_options.mss.map(opt => (
                  <option key={opt.valoare} value={opt.valoare}>{opt.nume}</option>
                ))}
              </select>
            </div>
            <div title="Raportul profit/risc estimat. Atenție, 0 este introdus dacă este SL, 1 dacă este BE, iar pentru TP se introduce valoarea raportului (ex: 2.5)">
              <label className={stilLabel}>Raport RR</label>
              <input {...register("rr")} type="number" step="0.1" className={stilInput} />
            </div>
            <div title="Nivelul de preț pentru oprirea pierderii">
              <label className={stilLabel}>Stop Loss</label>
              <input {...register("stopLoss")} type="number" step="0.00001" className={stilInput} />
            </div>
          </div>
          <div className="flex gap-10 mt-8 pt-6">
            <div title="Direcția tranzacției" className="w-48">
              <label className={stilLabel}>Tip Poziție</label>
              <div className="flex gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                <label className="flex-1 text-[10px] py-1.5 font-bold cursor-pointer rounded-lg text-center transition-all has-[:checked]:bg-yellow-500 has-[:checked]:text-slate-900 text-slate-400">
                  <input type="radio" {...register("orderType")} value="long" className="hidden" defaultChecked /> LONG
                </label>
                <label className="flex-1 text-[10px] py-1.5 font-bold cursor-pointer rounded-lg text-center transition-all has-[:checked]:bg-yellow-500 has-[:checked]:text-slate-900 text-slate-400">
                  <input type="radio" {...register("orderType")} value="short" className="hidden" /> SHORT
                </label>
              </div>
            </div>
             <div title="Stare Tranzacție" className="w-64">
              <label className={stilLabel}>Stare Execuție</label>
              <div className="flex gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                <label className="flex-1 text-[10px] py-1.5 font-bold cursor-pointer rounded-lg text-center transition-all has-[:checked]:bg-yellow-500 has-[:checked]:text-slate-900 text-slate-400">
                  <input type="radio" {...register("executed", { setValueAs: (v) => v === "true" })}  className="hidden" defaultChecked /> EXECUTAT
                </label>
                <label className="flex-1 text-[10px] py-1.5 font-bold cursor-pointer rounded-lg text-center transition-all has-[:checked]:bg-yellow-500 has-[:checked]:text-slate-900 text-slate-400">
                  <input type="radio" {...register("executed", { setValueAs: (v) => v === "false" })} className="hidden" /> NOTAT
                </label>
              </div>
            </div>
             <div className="flex flex-col gap-3 pb-2">
              <label className="flex items-center gap-3 cursor-pointer group" title="Bifează dacă există știri economice">
                <input type="checkbox" {...register("newsDay")} className="w-5 h-5 accent-yellow-400 border-slate-300 rounded-lg transition-all" />
                <span className="text-[11px] font-bold text-slate-500 group-hover:text-slate-900 uppercase">Știri</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group" title="Bifează dacă trade-ul a fost securizat la BE">
                <input type="checkbox" {...register("be")} className="w-5 h-5 accent-yellow-400 border-slate-300 rounded-lg transition-all" />
                <span className="text-[11px] font-bold text-slate-500 group-hover:text-slate-900 uppercase">BE</span>
              </label>
            </div>
          </div>
        </div>

        {/* GRUP 4: MEDIA ȘI SALVARE */}
        <div className="md:col-span-1 flex flex-col gap-5">
          <div className="bg-slate-900 text-white p-7 rounded-[2.5rem] shadow-md">
             <h3 className="text-xs font-bold mb-5 text-yellow-400 uppercase">Link-uri Capturi</h3>
             <input {...register("liquidityImage")} title="Introduceți link-ul către imaginea de lichiditate" placeholder="Link Poză Lichiditate" className="w-full bg-white/10 border border-white/20 p-3 rounded-xl text-xs mb-3 outline-none focus:border-yellow-400" />
             <input {...register("setupImage")} title="Introduceți link-ul către imaginea de setup" placeholder="Link Poză Setup" className="w-full bg-white/10 border border-white/20 p-3 rounded-xl text-xs outline-none focus:border-yellow-400" />
             <textarea {...register("notes")} title="Adaugă observații personale despre execuție" placeholder="Note adiționale despre trade..." className="w-full bg-transparent mt-4 text-xs border-t border-white/10 pt-4 outline-none min-h-[80px]" />
          </div>
          <button 
            type="submit" 
            disabled={seIncarca}
            className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 uppercase font-bold py-6 rounded-[2.5rem] shadow-md transition-all active:scale-95 text-lg"
          >
             {seIncarca ? "Se salvează..." : "Salvează Trade"}
          </button>
        </div>
      </form>
    </main>
  );
}