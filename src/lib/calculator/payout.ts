import { BetType, BetSelection, BetResult, CalculationResult } from '../types';
import { isOrderedBet, isTripleBet } from './betTypes';

// 予想払戻金の計算
export function calculateExpectedPayout(
  selections: BetSelection[],
  unitAmount: number
): { totalPayout: number; returnRate: number; totalCost: number } {
  const totalCost = selections.length * unitAmount;

  let totalPayout = 0;
  for (const sel of selections) {
    if (sel.odds) {
      totalPayout += Math.floor(sel.odds * unitAmount / 100) * 100;
    }
  }

  const returnRate = totalCost > 0 ? (totalPayout / totalCost) * 100 : 0;

  return { totalPayout, returnRate, totalCost };
}

// 的中判定
export function checkHit(
  betType: BetType,
  selection: BetSelection,
  result: BetResult
): boolean {
  const { horses } = selection;

  switch (betType) {
    case '単勝':
      return horses[0] === result.first;

    case '複勝':
      return horses[0] === result.first ||
             horses[0] === result.second ||
             (result.third !== undefined && horses[0] === result.third);

    case '枠連':
    case '馬連':
    case 'ワイド': {
      const resultPair = [result.first, result.second].sort((a, b) => a - b);
      const selPair = [...horses].sort((a, b) => a - b);

      if (betType === 'ワイド') {
        const top3 = [result.first, result.second];
        if (result.third !== undefined) top3.push(result.third);
        return top3.includes(selPair[0]) && top3.includes(selPair[1]);
      }

      return selPair[0] === resultPair[0] && selPair[1] === resultPair[1];
    }

    case '馬単':
      return horses[0] === result.first && horses[1] === result.second;

    case '3連複': {
      if (result.third === undefined) return false;
      const resultTriple = [result.first, result.second, result.third].sort((a, b) => a - b);
      const selTriple = [...horses].sort((a, b) => a - b);
      return selTriple[0] === resultTriple[0] &&
             selTriple[1] === resultTriple[1] &&
             selTriple[2] === resultTriple[2];
    }

    case '3連単':
      if (result.third === undefined) return false;
      return horses[0] === result.first &&
             horses[1] === result.second &&
             horses[2] === result.third;

    default:
      return false;
  }
}

// 結果入力後の計算
export function calculateActualResult(
  betType: BetType,
  selections: BetSelection[],
  unitAmount: number,
  result: BetResult
): CalculationResult {
  const totalCost = selections.length * unitAmount;
  const hitTickets: BetSelection[] = [];

  for (const sel of selections) {
    if (checkHit(betType, sel, result)) {
      hitTickets.push(sel);
    }
  }

  const actualPayout = result.dividend
    ? hitTickets.length * Math.floor(result.dividend * unitAmount / 100 / 100) * 100
    : 0;

  const profit = actualPayout - totalCost;
  const actualReturn = totalCost > 0 ? (actualPayout / totalCost) * 100 : 0;

  return {
    ticketCount: selections.length,
    totalCost,
    actualPayout,
    actualReturn,
    profit,
    hitTickets,
  };
}
