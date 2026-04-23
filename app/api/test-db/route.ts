import clientPromise from '@/lib/mongo';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("trading_db");

    // Încercăm să listăm colecțiile pentru a confirma conexiunea
    const collections = await db.listCollections().toArray();

    return Response.json({ 
        message: "Conexiune reușită!", 
        collections 
    });
  } catch (e) {
    console.error(e);
    return Response.json({ 
        error: "Nu s-a putut conecta la baza de date" 
    }, { status: 500 });
  }
}