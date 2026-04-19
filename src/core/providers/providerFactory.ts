import * as vscode from 'vscode';
import { getConfig } from '../config/configurationService';
import { getApiKey, storeApiKey } from '../config/secretStore';
import { generateWithAnthropic } from './anthropicProvider';
import { generateWithOpenAiCompatible } from './openAiCompatibleProvider';
import { logDebug } from '../vscode/logger';

export async function generateTextWithActiveProvider(
  context: vscode.ExtensionContext,
  prompt: string,
  abortSignal?: AbortSignal,
): Promise<string> {
  const config = getConfig();
  const apiKey = await requireApiKey(context, config.provider);

  logDebug('Starting provider request', {
    provider: config.provider,
    model: config.model,
    baseUrl: config.baseUrl || null,
    promptLength: prompt.length,
    hasApiKey: Boolean(apiKey),
  });

  if (config.provider === 'anthropic') {
    return generateWithAnthropic({
      apiKey,
      model: config.model,
      baseUrl: config.baseUrl,
      prompt,
      abortSignal,
    });
  }

  return generateWithOpenAiCompatible({
    apiKey,
    model: config.model,
    baseUrl: config.baseUrl,
    prompt,
    abortSignal,
  });
}

async function requireApiKey(context: vscode.ExtensionContext, provider: 'anthropic' | 'openai-compatible'): Promise<string> {
  const existing = await getApiKey(context, provider);
  if (existing) {
    return existing;
  }

  const entered = await vscode.window.showInputBox({
    prompt: `Enter API key for ${provider}`,
    password: true,
    ignoreFocusOut: true,
  });

  if (!entered) {
    throw new Error(`Missing API key for ${provider}.`);
  }

  await storeApiKey(context, provider, entered);
  return entered;
}
