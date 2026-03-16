import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
export declare const createS3Client: (configService: ConfigService) => S3;
