"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPrompt = buildPrompt;
function buildPrompt(input) {
    const hintBlock = input.hint?.trim()
        ? `Use this hint to improve the commit message: ${input.hint.trim()}`
        : '';
    return input.template
        .replace('{locale}', input.locale)
        .replace('{diff}', input.diff)
        .replace('{Use this hint to improve the commit message: $hint}', hintBlock)
        .trim();
}
