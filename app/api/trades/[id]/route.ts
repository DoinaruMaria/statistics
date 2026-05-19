// app/api/trades/[id]/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongo';
import { ObjectId } from 'mongodb';

/**
 * În Next.js 15+, params este un Promise. 
 * Trebuie să definim tipul corect și să folosim await pe el.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Observă tipul Promise aici
) {
  try {
    // 1. Așteptăm rezolvarea parametrilor (specific versiunilor noi Next.js)
    const { id } = await params;

    // 2. Așteptăm conexiunea la MongoDB (fără paranteze, e un obiect Promise)
    const client = await clientPromise;
    const db = client.db("trading_db");

    // 3. Validăm formatul ID-ului
    if (!id || id.length !== 24) {
      return NextResponse.json({ error: "Format ID invalid" }, { status: 400 });
    }

    // 4. Căutăm tranzacția
    const trade = await db.collection("trades").findOne({
      _id: new ObjectId(id)
    });

    if (!trade) {
      return NextResponse.json({ error: "Tranzacția nu există" }, { status: 404 });
    }

    return NextResponse.json(trade);
  } catch (e) {
    console.error("Eroare API:", e);
    return NextResponse.json({ error: "Eroare internă de server" }, { status: 500 });
  }
}