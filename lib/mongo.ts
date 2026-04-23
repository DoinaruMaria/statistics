import { MongoClient, MongoClientOptions } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Te rog adaugă MONGODB_URI în fișierul .env.local');
}

const uri = process.env.MONGODB_URI;

// Rezolvare: Specificăm tipul MongoClientOptions pentru a evita eroarea de assignability
const options: MongoClientOptions = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // Rezolvare: Folosim "global as any" pentru a evita eroarea de tip pe obiectul global
  let globalWithMongo = global as any;

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;