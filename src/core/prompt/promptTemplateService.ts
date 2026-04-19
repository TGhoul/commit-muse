export interface PromptTemplateInput {
  template: string;
  diff: string;
  locale: string;
  hint?: string;
}

export function buildPrompt(input: PromptTemplateInput): string {
  const hintBlock = input.hint?.trim()
    ? `Use this hint to improve the commit message: ${input.hint.trim()}`
    : '';

  return input.template
    .replace('{locale}', input.locale)
    .replace('{diff}', input.diff)
    .replace('{Use this hint to improve the commit message: $hint}', hintBlock)
    .trim();
}
