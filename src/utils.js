const toUpper = (str) => String(str).toUpperCase();

const transferObj2ListStringify = (obj, split = "=") => {
  const list = [];

  try {
    for (const [k, v] of obj) {
      list.push(`${k}${split}${v}`);
    }
  } catch (error) {
    for (const k in obj) {
      list.push(`${k}${split}${obj[k]}`);
    }
  }

  return list;
};

// 根据请求参数生成缓存的key
export const genCacheKey = (config) => {
  const { url, method, params = {} } = config;

  if (!url) return "";

  const [uri, query = ""] = url.split("?");

  // 将 object 对象转为 数组
  let queryList = transferObj2ListStringify(params);

  // 解析 url 携带的参数
  if (query) {
    const urlParsed = new URLSearchParams(query);
    queryList = [...queryList, ...transferObj2ListStringify(urlParsed)];
  }

  let key = `${toUpper(method)}::${uri}`;
  if (queryList.length) {
    key += `?${queryList.join("&")}`;
  }

  return key;
};
