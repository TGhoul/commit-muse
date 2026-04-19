import * as vscode from 'vscode';

export function registerOpenSettingsCommand(): vscode.Disposable {
  return vscode.commands.registerCommand('commitMuse.openSettings', async () => {
    await vscode.commands.executeCommand('workbench.action.openSettings', '@ext:tghoul.commit-muse');
  });
}
