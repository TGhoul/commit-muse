import * as vscode from 'vscode';
import { generateCommitMessage } from '../core/orchestration/generateCommitMessage';

export function registerGenerateMessageWithHintCommand(context: vscode.ExtensionContext): vscode.Disposable {
  return vscode.commands.registerCommand('commitMuse.generateMessageWithHint', async () => {
    const hint = await vscode.window.showInputBox({
      prompt: 'Hint for commit message generation',
      placeHolder: 'e.g. focus on bug fix behavior',
      ignoreFocusOut: true,
    });

    if (hint === undefined) {
      return;
    }

    await generateCommitMessage(context, hint);
  });
}
