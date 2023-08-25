"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismaTodayFilter = void 0;
const prismaTodayFilter = () => {
    const now = new Date(Date.now()); // Otiene la fecha actual
    const first = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).toISOString();
    const last = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).toISOString();
    return {
        gte: first,
        lte: last,
    };
};
exports.prismaTodayFilter = prismaTodayFilter;
