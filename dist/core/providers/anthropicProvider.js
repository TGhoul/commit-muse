"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateWithAnthropic = generateWithAnthropic;
const ai_1 = require("ai");
const anthropic_1 = require("@ai-sdk/anthropic");
const logger_1 = require("../vscode/logger");
async function generateWithAnthropic(options) {
    const anthropic = (0, anthropic_1.createAnthropic)({
        apiKey: options.apiKey,
        baseURL: options.baseUrl,
    });
    const result = await (0, ai_1.generateText)({
        model: anthropic(options.model),
        prompt: options.prompt,
        abortSignal: options.abortSignal,
    });
    (0, logger_1.logDebug)('Anthropic response received', {
        textLength: result.text.length,
        finishReason: result.finishReason,
        usage: result.usage,
    });
    return result.text;
}
