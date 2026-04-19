"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_PROMPTS = void 0;
exports.getPromptTemplate = getPromptTemplate;
exports.DEFAULT_PROMPTS = {
    basic: {
        label: 'Basic',
        template: 'Write an insightful but concise Git commit message in a complete sentence in present tense for the following diff without prefacing it with anything, the response must be in the language {locale} and must NOT be longer than 74 characters. The sent text will be the differences between files, where deleted lines are prefixed with a single minus sign and added lines are prefixed with a single plus sign.\n{Use this hint to improve the commit message: $hint}\n{diff}',
    },
    conventional: {
        label: 'Conventional',
        template: "Write a commit message in the conventional commit convention. I'll send you an output of 'git diff --staged' command, and you convert it into a commit message. Lines must not be longer than 74 characters. Use {locale} language to answer.\n{Use this hint to improve the commit message: $hint}\n{diff}",
    },
    gitmoji: {
        label: 'GitMoji',
        template: "Write a concise commit message from 'git diff --staged' output in the format `[EMOJI] [TYPE](file/topic): [description in {locale}]`. Use GitMoji emojis (e.g., ✨ → feat), present tense, active voice, max 120 characters per line, no code blocks.\n{Use this hint to improve the commit message: $hint}\n---\n{diff}",
    },
};
function getPromptTemplate(preset, customTemplate) {
    if (preset === 'basic' || preset === 'conventional' || preset === 'gitmoji') {
        return exports.DEFAULT_PROMPTS[preset].template;
    }
    return customTemplate?.trim() || exports.DEFAULT_PROMPTS.basic.template;
}
