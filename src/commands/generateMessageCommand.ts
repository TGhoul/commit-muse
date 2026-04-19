import * as vscode from 'vscode';
import { generateCommitMessage } from '../core/orchestration/generateCommitMessage';

export function registerGenerateMessageCommand(context: vscode.ExtensionContext): vscode.Disposable {
  return vscode.commands.registerCommand('commitMuse.generateMessage', async () => {
    await generateCommitMessage(context);
  });
}
