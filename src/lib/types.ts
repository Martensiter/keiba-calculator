// 馬券種の定義
export type BetType = '単勝' | '複勝' | '枠連' | '馬連' | 'ワイド' | '馬単' | '3連複' | '3連単';

// 購入方法の定義
export type PurchaseMethod = '通常' | 'ながし' | 'BOX' | 'フォーメーション';

// 馬の情報
export interface Horse {
  number: number;
  name?: string;
  frameNumber?: number;
  jockey?: string;
}

// 買い目の定義
export interface BetSelection {
  horses: number[];
  odds?: number;
}

// フォーメーション用の選択
export interface FormationSelection {
  first: number[];
  second: number[];
  third?: number[];
}

// ながし用の選択
export interface NagashiSelection {
  axis: number[];
  partner: number[];
  axisPosition?: '1着' | '2着' | '3着' | '軸';
}

// 買い目リスト
export interface BetTicket {
  id: string;
  betType: BetType;
  purchaseMethod: PurchaseMethod;
  selections: BetSelection[];
  unitAmount: number;
  totalCost: number;
  expectedPayout?: number;
  actualPayout?: number;
  result?: BetResult;
}

// 結果の定義
export interface BetResult {
  first: number;
  second: number;
  third?: number;
  refundHorses?: number[];
  dividend?: number;
}

// レース情報
export interface RaceInfo {
  venue: string;
  raceNumber: number;
  raceName?: string;
  horses: Horse[];
  date?: string;
}

// 計算結果
export interface CalculationResult {
  ticketCount: number;
  totalCost: number;
  expectedPayout?: number;
  expectedReturn?: number;
  actualPayout?: number;
  actualReturn?: number;
  profit?: number;
  hitTickets?: BetSelection[];
}

// 購入リスト（複数レース管理用）
export interface PurchaseList {
  id: string;
  raceInfo: RaceInfo;
  tickets: BetTicket[];
  totalInvestment: number;
  totalPayout: number;
  totalProfit: number;
  returnRate: number;
}

// 即PATインポート用の型
export interface IpatOddsData {
  betType: BetType;
  odds: Map<string, number>;
}

export interface IpatHistoryData {
  raceName: string;
  betType: BetType;
  selections: string[];
  amount: number;
  result?: string;
}

export interface IpatRaceData {
  horses: Horse[];
  raceName?: string;
  venue?: string;
  raceNumber?: number;
}
