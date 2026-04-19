"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateWithOpenAiCompatible = generateWithOpenAiCompatible;
const ai_1 = require("ai");
const openai_1 = require("@ai-sdk/openai");
const logger_1 = require("../vscode/logger");
async function generateWithOpenAiCompatible(options) {
    const openai = (0, openai_1.createOpenAI)({
        apiKey: options.apiKey,
        baseURL: options.baseUrl || undefined,
    });
    try {
        const result = await (0, ai_1.generateText)({
            model: openai(options.model),
            prompt: options.prompt,
            abortSignal: options.abortSignal,
        });
        (0, logger_1.logDebug)('OpenAI-compatible response received', {
            textLength: result.text.length,
            finishReason: result.finishReason,
            usage: result.usage,
        });
        return result.text;
    }
    catch (error) {
        (0, logger_1.logError)('OpenAI-compatible request failed', error);
        throw error;
    }
}
