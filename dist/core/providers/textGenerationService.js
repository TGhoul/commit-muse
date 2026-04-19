"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyProvider = verifyProvider;
exports.generateAndWriteCommitMessage = generateAndWriteCommitMessage;
const vscode = __importStar(require("vscode"));
const configurationService_1 = require("../config/configurationService");
const promptTemplateService_1 = require("../prompt/promptTemplateService");
const diffService_1 = require("../diff/diffService");
const providerFactory_1 = require("./providerFactory");
const messageSanitizer_1 = require("./messageSanitizer");
const scmInputWriter_1 = require("../vscode/scmInputWriter");
const logger_1 = require("../vscode/logger");
async function verifyProvider(context) {
    (0, logger_1.logDebug)('Verifying provider');
    await (0, providerFactory_1.generateTextWithActiveProvider)(context, 'Reply with exactly: ok');
    void vscode.window.showInformationMessage('Commit Muse provider is configured correctly.');
}
async function generateAndWriteCommitMessage(context, hint) {
    const config = (0, configurationService_1.getConfig)();
    const diffResult = await (0, diffService_1.getStagedDiff)(config.maxDiffChars);
    (0, logger_1.logDebug)('Preparing commit generation', {
        provider: config.provider,
        model: config.model,
        locale: config.locale,
        promptPreset: config.promptPreset,
        diffLength: diffResult.diff.length,
        diffTruncated: diffResult.truncated,
        repository: diffResult.repository.rootUri.fsPath,
        hasHint: Boolean(hint?.trim()),
    });
    if (!diffResult.diff.trim()) {
        throw new Error('No staged changes found. Stage changes before generating a commit message.');
    }
    const prompt = (0, promptTemplateService_1.buildPrompt)({
        template: config.promptTemplate,
        diff: diffResult.diff,
        locale: config.localeLabel,
        hint,
    });
    (0, logger_1.logDebug)('Prompt built', {
        promptLength: prompt.length,
        templateLength: config.promptTemplate.length,
    });
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.timeoutMs);
    try {
        const rawText = await (0, providerFactory_1.generateTextWithActiveProvider)(context, prompt, controller.signal);
        (0, logger_1.logDebug)('Raw model response received', {
            rawTextLength: rawText.length,
            rawTextPreview: rawText.slice(0, 300),
        });
        const message = (0, messageSanitizer_1.sanitizeCommitMessage)(rawText);
        (0, logger_1.logDebug)('Sanitized commit message', {
            sanitizedLength: message.length,
            sanitizedPreview: message.slice(0, 300),
        });
        if (!message) {
            (0, logger_1.logDebug)('Sanitized message is empty', {
                rawTextLength: rawText.length,
                rawTextPreview: rawText.slice(0, 300),
            });
            throw new Error('The model returned an empty commit message.');
        }
        await (0, scmInputWriter_1.writeCommitMessage)(diffResult.repository, message);
        (0, logger_1.logDebug)('Commit message written to SCM input box');
        return { truncated: diffResult.truncated };
    }
    catch (error) {
        (0, logger_1.logError)('Commit generation failed', error);
        throw error;
    }
    finally {
        clearTimeout(timeout);
    }
}
