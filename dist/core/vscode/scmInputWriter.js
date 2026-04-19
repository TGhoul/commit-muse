"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeCommitMessage = writeCommitMessage;
async function writeCommitMessage(repository, message) {
    repository.inputBox.value = message;
}
