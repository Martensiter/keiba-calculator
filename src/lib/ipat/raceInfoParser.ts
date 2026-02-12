import { Horse, IpatRaceData } from '../types';

// 即PATの出馬表テキストをパース
export function parseRaceInfoText(text: string): IpatRaceData {
  const lines = text.trim().split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const horses: Horse[] = [];
  let raceName: string | undefined;
  let venue: string | undefined;
  let raceNumber: number | undefined;

  // レース名の検出
  const raceMatch = lines[0]?.match(/(?:(\S+?))?(\d{1,2})R(?:\s+(.+))?/);
  if (raceMatch) {
    venue = raceMatch[1] || undefined;
    raceNumber = parseInt(raceMatch[2], 10);
    raceName = raceMatch[3] || undefined;
  }

  for (const line of lines) {
    // パターン1: "枠番 馬番 馬名 騎手" (タブ区切りまたはスペース区切り)
    // 例: "1  1  アーモンドアイ  ルメール"
    const horseMatch = line.match(/(\d{1})\s+(\d{1,2})\s+(\S+)\s+(\S+)/);
    if (horseMatch) {
      const frameNumber = parseInt(horseMatch[1], 10);
      const number = parseInt(horseMatch[2], 10);
      const name = horseMatch[3];
      const jockey = horseMatch[4];

      if (number >= 1 && number <= 18 && frameNumber >= 1 && frameNumber <= 8) {
        horses.push({ number, name, frameNumber, jockey });
        continue;
      }
    }

    // パターン2: "馬番 馬名" (最小限)
    // 例: "1 アーモンドアイ"
    const simpleMatch = line.match(/^(\d{1,2})\s+(\S+)/);
    if (simpleMatch) {
      const number = parseInt(simpleMatch[1], 10);
      const name = simpleMatch[2];
      if (number >= 1 && number <= 18 && !name.match(/^\d/)) {
        // 既に追加済みでなければ追加
        if (!horses.find(h => h.number === number)) {
          horses.push({ number, name });
        }
      }
    }
  }

  // 馬番でソート
  horses.sort((a, b) => a.number - b.number);

  return { horses, raceName, venue, raceNumber };
}
