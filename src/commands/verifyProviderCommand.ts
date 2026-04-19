import * as vscode from 'vscode';
import { verifyProvider } from '../core/providers/textGenerationService';

export function registerVerifyProviderCommand(context: vscode.ExtensionContext): vscode.Disposable {
  return vscode.commands.registerCommand('commitMuse.verifyProvider', async () => {
    await verifyProvider(context);
  });
}
