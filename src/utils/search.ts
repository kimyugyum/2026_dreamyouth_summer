const CHO = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];

function toCho(str: string): string {
  let o = '';
  for (const ch of str) {
    const c = ch.charCodeAt(0);
    o += c >= 0xac00 && c <= 0xd7a3 ? CHO[Math.floor((c - 0xac00) / 588)] : ch;
  }
  return o;
}

function norm(s: unknown): string {
  return String(s ?? '').replace(/[\s-]/g, '').toLowerCase();
}

function isChoQuery(q: string): boolean {
  return [...q].every((ch) => CHO.includes(ch));
}

export function matches(fields: unknown[], rawQ: string): boolean {
  const q = norm(rawQ);
  if (!q) return true;
  const choMode = isChoQuery(q);
  return fields.some((f) => {
    const n = norm(f);
    return n.includes(q) || (choMode && toCho(n).includes(q));
  });
}
