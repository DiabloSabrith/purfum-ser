"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createS3Client = void 0;
const aws_sdk_1 = require("aws-sdk");
const createS3Client = (configService) => {
    return new aws_sdk_1.S3({
        endpoint: 'https://storage.yandexcloud.net',
        credentials: {
            accessKeyId: configService.get('YC_ACCESS_KEY'),
            secretAccessKey: configService.get('YC_SECRET_KEY'),
        },
        s3ForcePathStyle: true,
        signatureVersion: 'v4',
    });
};
exports.createS3Client = createS3Client;
//# sourceMappingURL=s3.config.js.map