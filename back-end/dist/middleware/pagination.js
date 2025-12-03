"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPaginationLinks = buildPaginationLinks;
exports.getPagination = getPagination;
exports.normalizeTags = normalizeTags;
function buildPaginationLinks(req, page, limit, total) {
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
function getPagination(req) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const skip = (page - 1) * limit;
    return { page, limit, skip };
}
function normalizeTags(tags) {
    if (!tags)
        return [];
    if (typeof tags === "string")
        return JSON.parse(tags);
    return tags;
}
