# Axios-Cache-Adapter

Axios adapter that allows to cache response data.

## Installation

```sh
npm install @cow-axios/cache-adapter

Or

yarn add @cow-axios/cache-adapter
```

## 使用

**注意:** 只有 `GET` 请求返回的数据会被缓存.

### 初始化配置

```js
import axios from "axios";
import AxiosCacheAdapter from "@cow-axios/cache-adapter";

const http = axios.create({
  baseURL: "v1/api/",
  adapter: AxiosCacheAdapter(axios, {
    max: 20, // 最大缓存数量
    cacheTime: 1000 * 60 * 60, // 缓存时间
    useCache: false, // 默认不器用缓存
  }),
});
```

### 具体示例

```js
const getOrderTypes = async () => {
  return await http.get("order/types");
};

let count = 0;

timer = setInterval(() => {
  if (count >= 10) {
    clearInterval(timer);
  }
  getOrderTypes();
  count++;
}, 5000);

// 只会在初始的时候请求一次， 后面9次都是从缓存取数据
```

### 强制刷新

```js
/* 在get请求时 传入 force 参数  */

let count = 0;
const getOrderTypes = async () => {
  return await http.get("order/types", {
    cache: true,
    force: count % 6 == 0,
  });
};

timer = setInterval(() => {
  getOrderTypes();
  count++;
}, 5000);
```

### 单个请求 自定义缓存有效时间

```js
const getOrderTypes = async () => {
  return await http.get("order/types", {
    cache: true,
    cacheExpire: 1000 * 60 * 60, // 毫秒
  });
};
```

### `useCache` 设置 `cache` 不设置，以 useCache 为准

**当 `useCache` 和 `cache` 冲突时， 单个接口的配置优先级更高**

```js
const http = axios.create({
  baseURL: "https://registry.yarnpkg.com/",
  timeout: 5000,
  adapter: cowAxiosCache(axios, {
    max: 3,
    useCache: true,
  }),
});

let count = 0;
function request() {
  // 不单独设置 cache 使用 全局配置 useCache
  http
    .get("vue", {
      force: count % 3 == 0,
    })
    .then((res) => {
      console.log(res, count);
      count++;
    });
}

function request2() {
  http
    .get("react", {
      cacheExpire: 1000 * 3,
    })
    .then((res) => {
      console.log(res, count);
      count++;
    });
}

let timer = setInterval(() => {
  if (count >= 10) {
    clearInterval(timer);
  }
  count < 5 && request();

  count >= 5 && request2();
}, 2000);
```

### `useCache` 和 `cache` 都设置， `cache` 优先级更高

**当 `useCache` 和 `cache` 冲突时， 单个接口的配置优先级更高**

useCache: true

```js
const http = axios.create({
  baseURL: "https://registry.yarnpkg.com/",
  timeout: 5000,
  adapter: cowAxiosCache(axios, {
    max: 3,
    useCache: true,
  }),
});

let count = 0;
function request() {
  // cache false, 此时不会使用缓存
  http
    .get("vue", {
      force: count % 3 == 0,
      cache: false,
    })
    .then((res) => {
      console.log(res, count);
      count++;
    });
}

function request2() {
  http
    .get("react", {
      cacheExpire: 1000 * 3,
    })
    .then((res) => {
      console.log(res, count);
      count++;
    });
}

let timer = setInterval(() => {
  if (count >= 10) {
    clearInterval(timer);
  }
  count < 5 && request();

  count >= 5 && request2();
}, 2000);
```

useCache: false

```js
const http = axios.create({
  baseURL: "https://registry.yarnpkg.com/",
  timeout: 5000,
  adapter: cowAxiosCache(axios, {
    max: 3,
    useCache: false,
  }),
});

let count = 0;
function request() {
  // cache false, 接口不使用缓存
  http
    .get("vue", {
      force: count % 3 == 0,
      cache: false,
    })
    .then((res) => {
      console.log(res, count);
      count++;
    });
}

function request2() {
  // cache true, 接口使用缓存
  http
    .get("react", {
      cacheExpire: 1000 * 3,
      cache: true,
    })
    .then((res) => {
      console.log(res, count);
      count++;
    });
}

let timer = setInterval(() => {
  if (count >= 10) {
    clearInterval(timer);
  }
  count < 5 && request();

  count >= 5 && request2();
}, 2000);
```
