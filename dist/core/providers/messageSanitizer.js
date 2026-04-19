"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeCommitMessage = sanitizeCommitMessage;
function sanitizeCommitMessage(text) {
    return text
        .replace(/```[\s\S]*?```/g, '')
        .replace(/^['\"]+|['\"]+$/g, '')
        .replace(/^(here is (your|a) commit message:?\s*)/i, '')
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .join(' ')
        .trim();
}
