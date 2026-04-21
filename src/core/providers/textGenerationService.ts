import * as vscode from 'vscode';
import { getConfig } from '../config/configurationService';
import { buildPrompt } from '../prompt/promptTemplateService';
import { getStagedDiff } from '../diff/diffService';
import { generateTextWithActiveProvider } from './providerFactory';
import { sanitizeCommitMessage } from './messageSanitizer';
import { writeCommitMessage } from '../vscode/scmInputWriter';
import { logDebug, logError } from '../vscode/logger';

export async function verifyProvider(context: vscode.ExtensionContext): Promise<void> {
  logDebug('Verifying provider');
  await generateTextWithActiveProvider(context, 'Reply with exactly: ok');
  void vscode.window.showInformationMessage('Commit Muse provider is configured correctly.');
}

export async function generateAndWriteCommitMessage(
  context: vscode.ExtensionContext,
  hint?: string,
): Promise<{ truncated: boolean }> {
  const config = getConfig();
  const diffResult = await getStagedDiff(config.maxDiffChars);

  logDebug('Preparing commit generation', {
    provider: config.provider,
    model: config.model,
    locale: config.locale,
    promptPreset: config.promptPreset,
    diffLength: diffResult.diff.length,
    diffTruncated: diffResult.truncated,
    hasHint: Boolean(hint?.trim()),
  });

  if (!diffResult.diff.trim()) {
    throw new Error('No staged changes found. Stage changes before generating a commit message.');
  }

  const prompt = buildPrompt({
    template: config.promptTemplate,
    diff: diffResult.diff,
    locale: config.localeLabel,
    hint,
  });

  logDebug('Prompt built', {
    promptLength: prompt.length,
    templateLength: config.promptTemplate.length,
  });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.timeoutMs);

  try {
    const rawText = await generateTextWithActiveProvider(context, prompt, controller.signal);
    logDebug('Raw model response received', {
      rawTextLength: rawText.length,
    });

    const message = sanitizeCommitMessage(rawText);
    logDebug('Sanitized commit message', {
      sanitizedLength: message.length,
    });

    if (!message) {
      logDebug('Sanitized message is empty', {
        rawTextLength: rawText.length,
      });
      throw new Error('The model returned an empty commit message.');
    }

    await writeCommitMessage(diffResult.repository, message);
    logDebug('Commit message written to SCM input box');
    return { truncated: diffResult.truncated };
  } catch (error) {
    logError('Commit generation failed', error);
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
