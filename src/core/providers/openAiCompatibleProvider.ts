import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { logDebug, logError } from '../vscode/logger';

export interface OpenAiCompatibleProviderOptions {
  apiKey: string;
  model: string;
  baseUrl?: string;
  prompt: string;
  abortSignal?: AbortSignal;
}

export async function generateWithOpenAiCompatible(options: OpenAiCompatibleProviderOptions): Promise<string> {
  const openai = createOpenAI({
    apiKey: options.apiKey,
    baseURL: options.baseUrl || undefined,
  });

  try {
    const result = await generateText({
      model: openai(options.model),
      prompt: options.prompt,
      abortSignal: options.abortSignal,
    });

    logDebug('OpenAI-compatible response received', {
      textLength: result.text.length,
      finishReason: result.finishReason,
      usage: result.usage,
    });

    return result.text;
  } catch (error) {
    logError('OpenAI-compatible request failed', error);
    throw error;
  }
}
