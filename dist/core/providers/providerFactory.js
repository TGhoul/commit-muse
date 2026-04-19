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
exports.generateTextWithActiveProvider = generateTextWithActiveProvider;
const vscode = __importStar(require("vscode"));
const configurationService_1 = require("../config/configurationService");
const secretStore_1 = require("../config/secretStore");
const anthropicProvider_1 = require("./anthropicProvider");
const openAiCompatibleProvider_1 = require("./openAiCompatibleProvider");
const logger_1 = require("../vscode/logger");
async function generateTextWithActiveProvider(context, prompt, abortSignal) {
    const config = (0, configurationService_1.getConfig)();
    const apiKey = await requireApiKey(context, config.provider);
    (0, logger_1.logDebug)('Starting provider request', {
        provider: config.provider,
        model: config.model,
        baseUrl: config.baseUrl || null,
        promptLength: prompt.length,
        hasApiKey: Boolean(apiKey),
    });
    if (config.provider === 'anthropic') {
        return (0, anthropicProvider_1.generateWithAnthropic)({
            apiKey,
            model: config.model,
            baseUrl: config.baseUrl,
            prompt,
            abortSignal,
        });
    }
    return (0, openAiCompatibleProvider_1.generateWithOpenAiCompatible)({
        apiKey,
        model: config.model,
        baseUrl: config.baseUrl,
        prompt,
        abortSignal,
    });
}
async function requireApiKey(context, provider) {
    const existing = await (0, secretStore_1.getApiKey)(context, provider);
    if (existing) {
        return existing;
    }
    const entered = await vscode.window.showInputBox({
        prompt: `Enter API key for ${provider}`,
        password: true,
        ignoreFocusOut: true,
    });
    if (!entered) {
        throw new Error(`Missing API key for ${provider}.`);
    }
    await (0, secretStore_1.storeApiKey)(context, provider, entered);
    return entered;
}
