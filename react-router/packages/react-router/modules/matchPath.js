//传入路径生成对应的正则表达式：比如传入一个动态匹配路径'/user/:id'，得到一个正则表达式
import pathToRegexp from "path-to-regexp";

//路由缓存对象
const cache = {};
//路由缓存数量上限
const cacheLimit = 10000;
//路由缓存计数器
let cacheCount = 0;

//根据path生成对应的正则表达式
function compilePath(path, options) {
  //根据options得到缓存的键值
  const cacheKey = `${options.end}${options.strict}${options.sensitive}`;
  //在路径缓存中获取键值对应的缓存
  const pathCache = cache[cacheKey] || (cache[cacheKey] = {});
  //如果缓存中存在则取出并返回
  if (pathCache[path]) return pathCache[path];

  //如果不存在则构建path对应的正则表达式并存入路径缓存对象中
  const keys = [];
  //生成path对应的正则表达式,并且在keys中填充部分属性值
  //  如下：
  //   const keys =  []
  //   const regexp = pathToRegexp('/foo/:bar', keys)
  //   console.log(regexp,keys)
  //  输出值为：
  //   /^\/user\/([^\/]+?)(?:\/)?$/i，
  //   [{
  //       delimiter: "/",
  //       name: "id",
  //       optional: false,
  //       pattern: "[^\/]+?",
  //       prefix:"/",
  //       repeat: false
  //   }]
  const regexp = pathToRegexp(path, keys, options);
  //将正则表达式存入result对象
  const result = { regexp, keys };
  //如果缓存未满则存入
  if (cacheCount < cacheLimit) {
    pathCache[path] = result;
    cacheCount++;
  }
  //返回正则表达式与相应的keys
  return result;
}

/**
 * Public API for matching a URL pathname to a path.
 */
function matchPath(pathname, options = {}) {
  if (typeof options === "string") options = { path: options };

  const { path, exact = false, strict = false, sensitive = false } = options;

  //将options参数中的path字符串存入一个新数组，
    // 如果options参数中的path为一个数组，后面的逻辑也只会对第一个进行匹配
  const paths = [].concat(path);

  //确保只会对paths数组中第一个路径进行匹配
  return paths.reduce((matched, path) => {
    if (matched) return matched;
    const { regexp, keys } = compilePath(path, {
      end: exact,
      strict,
      sensitive
    });
    const match = regexp.exec(pathname);

    if (!match) return null;

    const [url, ...values] = match;
    const isExact = pathname === url;

    if (exact && !isExact) return null;

    return {
      path, // the path used to match
      url: path === "/" && url === "" ? "/" : url, // the matched portion of the URL
      isExact, // whether or not we matched exactly
      params: keys.reduce((memo, key, index) => {
        memo[key.name] = values[index];
        return memo;
      }, {})
    };
  }, null);
}

export default matchPath;
