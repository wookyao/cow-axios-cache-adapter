class Cache {
  constructor(options = { max: 20 }) {
    this._max = options.max || 20;
    this._maps = new Map();
    this._keys = [];
  }

  set(key, val) {
    if (this._maps.size >= this._max) {
      // 先进先出
      const removeKey = this._keys.shift();
      this.delete(removeKey);

      // 清理过期数据
      this._clearExpireCache();
    }

    if (!key) return;

    // 设置前 先删除原有的数据 保证 key 在队列中顺序
    this.delete(key);

    // 设置 map
    this._maps.set(key, val || {});
    this._keys.push(key);
  }

  get(key) {
    if (!key) return null;
    const cacheItem = this._maps.get(key);

    if (!cacheItem) return null;

    // 判断当前数据是否过期
    const now = new Date().getTime();
    const { __expire_time__ } = cacheItem;
    if (parseInt(__expire_time__, 10) < now) {
      this.delete(key);
      return null;
    }

    return cacheItem?.response ?? {};
  }

  delete(key) {
    if (!key) return false;

    const flag = this._maps.delete(key);

    // 删除队列中对应的key
    const idx = this._keys.findIndex((k) => k == key);
    if (idx > -1) {
      this._keys.splice(idx, 1);
    }

    return flag;
  }

  clearAll() {
    this._maps.clear();
    this._keys = [];
  }

  // 清理过期的缓存
  _clearExpireCache() {
    const now = new Date().getTime();
    for (const [key, val] of this._maps.entries()) {
      const { __expire_time__ } = val;
      if (parseInt(__expire_time__, 10) < now) {
        this.delete(key);
      }
    }
  }
}

export default Cache;
