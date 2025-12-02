export function parseTags(raw: any): string[] | undefined {
    if (!raw) return undefined;

    if (Array.isArray(raw)) return raw;

    if (typeof raw === "string") {
        try {
            return JSON.parse(raw);    // "[\"POLITICA\"]" → ["POLITICA"]
        } catch {
            // Caso venha como "POLITICA,ECONOMIA"
            return raw.split(",").map(t => t.trim().toUpperCase());
        }
    }

    return undefined;
}