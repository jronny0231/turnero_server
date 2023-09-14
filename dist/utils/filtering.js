"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encryptPassword = exports.stringToUUID = exports.ObjectDifferences = exports.ObjectFiltering = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
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
const stringToUUID = (string) => {
    const strings = string.split('-');
    if (strings.length === 5) {
        return `${strings[0]}-${strings[1]}-${strings[2]}-${strings[3]}-${strings[4]}`;
    }
    return null;
};
exports.stringToUUID = stringToUUID;
const PASSWORD_SALT = Number(process.env.PASSWORD_SALT) || 10;
const DEFAULT_PASSWORD = process.env.DEFAULT_PASSWORD || "1234abcd";
const encryptPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const passwordValue = password !== null && password !== void 0 ? password : DEFAULT_PASSWORD;
    let hashedPassword = passwordValue;
    return bcrypt_1.default
        .genSalt(PASSWORD_SALT)
        .then((salt) => __awaiter(void 0, void 0, void 0, function* () {
        return bcrypt_1.default.hash(passwordValue, salt);
    }))
        .then(hashed => hashed)
        .catch(err => {
        console.error(err.message);
        return hashedPassword;
    });
});
exports.encryptPassword = encryptPassword;
