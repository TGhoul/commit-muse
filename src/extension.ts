import * as vscode from 'vscode';
import { registerGenerateMessageCommand } from './commands/generateMessageCommand';
import { registerGenerateMessageWithHintCommand } from './commands/generateMessageWithHintCommand';
import { registerVerifyProviderCommand } from './commands/verifyProviderCommand';
import { registerOpenSettingsCommand } from './commands/openSettingsCommand';
import { syncPromptTemplateWithPreset } from './core/config/configurationService';
import { getLogger, logDebug } from './core/vscode/logger';

export function activate(context: vscode.ExtensionContext): void {
  const logger = getLogger();
  logDebug('Extension activated');
  void syncPromptTemplateWithPreset();

  context.subscriptions.push(
    logger,
    registerGenerateMessageCommand(context),
    registerGenerateMessageWithHintCommand(context),
    registerVerifyProviderCommand(context),
    registerOpenSettingsCommand(),
    vscode.workspace.onDidChangeConfiguration((event) => {
      void syncPromptTemplateWithPreset(event);
    }),
  );
}

export function deactivate(): void {}
