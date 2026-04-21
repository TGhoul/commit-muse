import * as vscode from 'vscode';

let outputChannel: vscode.OutputChannel | undefined;

export function getLogger(): vscode.OutputChannel {
  outputChannel ??= vscode.window.createOutputChannel('Commit Muse');
  return outputChannel;
}

export function logDebug(message: string, details?: Record<string, unknown>): void {
  const logger = getLogger();
  const timestamp = new Date().toISOString();

  logger.appendLine(`[${timestamp}] ${message}`);

  if (details) {
    logger.appendLine(JSON.stringify(details, null, 2));
  }
}

export function logError(message: string, error: unknown, details?: Record<string, unknown>): void {
  const logger = getLogger();
  const timestamp = new Date().toISOString();

  logger.appendLine(`[${timestamp}] ERROR ${message}`);

  if (details) {
    logger.appendLine(JSON.stringify(details, null, 2));
  }

  if (error instanceof Error) {
    logger.appendLine(`${error.name}: ${error.message}`);
    return;
  }

  logger.appendLine(String(error));
}
