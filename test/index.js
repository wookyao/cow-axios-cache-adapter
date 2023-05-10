import cowAxiosCache from "../src/index.js";

const http = axios.create({
  baseURL: "https://registry.yarnpkg.com/",
  timeout: 5000,
  adapter: cowAxiosCache(axios, {
    max: 3,
  }),
});

let count = 0;
function request() {
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
