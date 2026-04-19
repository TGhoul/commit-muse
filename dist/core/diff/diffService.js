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
exports.getStagedDiff = getStagedDiff;
const vscode = __importStar(require("vscode"));
const node_child_process_1 = require("node:child_process");
const node_util_1 = require("node:util");
const execFileAsync = (0, node_util_1.promisify)(node_child_process_1.execFile);
async function getStagedDiff(maxChars) {
    const repository = await getRepository();
    const { stdout } = await execFileAsync('git', ['diff', '--cached', '--no-ext-diff', '--unified=3'], {
        cwd: repository.rootUri.fsPath,
        maxBuffer: 1024 * 1024 * 10,
    });
    const diff = stdout.trim();
    const truncated = diff.length > maxChars;
    return {
        diff: truncated ? diff.slice(0, maxChars) : diff,
        truncated,
        repository,
    };
}
async function getRepository() {
    const extension = vscode.extensions.getExtension('vscode.git');
    if (!extension) {
        throw new Error('VS Code Git extension is not available.');
    }
    const gitExtension = extension.isActive ? extension.exports : await extension.activate();
    const api = gitExtension.getAPI(1);
    if (!api.repositories.length) {
        throw new Error('No Git repository found in the current workspace.');
    }
    if (api.repositories.length === 1) {
        return api.repositories[0];
    }
    const pick = await vscode.window.showQuickPick(api.repositories.map((repository) => ({
        label: vscode.workspace.asRelativePath(repository.rootUri, false),
        repository,
    })), {
        placeHolder: 'Select a Git repository for commit message generation',
        ignoreFocusOut: true,
    });
    if (!pick) {
        throw new Error('Repository selection was cancelled.');
    }
    return pick.repository;
}
