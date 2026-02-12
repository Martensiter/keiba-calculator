import { BetType } from '../types';

export interface ParsedOdds {
  betType: BetType | null;
  odds: { key: string; value: number }[];
}

// 即PATオッズ一覧テキストからオッズ情報をパース
export function parseOddsText(text: string): ParsedOdds {
  const lines = text.trim().split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const odds: { key: string; value: number }[] = [];
  let betType: BetType | null = null;

  // 馬券種の検出
  const betTypeMap: Record<string, BetType> = {
    '単勝': '単勝', '複勝': '複勝', '枠連': '枠連',
    '馬連': '馬連', 'ワイド': 'ワイド', '馬単': '馬単',
    '三連複': '3連複', '3連複': '3連複',
    '三連単': '3連単', '3連単': '3連単',
  };

  for (const line of lines) {
    for (const [keyword, type] of Object.entries(betTypeMap)) {
      if (line.includes(keyword)) {
        betType = type;
        break;
      }
    }
  }

  // 「馬番(-)馬番 オッズ」の形式を検出
  // 例: "1 2.5", "1-2 15.3", "1-2-3 150.5", "1 → 2 25.0"
  for (const line of lines) {
    // パターン1: "1-2-3  150.5" or "1-2  15.3" or "1  2.5"
    const match = line.match(/^(\d+(?:\s*[-→＝]\s*\d+)*)\s+([\d,]+\.?\d*)/);
    if (match) {
      const key = match[1].replace(/\s*[-→＝]\s*/g, '-');
      const value = parseFloat(match[2].replace(/,/g, ''));
      if (!isNaN(value)) {
        odds.push({ key, value });
      }
      continue;
    }

    // パターン2: タブ区切り "1\t2.5"
    const tabMatch = line.match(/^(\d+(?:\t\d+)*)\t([\d,]+\.?\d*)/);
    if (tabMatch) {
      const nums = tabMatch[1].split('\t');
      const key = nums.join('-');
      const value = parseFloat(tabMatch[2].replace(/,/g, ''));
      if (!isNaN(value)) {
        odds.push({ key, value });
      }
    }
  }

  return { betType, odds };
}

// パースしたオッズを馬番の組み合わせキーに変換
export function oddsToMap(parsed: ParsedOdds): Map<string, number> {
  const map = new Map<string, number>();
  for (const { key, value } of parsed.odds) {
    map.set(key, value);
  }
  return map;
}
