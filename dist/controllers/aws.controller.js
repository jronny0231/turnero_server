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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileByKey = exports.getAllFileList = void 0;
const aws_s3_provider_1 = require("../../unused/aws.s3.provider");
const getAllFileList = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, aws_s3_provider_1.getFileList)();
    try {
        if (result === undefined) {
            return res.status(404).json({ success: false, message: 'Error, files not found.' });
        }
        return res.json({ success: true, message: `Files found, total ${result.length}`, data: result });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Error in server trying to get all files in AWS", data: error });
    }
});
exports.getAllFileList = getAllFileList;
const getFileByKey = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const key = req.params.key;
    try {
        const result = yield (0, aws_s3_provider_1.getFile)(key);
        if (result === undefined) {
            return res.status(404).json({ success: false, message: 'Error, file not found.' });
        }
        return res.json({ success: true, message: `File found`, data: result });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Error in server trying to get file by key in AWS", data: error });
    }
});
exports.getFileByKey = getFileByKey;
