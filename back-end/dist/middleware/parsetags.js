"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTags = parseTags;
function parseTags(raw) {
    if (!raw)
        return undefined;
    if (Array.isArray(raw))
        return raw;
    if (typeof raw === "string") {
        try {
            return JSON.parse(raw); // "[\"POLITICA\"]" → ["POLITICA"]
        }
        catch (_a) {
            // Caso venha como "POLITICA,ECONOMIA"
            return raw.split(",").map(t => t.trim().toUpperCase());
        }
    }
    return undefined;
}
