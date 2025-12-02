-- KEYS = list of bucket keys
-- ARGV = for each bucket: capacity, refillTokens, interval, requested, timestamp, bucketName

local numBuckets = #KEYS
local argIndex = 1
local remaining = {}

for i = 1, numBuckets do
  local key = KEYS[i]
  local capacity = tonumber(ARGV[argIndex]); argIndex = argIndex + 1
  local refillTokens = tonumber(ARGV[argIndex]); argIndex = argIndex + 1
  local interval = tonumber(ARGV[argIndex]); argIndex = argIndex + 1
  local requested = tonumber(ARGV[argIndex]); argIndex = argIndex + 1
  local now = tonumber(ARGV[argIndex]); argIndex = argIndex + 1
  local bucketName = ARGV[argIndex]; argIndex = argIndex + 1

  local bucket = redis.call("HMGET", key, "tokens", "last_refill")
  local tokens = tonumber(bucket[1])
  local last_refill = tonumber(bucket[2])

  if tokens == nil then
      tokens = capacity
      last_refill = now
  end

  local elapsed = now - last_refill
  local refill_count = math.floor(elapsed / interval) * refillTokens
  tokens = math.min(tokens + refill_count, capacity)
  last_refill = last_refill + math.floor(elapsed / interval) * interval

  if tokens >= requested then
      tokens = tokens - requested
      redis.call("HMSET", key, "tokens", tokens, "last_refill", last_refill)
      redis.call("PEXPIRE", key, interval * 2)
  else
      redis.call("HMSET", key, "tokens", tokens, "last_refill", last_refill)
      redis.call("PEXPIRE", key, interval * 2)
      remaining[bucketName] = tokens
      return cjson.encode(remaining)
  end

  remaining[bucketName] = tokens
end

return cjson.encode(remaining)
