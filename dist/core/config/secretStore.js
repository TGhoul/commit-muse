"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApiKey = getApiKey;
exports.storeApiKey = storeApiKey;
function secretKey(provider) {
    return `commitMuse.${provider}.apiKey`;
}
async function getApiKey(context, provider) {
    return context.secrets.get(secretKey(provider));
}
async function storeApiKey(context, provider, apiKey) {
    await context.secrets.store(secretKey(provider), apiKey);
}
