import { BetType, BetSelection } from '../types';

// 返還馬の処理: 返還馬を含む買い目を除外し、点数と金額を再計算
export function processRefund(
  betType: BetType,
  selections: BetSelection[],
  refundHorses: number[],
  unitAmount: number
): {
  validSelections: BetSelection[];
  refundedSelections: BetSelection[];
  refundCount: number;
  refundAmount: number;
  newTotalCost: number;
} {
  const validSelections: BetSelection[] = [];
  const refundedSelections: BetSelection[] = [];

  for (const sel of selections) {
    const hasRefundHorse = sel.horses.some(h => refundHorses.includes(h));
    if (hasRefundHorse) {
      refundedSelections.push(sel);
    } else {
      validSelections.push(sel);
    }
  }

  return {
    validSelections,
    refundedSelections,
    refundCount: refundedSelections.length,
    refundAmount: refundedSelections.length * unitAmount,
    newTotalCost: validSelections.length * unitAmount,
  };
}
