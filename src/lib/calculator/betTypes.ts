import { BetType, PurchaseMethod } from '../types';

export const BET_TYPES: Record<BetType, {
  name: BetType;
  displayName: string;
  minHorses: number;
  maxHorses: number;
  positions: number;
  description: string;
}> = {
  '単勝': { name: '単勝', displayName: '単勝', minHorses: 1, maxHorses: 18, positions: 1, description: '1着になる馬を当てる' },
  '複勝': { name: '複勝', displayName: '複勝', minHorses: 1, maxHorses: 18, positions: 1, description: '3着以内に入る馬を当てる' },
  '枠連': { name: '枠連', displayName: '枠連', minHorses: 2, maxHorses: 8, positions: 2, description: '1着・2着の枠番を当てる（順不同）' },
  '馬連': { name: '馬連', displayName: '馬連', minHorses: 2, maxHorses: 18, positions: 2, description: '1着・2着の馬を当てる（順不同）' },
  'ワイド': { name: 'ワイド', displayName: 'ワイド', minHorses: 2, maxHorses: 18, positions: 2, description: '3着以内に入る2頭を当てる（順不同）' },
  '馬単': { name: '馬単', displayName: '馬単', minHorses: 2, maxHorses: 18, positions: 2, description: '1着・2着の馬を着順通りに当てる' },
  '3連複': { name: '3連複', displayName: '3連複', minHorses: 3, maxHorses: 18, positions: 3, description: '1着・2着・3着の馬を当てる（順不同）' },
  '3連単': { name: '3連単', displayName: '3連単', minHorses: 3, maxHorses: 18, positions: 3, description: '1着・2着・3着の馬を着順通りに当てる' },
};

export function isOrderedBet(betType: BetType): boolean {
  return betType === '馬単' || betType === '3連単';
}

export function isTripleBet(betType: BetType): boolean {
  return betType === '3連複' || betType === '3連単';
}

export function isSingleBet(betType: BetType): boolean {
  return betType === '単勝' || betType === '複勝';
}

export function isFrameBet(betType: BetType): boolean {
  return betType === '枠連';
}

export function isPurchaseMethodAvailable(betType: BetType, method: PurchaseMethod): boolean {
  if (isSingleBet(betType)) return method === '通常';
  return true;
}
