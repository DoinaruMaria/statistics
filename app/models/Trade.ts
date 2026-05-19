import mongoose, { Schema, model, models } from "mongoose";
import { ITrade } from "@/app/types"; 

/**
 * 
 * The Schema is the runtime validator for MongoDB.
 * We pass the ITrade interface to the Schema to ensure 
 * that our database model stays synchronized with our TypeScript types.
 */

const TradeSchema = new Schema<ITrade>({
  userId: { type: String, required: true },
  symbol: { type: String, required: true },
  dayOfWeek: { type: String, required: true },
  date: { type: Date, required: true },
  timeHours: { type: String, required: true },
  durationMinutes: { type: Number, required: true },
  typeOfLiquidity: { 
    type: String, 
    required: true 
  },
  liquidityOldness: { type: Number, required: true },
  orderType: { type: String, enum: ['long', 'short'], required: true },
  setup: { type: String, required: true },
  mss: { type: String, enum: ['normal', 'agresiv'], required: true },
  stopLoss: { type: Number, required: true },
  newsDay: { type: Boolean, default: false },
  be: { type: Boolean, default: false },
  rr: { type: Number, required: true },
  timeToSetup: { type: Number, required: true },
  hodTime: { type: String },
  lodTime: { type: String },
  athDistance: { type: Number },
  liquidityImage: { type: String },
  setupImage: { type: String, required: true },
  notes: { type: String },
  executed: { type: Boolean, default: false },
}, { 
  // This automatically manages 'createdAt' and 'updatedAt' fields
  timestamps: true 
});

/**
 * Next.js Implementation Note:
 * Because Next.js uses Hot Reloading, it might try to define the model 
 * multiple times. This check ensures we use the existing model if it's 
 * already been initialized.
 */
const Trade = models.Trade || model<ITrade>("Trade", TradeSchema);

export default Trade;