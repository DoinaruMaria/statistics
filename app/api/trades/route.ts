import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongo';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("trading_db");

    // Validare minimă (opțional, dar recomandat)
    if (!body.symbol || !body.userId) {
      return NextResponse.json({ error: "Lipsesc date esențiale" }, { status: 400 });
    }

    // Conversia datei din string în obiect Date dacă este cazul
    const tradeData = {
      ...body,
      date: new Date(body.date),
      createdAt: new Date()
    };

    const result = await db.collection("trades").insertOne(tradeData);

    return NextResponse.json({ 
      message: "Trade salvat cu succes!", 
      id: result.insertedId 
    }, { status: 201 });

  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Eroare la salvarea tranzacției" }, { status: 500 });
  }
}