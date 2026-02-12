import { BetType } from '../types';

export interface JraOddsResult {
  betType: BetType | null;
  odds: { key: string; value: number; popularity?: number }[];
  parseErrors: string[];
}

/**
 * JRA公式サイト等のオッズテキストをパースする
 *
 * 対応形式:
 *   - 馬連: "1 - 2  15.3" / "1-2\t15.3" / "1ー2 15.3"
 *   - 馬単: "1 → 2  25.0" / "1→2 25.0"
 *   - 3連複: "1 - 2 - 3  150.5"
 *   - 3連単: "1 → 2 → 3  500.0"
 *   - 単勝/複勝: "1  2.5"
 *   - ワイド: "1 - 2  3.5 - 5.0" (範囲オッズ → 下限を採用)
 *   - JRA特有: 人気順表示 "1人気 1-2 15.3" 等
 *   - タブ区切り・スペース区切り両対応
 */
export function parseJraOddsText(text: string): JraOddsResult {
  const lines = text.trim().split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const odds: JraOddsResult['odds'] = [];
  const parseErrors: string[] = [];
  let betType: BetType | null = null;

  // 馬券種の自動検出
  const betTypePatterns: [RegExp, BetType][] = [
    [/三連単|3連単|三連勝単式/, '3連単'],
    [/三連複|3連複|三連勝複式/, '3連複'],
    [/馬単|馬番単勝/, '馬単'],
    [/馬連|馬番連勝/, '馬連'],
    [/ワイド|拡大馬番連勝/, 'ワイド'],
    [/枠連|枠番連勝/, '枠連'],
    [/単勝/, '単勝'],
    [/複勝/, '複勝'],
  ];

  for (const line of lines) {
    for (const [pattern, type] of betTypePatterns) {
      if (pattern.test(line)) {
        betType = type;
        break;
      }
    }
    if (betType) break;
  }

  for (const line of lines) {
    // ヘッダー行やラベル行をスキップ
    if (/^(馬番|組番|枠番|馬名|人気|オッズ|No|着順|番号|WIN|PLACE|QNL|QNP|EXA|TRI|TFC)/.test(line)) continue;
    if (/^(単勝|複勝|馬連|馬単|ワイド|枠連|3連複|3連単|三連複|三連単)/.test(line)) continue;
    if (/^[-=＝─━]+$/.test(line)) continue; // 区切り線スキップ

    const parsed = parseSingleLine(line);
    if (parsed) {
      odds.push(parsed);
    }
  }

  return { betType, odds, parseErrors };
}

/**
 * 1行をパースして {key, value, popularity?} を返す
 */
function parseSingleLine(line: string): JraOddsResult['odds'][0] | null {
  // 全角を半角に正規化
  let normalized = line
    .replace(/[０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFF10 + 0x30))
    .replace(/[，、]/g, ',')
    .replace(/[　]/g, ' ')
    .replace(/ー/g, '-')
    .replace(/＝/g, '=')
    .replace(/→/g, '=>')
    .replace(/⇒/g, '=>');

  // 人気順を抽出（あれば）
  let popularity: number | undefined;
  const popMatch = normalized.match(/(\d+)\s*人気/);
  if (popMatch) {
    popularity = parseInt(popMatch[1], 10);
    normalized = normalized.replace(/\d+\s*人気/, '').trim();
  }

  // パターン1: "1=>2=>3  500.0" (3連単形式)
  const triExaMatch = normalized.match(
    /^(\d{1,2})\s*=>\s*(\d{1,2})\s*=>\s*(\d{1,2})\s+([\d,]+\.?\d*)/
  );
  if (triExaMatch) {
    const key = `${triExaMatch[1]}-${triExaMatch[2]}-${triExaMatch[3]}`;
    const value = parseFloat(triExaMatch[4].replace(/,/g, ''));
    if (!isNaN(value)) return { key, value, popularity };
  }

  // パターン2: "1-2-3  150.5" (3連複形式)
  const triMatch = normalized.match(
    /^(\d{1,2})\s*[-=]\s*(\d{1,2})\s*[-=]\s*(\d{1,2})\s+([\d,]+\.?\d*)/
  );
  if (triMatch) {
    const key = `${triMatch[1]}-${triMatch[2]}-${triMatch[3]}`;
    const value = parseFloat(triMatch[4].replace(/,/g, ''));
    if (!isNaN(value)) return { key, value, popularity };
  }

  // パターン3: "1=>2  25.0" (馬単形式)
  const exaMatch = normalized.match(
    /^(\d{1,2})\s*=>\s*(\d{1,2})\s+([\d,]+\.?\d*)/
  );
  if (exaMatch) {
    const key = `${exaMatch[1]}-${exaMatch[2]}`;
    const value = parseFloat(exaMatch[3].replace(/,/g, ''));
    if (!isNaN(value)) return { key, value, popularity };
  }

  // パターン4: "1-2  15.3" (馬連/枠連/ワイド形式)
  // ワイドの場合は "1-2  3.5-5.0" のように範囲がある → 下限を採用
  const quinMatch = normalized.match(
    /^(\d{1,2})\s*[-=]\s*(\d{1,2})\s+([\d,]+\.?\d*)(?:\s*[-~～]\s*[\d,]+\.?\d*)?/
  );
  if (quinMatch) {
    const key = `${quinMatch[1]}-${quinMatch[2]}`;
    const value = parseFloat(quinMatch[3].replace(/,/g, ''));
    if (!isNaN(value)) return { key, value, popularity };
  }

  // パターン5: "1  2.5" (単勝/複勝形式)
  // 複勝の場合は "1  1.5-2.0" → 下限を採用
  const winMatch = normalized.match(
    /^(\d{1,2})\s+([\d,]+\.?\d*)(?:\s*[-~～]\s*[\d,]+\.?\d*)?$/
  );
  if (winMatch) {
    const key = winMatch[1];
    const value = parseFloat(winMatch[2].replace(/,/g, ''));
    if (!isNaN(value)) return { key, value, popularity };
  }

  // パターン6: タブ区切り "1\t2\t15.3" or "1\t15.3"
  const tabParts = normalized.split('\t').map(s => s.trim()).filter(s => s);
  if (tabParts.length >= 2) {
    const lastVal = parseFloat(tabParts[tabParts.length - 1].replace(/,/g, ''));
    if (!isNaN(lastVal) && lastVal >= 1) {
      const nums = tabParts.slice(0, -1).filter(p => /^\d{1,2}$/.test(p));
      if (nums.length >= 1) {
        return { key: nums.join('-'), value: lastVal, popularity };
      }
    }
  }

  return null;
}

/**
 * パースしたオッズ配列をキーで検索できるMapに変換
 */
export function jraOddsToMap(odds: JraOddsResult['odds']): Map<string, number> {
  const map = new Map<string, number>();
  for (const { key, value } of odds) {
    map.set(key, value);
  }
  return map;
}

/**
 * JRA公式のオッズページURLを馬券種に応じて生成
 */
export function getJraOddsUrl(betType: BetType): string {
  const base = 'https://www.jra.go.jp/JRADB/accessO.html';
  // JRA公式はパラメータでページ遷移するが、直接リンクは難しい
  // 汎用的なオッズページトップに誘導
  return base;
}

