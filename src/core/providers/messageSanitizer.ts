export function sanitizeCommitMessage(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, '')
    .replace(/^['\"]+|['\"]+$/g, '')
    .replace(/^(here is (your|a) commit message:?\s*)/i, '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .join(' ')
    .trim();
}
