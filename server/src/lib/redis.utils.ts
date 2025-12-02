// utils/cache.ts
import { redisClient } from "./redisClient";

interface CacheOptions {
  expireInSeconds?: number;
  keepAlive?: boolean; // auto-refresh TTL on read
}

export const cacheSet = async <T>(
  key: string,
  value: T,
  expireInSeconds = 3600
): Promise<void> => {
  try {
    await redisClient.set(key, JSON.stringify(value), "EX", expireInSeconds);
  } catch (err) {
    console.error(`[cacheSet] Failed to set cache for key: ${key}`, err);
  }
};

export const cacheGet = async <T = any>(
  key: string,
  options: CacheOptions = {}
): Promise<T | null> => {
  try {
    const data = await redisClient.get(key);
    if (!data) return null;

    if (options.keepAlive && options.expireInSeconds)
      await redisClient.expire(key, options.expireInSeconds);

    return JSON.parse(data) as T;
  } catch (err) {
    console.error(`[cacheGet] Failed to read cache for key: ${key}`, err);
    return null;
  }
};

export const cacheDel = async (key: string): Promise<void> => {
  try {
    await redisClient.del(key);
  } catch (err) {
    console.error(`[cacheDel] Failed to delete cache for key: ${key}`, err);
  }
};

/**
 * Safely updates an existing cache entry.
 * Performs atomic overwrite if key exists.
 */
export const updateCache = async <T>(
  key: string,
  value: T,
  expireInSeconds = 3600
): Promise<void> => {
  try {
    const exists = await redisClient.exists(key);
    if (!exists) return await cacheSet(key, value, expireInSeconds);
    await redisClient.set(key, JSON.stringify(value), "EX", expireInSeconds);
  } catch (err) {
    console.error(`[updateCache] Failed to update cache for key: ${key}`, err);
  }
};

/**
 * Fetch data with cache-first strategy.
 * @param key Cache key
 * @param fetchFn Function to fetch fresh data if not cached
 * @param expireInSeconds TTL in seconds
 * @param setHeader Optional function to set header (for frameworks like Next.js or Express)
 */

export const cacheFetch = async <T>(
  key: string,
  fetchFn: () => Promise<T>,
  expireInSeconds = 3600,
  setHeader?: (name: string, value: string) => void
): Promise<T> => {
  const cached = await cacheGet<T>(key);

  if (cached) {
    if (setHeader) setHeader("X-Cache-Status", "HIT");
    return cached;
  }

  const fresh = await fetchFn();
  await cacheSet(key, fresh, expireInSeconds);
  if (setHeader) setHeader("X-Cache-Status", "MISS");

  return fresh;
};

export const getUserProjectVersion = async (owner: string): Promise<string> => {
  const key = `projects:version:${owner}`;
  const version = await redisClient.get(key);
  return version || "1"; // default version
};

export const bumpUserProjectVersion = async (owner: string) => {
  const key = `projects:version:${owner}`;
  await redisClient.incr(key);
};