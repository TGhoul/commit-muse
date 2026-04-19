import { generateText } from 'ai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { logDebug } from '../vscode/logger';

export interface AnthropicProviderOptions {
  apiKey: string;
  model: string;
  baseUrl?: string;
  prompt: string;
  abortSignal?: AbortSignal;
}

export async function generateWithAnthropic(options: AnthropicProviderOptions): Promise<string> {
  const anthropic = createAnthropic({
    apiKey: options.apiKey,
    baseURL: options.baseUrl,
  });

  const result = await generateText({
    model: anthropic(options.model),
    prompt: options.prompt,
    abortSignal: options.abortSignal,
  });

  logDebug('Anthropic response received', {
    textLength: result.text.length,
    finishReason: result.finishReason,
    usage: result.usage,
  });

  return result.text;
}
