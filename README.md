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
    cacheExpire: 1000 * 60 * 60, // 毫秒
  });
};
```
