"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = require("aws-sdk");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const s3 = new aws_sdk_1.S3({
    endpoint: 'https://storage.yandexcloud.net',
    region: process.env.YC_REGION,
    credentials: {
        accessKeyId: process.env.YC_ACCESS_KEY,
        secretAccessKey: process.env.YC_SECRET_KEY,
    },
});
const BUCKET = process.env.YC_BUCKET;
async function checkBucketAccess() {
    try {
        const data = await s3.listObjectsV2({ Bucket: BUCKET }).promise();
        console.log(`Доступ есть! Количество объектов в бакете: ${data.KeyCount}`);
    }
    catch (err) {
        console.error('Нет доступа к бакету или ошибка:', err);
    }
}
checkBucketAccess();
//# sourceMappingURL=check-access.js.map