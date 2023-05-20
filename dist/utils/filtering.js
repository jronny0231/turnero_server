"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectDifferences = exports.ObjectFiltering = void 0;
exports.ObjectFiltering = ((data, filters) => {
    return Object.keys(data)
        .filter(key => filters.includes(key))
        .reduce((obj, key) => {
        obj[key] = data[key];
        return obj;
    }, {});
});
exports.ObjectDifferences = ((data, comparative) => {
    const keys = Object.keys(data);
    const diff1 = [...keys].filter(key => !comparative.includes(key));
    const diff2 = [...comparative].filter(key => !keys.includes(key));
    return [...diff1, ...diff2];
});
