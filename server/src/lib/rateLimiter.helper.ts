import { redisClient as redis } from "./redisClient";
import fs from 'fs';
import path from 'path';

// load the script from ../scripts/tokenBucket.lua
const TOKEN_BUCKET_LUA = fs.readFileSync(path.join(__dirname, '../scripts/tokenBucket.lua'), 'utf-8');

interface BucketConfig {
  key: string;
  capacity: number;
  refillTokens: number;
  interval: number;
  requested?: number;
  name: string;
}

export const checkMultipleBucketsWithRemaining = async (buckets: BucketConfig[]) => {
  const now = Date.now();
  const keys: string[] = [];
  const args: (string|number)[] = [];

  for (const bucket of buckets) {
    keys.push(bucket.key);
    args.push(bucket.capacity, bucket.refillTokens, bucket.interval, bucket.requested ?? 1, now, bucket.name);
  }

  const result = await redis.eval(TOKEN_BUCKET_LUA, keys.length, ...keys, ...args);
  const remaining: Record<string, number> = JSON.parse(result as string);

  const allowed = Object.values(remaining).every(v => v >= 0);

  return { allowed, remaining };
};