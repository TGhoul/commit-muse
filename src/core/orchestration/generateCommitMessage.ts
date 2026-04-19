import * as vscode from 'vscode';
import { generateAndWriteCommitMessage } from '../providers/textGenerationService';

export async function generateCommitMessage(
  context: vscode.ExtensionContext,
  hint?: string,
): Promise<void> {
  try {
    const result = await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: 'Commit Muse',
        cancellable: false,
      },
      async () => generateAndWriteCommitMessage(context, hint),
    );

    if (result.truncated) {
      void vscode.window.showWarningMessage('Commit message generated from a truncated diff.');
      return;
    }

    void vscode.window.showInformationMessage('Commit message generated.');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    void vscode.window.showErrorMessage(`Commit Muse: ${message}`);
  }
}
