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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadTempFile = exports.getFile = exports.getFileList = exports.uploadFile = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const fs_1 = __importDefault(require("fs"));
const AWS_BUCKET_NAME = (_a = process.env.AWS_BUCKET_NAME) !== null && _a !== void 0 ? _a : "";
const AWS_BUCKET_REGION = (_b = process.env.AWS_BUCKET_REGION) !== null && _b !== void 0 ? _b : "";
const AWS_PUBLIC_KEY = (_c = process.env.AWS_PUBLIC_KEY) !== null && _c !== void 0 ? _c : "";
const AWS_SECRET_KEY = (_d = process.env.AWS_SECRET_KEY) !== null && _d !== void 0 ? _d : "";
const client = new client_s3_1.S3Client({
    region: AWS_BUCKET_REGION,
    credentials: {
        accessKeyId: AWS_PUBLIC_KEY,
        secretAccessKey: AWS_SECRET_KEY
    }
});
const uploadFile = ({ tempFilePath, newName }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fileStream = fs_1.default.createReadStream(tempFilePath);
        const uploadParams = {
            Bucket: AWS_BUCKET_NAME,
            Key: newName,
            Body: fileStream
        };
        const command = new client_s3_1.PutObjectCommand(uploadParams);
        return yield client.send(command);
    }
    catch (error) {
        console.error({ error });
        return error;
    }
});
exports.uploadFile = uploadFile;
const getFileList = () => __awaiter(void 0, void 0, void 0, function* () {
    const command = new client_s3_1.ListObjectsCommand({
        Bucket: AWS_BUCKET_NAME
    });
    console.log({ AWS_BUCKET_NAME });
    const result = yield client.send(command);
    return result.Contents;
});
exports.getFileList = getFileList;
const getFile = (fileKey) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const command = new client_s3_1.GetObjectCommand({
            Bucket: AWS_BUCKET_NAME,
            Key: fileKey
        });
        const result = yield client.send(command);
        return {
            metadata: result.Metadata,
            body: result.Body
        };
    }
    catch (error) {
        console.error({ error });
        return error;
    }
});
exports.getFile = getFile;
const downloadTempFile = ({ fileKey, live }) => {
    console.log({ fileKey, live });
    return true;
};
exports.downloadTempFile = downloadTempFile;
