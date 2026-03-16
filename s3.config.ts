import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

export const createS3Client = (configService: ConfigService) => {
  return new S3({
    endpoint: 'https://storage.yandexcloud.net',
    credentials: {
      accessKeyId: configService.get<string>('YC_ACCESS_KEY')!,
      secretAccessKey: configService.get<string>('YC_SECRET_KEY')!,
    },
    s3ForcePathStyle: true,
    signatureVersion: 'v4',
  });
};
