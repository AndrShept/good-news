import IORedis from 'ioredis';

export const redis = new IORedis(process.env['REDIS_CLOUD_DATABASE_URL']!, {
    maxRetriesPerRequest: null
});
