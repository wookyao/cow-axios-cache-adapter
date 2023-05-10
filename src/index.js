import Cache from "./cache.js";
import { genCacheKey } from "./utils.js";

function cacheAdapter(
  adapter,
  options = { max: 20, cacheTime: 1000 * 60 * 60 }
) {
  const {
    max, // 最大缓存数量
    cacheTime, // 毫秒
  } = options;

  let maxCacheCount = max;
  if (!isNaN(max) || max <= 0) {
    maxCacheCount = 20;
  }

  const cache = new Cache({ max: maxCacheCount });
  let time = 1000 * 60 * 60; // 默认存储1小时

  if (!isNaN(cacheTime) && cacheTime > 0) {
    time = cacheTime * 1;
  }

  return async (config) => {
    // 删除自身适配器，否则会死循环
    delete config.adapter;

    const { method, force, cacheExpire } = config;

    const key = genCacheKey(config);

    if (["GET"].includes(String(method).toUpperCase()) && key) {
      let response = cache.get(key);

      if (!response || force) {
        response = await adapter(config);

        const now = new Date().getTime();

        let expireTime = now + time;

        if (!isNaN(cacheExpire) && cacheExpire > 0) {
          expireTime = now + parseInt(cacheExpire, 10);
        }

        cache.set(key, {
          response,
          __expire_time__: expireTime,
        });
      }

      return response;
    }

    return adapter(config);
  };
}

export default cacheAdapter;
