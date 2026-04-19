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
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const generateMessageCommand_1 = require("./commands/generateMessageCommand");
const generateMessageWithHintCommand_1 = require("./commands/generateMessageWithHintCommand");
const verifyProviderCommand_1 = require("./commands/verifyProviderCommand");
const openSettingsCommand_1 = require("./commands/openSettingsCommand");
const configurationService_1 = require("./core/config/configurationService");
const logger_1 = require("./core/vscode/logger");
function activate(context) {
    const logger = (0, logger_1.getLogger)();
    (0, logger_1.logDebug)('Extension activated');
    void (0, configurationService_1.syncPromptTemplateWithPreset)();
    context.subscriptions.push(logger, (0, generateMessageCommand_1.registerGenerateMessageCommand)(context), (0, generateMessageWithHintCommand_1.registerGenerateMessageWithHintCommand)(context), (0, verifyProviderCommand_1.registerVerifyProviderCommand)(context), (0, openSettingsCommand_1.registerOpenSettingsCommand)(), vscode.workspace.onDidChangeConfiguration((event) => {
        void (0, configurationService_1.syncPromptTemplateWithPreset)(event);
    }));
}
function deactivate() { }
