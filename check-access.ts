import { S3 } from 'aws-sdk';
import * as dotenv from 'dotenv';
dotenv.config();

const s3 = new S3({
  endpoint: 'https://storage.yandexcloud.net',
  region: process.env.YC_REGION,
  credentials: {
    accessKeyId: process.env.YC_ACCESS_KEY!,
    secretAccessKey: process.env.YC_SECRET_KEY!,
  },
});

const BUCKET = process.env.YC_BUCKET!;

async function checkBucketAccess() {
  try {
    // Проверяем, можем ли получить список объектов в бакете
    const data = await s3.listObjectsV2({ Bucket: BUCKET }).promise();
    console.log(`Доступ есть! Количество объектов в бакете: ${data.KeyCount}`);
  } catch (err) {
    console.error('Нет доступа к бакету или ошибка:', err);
  }
}

checkBucketAccess();
