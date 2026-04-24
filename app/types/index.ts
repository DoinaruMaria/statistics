export type LiquidityType = 
  | 'HOD' | 'LOD' | 'Lichiditate majora' 
  | 'Lichiditate locala' | 'Lichiditate minora' 
  | 'London High' | 'London Low';

export type SetupType = 
  | 'osg' | 'tg' | 'tcg' | '3g' | '3cg' 
  | 'osg+slg' | 'tg+slg' | 'tcg+slg' | '3g+slg' | '3cg+slg';

export type MSSType = 'normal' | 'agresiv';
export type OrderType = 'long' | 'short';

export interface ITrade {
  _id?: string;
  userId: string;
  symbol: string;
  dayOfWeek: string;       // ex: "Luni"
  date: Date;              // Data calendaristică
  timeHours: string;       // ex: "14:30"
  durationMinutes: number;
  typeOfLiquidity: LiquidityType;
  liquidityOldness: number; // Număr de lumânări (1min TF)
  orderType: OrderType;
  setup: SetupType;
  mss: MSSType;
  stopLoss: number;
  newsDay: boolean;
  be: boolean;             // Break Even
  rr: number;              // Risk:Reward ratio
  timeToSetup: number;     // Minute de la lichiditate până la setup
  hodTime?: string;        // Ora High of Day
  lodTime?: string;        // Ora Low of Day
  athDistance?: number;    // Distanța până la ATH
  liquidityImage: string;  // Link către screenshot
  setupImage: string;      // Link către screenshot
  notes: string;
  executed: boolean;
}