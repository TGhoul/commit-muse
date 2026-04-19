import * as vscode from 'vscode';
import { ProviderType } from '../providers/providerTypes';

function secretKey(provider: ProviderType): string {
  return `commitMuse.${provider}.apiKey`;
}

export async function getApiKey(context: vscode.ExtensionContext, provider: ProviderType): Promise<string | undefined> {
  return context.secrets.get(secretKey(provider));
}

export async function storeApiKey(context: vscode.ExtensionContext, provider: ProviderType, apiKey: string): Promise<void> {
  await context.secrets.store(secretKey(provider), apiKey);
}
