import { BetType, IpatHistoryData } from '../types';

// 即PAT投票履歴テキストをパース
export function parseHistoryText(text: string): IpatHistoryData[] {
  const results: IpatHistoryData[] = [];
  const lines = text.trim().split('\n').map(l => l.trim()).filter(l => l.length > 0);

  const betTypeMap: Record<string, BetType> = {
    '単勝': '単勝', '複勝': '複勝', '枠連': '枠連',
    '馬連': '馬連', 'ワイド': 'ワイド', '馬単': '馬単',
    '三連複': '3連複', '3連複': '3連複',
    '三連単': '3連単', '3連単': '3連単',
  };

  let currentRace = '';
  let currentBetType: BetType | null = null;

  for (const line of lines) {
    // レース名の検出 (例: "1R", "東京11R", "中山5R ○○ステークス")
    const raceMatch = line.match(/(?:(\S+?))?(\d{1,2})R(?:\s+(.+))?/);
    if (raceMatch) {
      const venue = raceMatch[1] || '';
      const raceNum = raceMatch[2];
      const raceName = raceMatch[3] || '';
      currentRace = `${venue}${raceNum}R${raceName ? ' ' + raceName : ''}`;
      continue;
    }

    // 馬券種の検出
    for (const [keyword, type] of Object.entries(betTypeMap)) {
      if (line.includes(keyword)) {
        currentBetType = type;
        break;
      }
    }

    // 買い目と金額の検出 (例: "1-2-3  300円", "1→2  100円")
    const betMatch = line.match(/(\d+(?:\s*[-→＝]\s*\d+)*)\s+([\d,]+)\s*円/);
    if (betMatch && currentBetType) {
      const selection = betMatch[1].replace(/\s*[-→＝]\s*/g, '-');
      const amount = parseInt(betMatch[2].replace(/,/g, ''), 10);

      results.push({
        raceName: currentRace,
        betType: currentBetType,
        selections: [selection],
        amount,
      });
    }
  }

  return results;
}
