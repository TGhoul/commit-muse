import { GitRepository } from '../diff/diffService';

export async function writeCommitMessage(repository: GitRepository, message: string): Promise<void> {
  repository.inputBox.value = message;
}
