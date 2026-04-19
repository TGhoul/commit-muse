import * as vscode from 'vscode';
import { ProviderType } from '../providers/providerTypes';
import { PromptPreset, getPromptTemplate } from '../prompt/defaultPrompts';

export const LOCALE_LABELS = {
  'en': 'English',
  'zh-CN': 'Simplified Chinese',
  'zh-TW': 'Traditional Chinese',
  'ja': 'Japanese',
  'ko': 'Korean',
  'es': 'Spanish',
  'fr': 'French',
  'de': 'German',
  'pt-BR': 'Portuguese (Brazil)',
  'it': 'Italian',
  'ru': 'Russian',
  'ar': 'Arabic',
  'hi': 'Hindi',
  'nl': 'Dutch',
  'tr': 'Turkish',
  'pl': 'Polish',
  'uk': 'Ukrainian',
  'vi': 'Vietnamese',
  'id': 'Indonesian',
} as const;

export type SupportedLocale = keyof typeof LOCALE_LABELS;
export const SUPPORTED_LOCALES = Object.keys(LOCALE_LABELS) as SupportedLocale[];

export interface CommitMuseConfig {
  provider: ProviderType;
  model: string;
  baseUrl?: string;
  locale: SupportedLocale;
  localeLabel: string;
  timeoutMs: number;
  maxDiffChars: number;
  promptPreset: PromptPreset | 'custom';
  promptTemplate: string;
}

export function getConfig(): CommitMuseConfig {
  const config = vscode.workspace.getConfiguration('commitMuse');
  const locale = config.get<string>('locale', 'en');
  const normalizedLocale = isSupportedLocale(locale) ? locale : 'en';

  const promptPreset = config.get<PromptPreset | 'custom'>('promptPreset', 'basic');
  const customPromptTemplate = config.get<string>('promptTemplate', '');

  return {
    provider: config.get<ProviderType>('provider', 'anthropic'),
    model: config.get<string>('model', 'claude-3-5-sonnet-latest'),
    baseUrl: config.get<string>('baseUrl') || undefined,
    locale: normalizedLocale,
    localeLabel: LOCALE_LABELS[normalizedLocale],
    timeoutMs: config.get<number>('timeoutMs', 30000),
    maxDiffChars: config.get<number>('maxDiffChars', 12000),
    promptPreset,
    promptTemplate: promptPreset === 'custom' ? customPromptTemplate : getPromptTemplate(promptPreset),
  };
}

export async function syncPromptTemplateWithPreset(event?: vscode.ConfigurationChangeEvent): Promise<void> {
  if (event && !event.affectsConfiguration('commitMuse.promptPreset')) {
    return;
  }

  const config = vscode.workspace.getConfiguration('commitMuse');
  const promptPreset = config.get<PromptPreset | 'custom'>('promptPreset', 'basic');

  if (promptPreset === 'custom') {
    return;
  }

  const expectedTemplate = getPromptTemplate(promptPreset);
  const currentTemplate = config.get<string>('promptTemplate', '');

  if (currentTemplate === expectedTemplate) {
    return;
  }

  await config.update('promptTemplate', expectedTemplate, vscode.ConfigurationTarget.Global);
}

function isSupportedLocale(locale: string): locale is SupportedLocale {
  return locale in LOCALE_LABELS;
}
