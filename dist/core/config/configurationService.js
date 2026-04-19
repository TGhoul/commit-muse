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
exports.SUPPORTED_LOCALES = exports.LOCALE_LABELS = void 0;
exports.getConfig = getConfig;
exports.syncPromptTemplateWithPreset = syncPromptTemplateWithPreset;
const vscode = __importStar(require("vscode"));
const defaultPrompts_1 = require("../prompt/defaultPrompts");
exports.LOCALE_LABELS = {
    'en': 'English',
    'zh-CN': 'Simplified Chinese',
    'zh-TW': 'Traditional Chinese',
    'ja': 'Japanese',
    'ko': 'Korean',
    'es': 'Spanish',
    'fr': 'French',
    'de': 'German',
    'pt-BR': 'Portuguese (Brazil)',
    'it': 'Italian',
    'ru': 'Russian',
    'ar': 'Arabic',
    'hi': 'Hindi',
    'nl': 'Dutch',
    'tr': 'Turkish',
    'pl': 'Polish',
    'uk': 'Ukrainian',
    'vi': 'Vietnamese',
    'id': 'Indonesian',
};
exports.SUPPORTED_LOCALES = Object.keys(exports.LOCALE_LABELS);
function getConfig() {
    const config = vscode.workspace.getConfiguration('commitMuse');
    const locale = config.get('locale', 'en');
    const normalizedLocale = isSupportedLocale(locale) ? locale : 'en';
    const promptPreset = config.get('promptPreset', 'basic');
    const customPromptTemplate = config.get('promptTemplate', '');
    return {
        provider: config.get('provider', 'anthropic'),
        model: config.get('model', 'claude-3-5-sonnet-latest'),
        baseUrl: config.get('baseUrl') || undefined,
        locale: normalizedLocale,
        localeLabel: exports.LOCALE_LABELS[normalizedLocale],
        timeoutMs: config.get('timeoutMs', 30000),
        maxDiffChars: config.get('maxDiffChars', 12000),
        promptPreset,
        promptTemplate: promptPreset === 'custom' ? customPromptTemplate : (0, defaultPrompts_1.getPromptTemplate)(promptPreset),
    };
}
async function syncPromptTemplateWithPreset(event) {
    if (event && !event.affectsConfiguration('commitMuse.promptPreset')) {
        return;
    }
    const config = vscode.workspace.getConfiguration('commitMuse');
    const promptPreset = config.get('promptPreset', 'basic');
    if (promptPreset === 'custom') {
        return;
    }
    const expectedTemplate = (0, defaultPrompts_1.getPromptTemplate)(promptPreset);
    const currentTemplate = config.get('promptTemplate', '');
    if (currentTemplate === expectedTemplate) {
        return;
    }
    await config.update('promptTemplate', expectedTemplate, vscode.ConfigurationTarget.Global);
}
function isSupportedLocale(locale) {
    return locale in exports.LOCALE_LABELS;
}
