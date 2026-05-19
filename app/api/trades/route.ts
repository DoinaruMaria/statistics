import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongo';

// Forțează Next.js să ruleze funcția live la fiecare cerere, oprind memoria cache.
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("trading_db");

    if (!body.symbol || !body.userId) {
      return NextResponse.json({ error: "Lipsesc date esențiale" }, { status: 400 });
    }

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

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("trading_db"); // Ne asigurăm că citim din locul corect
    
    const trades = await db.collection("trades")
      .find({})
      .sort({ date: -1 })
      .toArray();

    return NextResponse.json(trades);
  } catch (e) {
    return NextResponse.json({ error: "Eroare la preluarea datelor" }, { status: 500 });
  }
}