import * as vscode from 'vscode';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

export interface GitRepository {
  rootUri: vscode.Uri;
  inputBox: { value: string };
}

export interface DiffResult {
  diff: string;
  truncated: boolean;
  repository: GitRepository;
}

interface GitExtensionApi {
  getAPI(version: number): {
    repositories: GitRepository[];
  };
}

export async function getStagedDiff(maxChars: number): Promise<DiffResult> {
  const repository = await getRepository();
  const { stdout } = await execFileAsync('git', ['diff', '--cached', '--no-ext-diff', '--unified=3'], {
    cwd: repository.rootUri.fsPath,
    maxBuffer: 1024 * 1024 * 10,
  });

  const diff = stdout.trim();
  const truncated = diff.length > maxChars;

  return {
    diff: truncated ? diff.slice(0, maxChars) : diff,
    truncated,
    repository,
  };
}

async function getRepository(): Promise<GitRepository> {
  const extension = vscode.extensions.getExtension<GitExtensionApi>('vscode.git');
  if (!extension) {
    throw new Error('VS Code Git extension is not available.');
  }

  const gitExtension = extension.isActive ? extension.exports : await extension.activate();
  const api = gitExtension.getAPI(1);

  if (!api.repositories.length) {
    throw new Error('No Git repository found in the current workspace.');
  }

  if (api.repositories.length === 1) {
    return api.repositories[0];
  }

  const pick = await vscode.window.showQuickPick(
    api.repositories.map((repository) => ({
      label: vscode.workspace.asRelativePath(repository.rootUri, false),
      repository,
    })),
    {
      placeHolder: 'Select a Git repository for commit message generation',
      ignoreFocusOut: true,
    },
  );

  if (!pick) {
    throw new Error('Repository selection was cancelled.');
  }

  return pick.repository;
}
