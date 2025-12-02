export function buildPaginationLinks(req: any, page: number, limit: number, total: number) {
    const totalPages = Math.ceil(total / limit);

    const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}${req.path}`;

    return {
        page,
        limit,
        totalItems: total,
        totalPages,
        nextPage: page < totalPages ? `${baseUrl}?page=${page + 1}&limit=${limit}` : null,
        prevPage: page > 1 ? `${baseUrl}?page=${page - 1}&limit=${limit}` : null,
    };
}

export function getPagination(req: any) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 3;
    const skip = (page - 1) * limit;

    return { page, limit, skip };
}

export function normalizeTags(tags: any) {
    if (!tags) return [];
    if (typeof tags === "string") return JSON.parse(tags);
    return tags;
}