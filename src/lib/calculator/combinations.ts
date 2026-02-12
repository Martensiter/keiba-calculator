import { BetType, BetSelection, FormationSelection, NagashiSelection } from '../types';

function combination(n: number, r: number): number {
  if (r > n || r < 0) return 0;
  if (r === 0 || r === n) return 1;
  let result = 1;
  for (let i = 0; i < r; i++) {
    result *= (n - i);
    result /= (i + 1);
  }
  return Math.round(result);
}

function permutation(n: number, r: number): number {
  if (r > n || r < 0) return 0;
  let result = 1;
  for (let i = 0; i < r; i++) {
    result *= (n - i);
  }
  return result;
}

// BOX購入の点数計算
export function calculateBoxTickets(
  betType: BetType,
  horses: number[]
): { count: number; selections: BetSelection[] } {
  const n = horses.length;
  const selections: BetSelection[] = [];

  if (betType === '単勝' || betType === '複勝') {
    return { count: n, selections: horses.map(h => ({ horses: [h] })) };
  }

  if (betType === '馬連' || betType === 'ワイド' || betType === '枠連') {
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        selections.push({ horses: [horses[i], horses[j]] });
      }
    }
    return { count: selections.length, selections };
  }

  if (betType === '馬単') {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i !== j) selections.push({ horses: [horses[i], horses[j]] });
      }
    }
    return { count: selections.length, selections };
  }

  if (betType === '3連複') {
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        for (let k = j + 1; k < n; k++) {
          selections.push({ horses: [horses[i], horses[j], horses[k]] });
        }
      }
    }
    return { count: selections.length, selections };
  }

  if (betType === '3連単') {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (j !== i) {
          for (let k = 0; k < n; k++) {
            if (k !== i && k !== j) {
              selections.push({ horses: [horses[i], horses[j], horses[k]] });
            }
          }
        }
      }
    }
    return { count: selections.length, selections };
  }

  return { count: 0, selections: [] };
}

// ながし購入の点数計算
export function calculateNagashiTickets(
  betType: BetType,
  selection: NagashiSelection
): { count: number; selections: BetSelection[] } {
  const selections: BetSelection[] = [];

  if (betType === '馬連' || betType === 'ワイド' || betType === '枠連') {
    for (const axis of selection.axis) {
      for (const partner of selection.partner) {
        selections.push({ horses: [Math.min(axis, partner), Math.max(axis, partner)] });
      }
    }
    return { count: selections.length, selections };
  }

  if (betType === '馬単') {
    for (const axis of selection.axis) {
      for (const partner of selection.partner) {
        if (selection.axisPosition === '1着') {
          selections.push({ horses: [axis, partner] });
        } else {
          selections.push({ horses: [partner, axis] });
        }
      }
    }
    return { count: selections.length, selections };
  }

  if (betType === '3連複') {
    for (const axis of selection.axis) {
      for (let i = 0; i < selection.partner.length; i++) {
        for (let j = i + 1; j < selection.partner.length; j++) {
          const horses = [axis, selection.partner[i], selection.partner[j]].sort((a, b) => a - b);
          selections.push({ horses });
        }
      }
    }
    return { count: selections.length, selections };
  }

  if (betType === '3連単') {
    for (const axis of selection.axis) {
      for (let i = 0; i < selection.partner.length; i++) {
        for (let j = 0; j < selection.partner.length; j++) {
          if (i !== j) {
            if (selection.axisPosition === '1着') {
              selections.push({ horses: [axis, selection.partner[i], selection.partner[j]] });
            } else if (selection.axisPosition === '2着') {
              selections.push({ horses: [selection.partner[i], axis, selection.partner[j]] });
            } else {
              selections.push({ horses: [selection.partner[i], selection.partner[j], axis] });
            }
          }
        }
      }
    }
    return { count: selections.length, selections };
  }

  return { count: 0, selections: [] };
}

// フォーメーション購入の点数計算
export function calculateFormationTickets(
  betType: BetType,
  formation: FormationSelection
): { count: number; selections: BetSelection[] } {
  const selections: BetSelection[] = [];
  const seen = new Set<string>();

  if (betType === '馬連' || betType === 'ワイド' || betType === '枠連') {
    for (const first of formation.first) {
      for (const second of formation.second) {
        if (first !== second) {
          const key = [Math.min(first, second), Math.max(first, second)].join('-');
          if (!seen.has(key)) {
            seen.add(key);
            selections.push({ horses: [Math.min(first, second), Math.max(first, second)] });
          }
        }
      }
    }
    return { count: selections.length, selections };
  }

  if (betType === '馬単') {
    for (const first of formation.first) {
      for (const second of formation.second) {
        if (first !== second) {
          const key = `${first}-${second}`;
          if (!seen.has(key)) {
            seen.add(key);
            selections.push({ horses: [first, second] });
          }
        }
      }
    }
    return { count: selections.length, selections };
  }

  if (betType === '3連複' && formation.third) {
    for (const first of formation.first) {
      for (const second of formation.second) {
        for (const third of formation.third) {
          if (first !== second && first !== third && second !== third) {
            const key = [first, second, third].sort((a, b) => a - b).join('-');
            if (!seen.has(key)) {
              seen.add(key);
              selections.push({ horses: [first, second, third].sort((a, b) => a - b) });
            }
          }
        }
      }
    }
    return { count: selections.length, selections };
  }

  if (betType === '3連単' && formation.third) {
    for (const first of formation.first) {
      for (const second of formation.second) {
        for (const third of formation.third) {
          if (first !== second && first !== third && second !== third) {
            const key = `${first}-${second}-${third}`;
            if (!seen.has(key)) {
              seen.add(key);
              selections.push({ horses: [first, second, third] });
            }
          }
        }
      }
    }
    return { count: selections.length, selections };
  }

  return { count: 0, selections: [] };
}
