export function extractClaudeStreamContent(raw: string): string {
  return raw
    .split('\n')
    .filter((line) => line.trim().startsWith('0:'))
    .map((line) => line.replace(/^0:\s*/, '').trim())
    .join('');
}
