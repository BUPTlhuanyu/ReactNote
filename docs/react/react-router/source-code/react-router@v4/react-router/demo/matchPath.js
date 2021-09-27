/**
 * @Description: matchPath的用法
 * @author: liaohuanyu
 * @date 2019/2/14
*/

var DEFAULT_DELIMITER = '/'

/**
 * The main path matching regexp utility.
 *
 * @type {RegExp}
 */
var PATH_REGEXP = new RegExp([
    // Match escaped characters that would otherwise appear in future matches.
    // This allows the user to escape special characters that won't transform.
    '(\\\\.)',
    // Match Express-style parameters and un-named parameters with a prefix
    // and optional suffixes. Matches appear as:
    //
    // ":test(\\d+)?" => ["test", "\d+", undefined, "?"]
    // "(\\d+)"  => [undefined, undefined, "\d+", undefined]
    '(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?'
].join('|'), 'g')

/**
 * Parse a string for the raw tokens.
 *
 * @param  {string}  str
 * @param  {Object=} options
 * @return {!Array}
 */
function parse (str, options) {
    var tokens = []
    var key = 0
    var index = 0
    var path = ''
    var defaultDelimiter = (options && options.delimiter) || DEFAULT_DELIMITER
    var whitelist = (options && options.whitelist) || undefined
    var pathEscaped = false
    var res

    while ((res = PATH_REGEXP.exec(str)) !== null) {
        var m = res[0]
        var escaped = res[1]
        var offset = res.index
        path += str.slice(index, offset)
        index = offset + m.length

        // Ignore already escaped sequences.
        if (escaped) {
            path += escaped[1]
            pathEscaped = true
            continue
        }

        var prev = ''
        var name = res[2]
        var capture = res[3]
        var group = res[4]
        var modifier = res[5]

        if (!pathEscaped && path.length) {
            var k = path.length - 1
            var c = path[k]
            var matches = whitelist ? whitelist.indexOf(c) > -1 : true

            if (matches) {
                prev = c
                path = path.slice(0, k)
            }
        }

        // Push the current path onto the tokens.
        if (path) {
            tokens.push(path)
            path = ''
            pathEscaped = false
        }

        var repeat = modifier === '+' || modifier === '*'
        var optional = modifier === '?' || modifier === '*'
        var pattern = capture || group
        var delimiter = prev || defaultDelimiter

        tokens.push({
            name: name || key++,
            prefix: prev,
            delimiter: delimiter,
            optional: optional,
            repeat: repeat,
            pattern: pattern
                ? escapeGroup(pattern)
                : '[^' + escapeString(delimiter === defaultDelimiter ? delimiter : (delimiter + defaultDelimiter)) + ']+?'
        })
    }

    // Push any remaining characters.
    if (path || index < str.length) {
        tokens.push(path + str.substr(index))
    }

    return tokens
}

/**
 * Compile a string to a template function for the path.
 *
 * @param  {string}             str
 * @param  {Object=}            options
 * @return {!function(Object=, Object=)}
 */
function compile (str, options) {
    return tokensToFunction(parse(str, options))
}

/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction (tokens) {
    // Compile all the tokens into regexps.
    var matches = new Array(tokens.length)

    // Compile all the patterns before compilation.
    for (var i = 0; i < tokens.length; i++) {
        if (typeof tokens[i] === 'object') {
            matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$')
        }
    }

    return function (data, options) {
        var path = ''
        var encode = (options && options.encode) || encodeURIComponent

        for (var i = 0; i < tokens.length; i++) {
            var token = tokens[i]

            if (typeof token === 'string') {
                path += token
                continue
            }

            var value = data ? data[token.name] : undefined
            var segment

            if (Array.isArray(value)) {
                if (!token.repeat) {
                    throw new TypeError('Expected "' + token.name + '" to not repeat, but got array')
                }

                if (value.length === 0) {
                    if (token.optional) continue

                    throw new TypeError('Expected "' + token.name + '" to not be empty')
                }

                for (var j = 0; j < value.length; j++) {
                    segment = encode(value[j], token)

                    if (!matches[i].test(segment)) {
                        throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '"')
                    }

                    path += (j === 0 ? token.prefix : token.delimiter) + segment
                }

                continue
            }

            if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
                segment = encode(String(value), token)

                if (!matches[i].test(segment)) {
                    throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but got "' + segment + '"')
                }

                path += token.prefix + segment
                continue
            }

            if (token.optional) continue

            throw new TypeError('Expected "' + token.name + '" to be ' + (token.repeat ? 'an array' : 'a string'))
        }

        return path
    }
}

/**
 * Escape a regular expression string.
 *
 * @param  {string} str
 * @return {string}
 */
function escapeString (str) {
    return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, '\\$1')
}

/**
 * Escape the capturing group by escaping special characters and meaning.
 *
 * @param  {string} group
 * @return {string}
 */
function escapeGroup (group) {
    return group.replace(/([=!:$/()])/g, '\\$1')
}

/**
 * Get the flags for a regexp from the options.
 *
 * @param  {Object} options
 * @return {string}
 */
function flags (options) {
    return options && options.sensitive ? '' : 'i'
}

/**
 * Pull out keys from a regexp.
 *
 * @param  {!RegExp} path
 * @param  {Array=}  keys
 * @return {!RegExp}
 */
function regexpToRegexp (path, keys) {
    if (!keys) return path

    // Use a negative lookahead to match only capturing groups.
    var groups = path.source.match(/\((?!\?)/g)

    if (groups) {
        for (var i = 0; i < groups.length; i++) {
            keys.push({
                name: i,
                prefix: null,
                delimiter: null,
                optional: false,
                repeat: false,
                pattern: null
            })
        }
    }

    return path
}

/**
 * Transform an array into a regexp.
 *
 * @param  {!Array}  path
 * @param  {Array=}  keys
 * @param  {Object=} options
 * @return {!RegExp}
 */
function arrayToRegexp (path, keys, options) {
    var parts = []

    for (var i = 0; i < path.length; i++) {
        parts.push(pathToRegexp(path[i], keys, options).source)
    }

    return new RegExp('(?:' + parts.join('|') + ')', flags(options))
}

/**
 * Create a path regexp from string input.
 *
 * @param  {string}  path
 * @param  {Array=}  keys
 * @param  {Object=} options
 * @return {!RegExp}
 */
function stringToRegexp (path, keys, options) {
    return tokensToRegExp(parse(path, options), keys, options)
}

/**
 * Expose a function for taking tokens and returning a RegExp.
 *
 * @param  {!Array}  tokens
 * @param  {Array=}  keys
 * @param  {Object=} options
 * @return {!RegExp}
 */
function tokensToRegExp (tokens, keys, options) {
    options = options || {}

    var strict = options.strict
    var start = options.start !== false
    var end = options.end !== false
    var delimiter = options.delimiter || DEFAULT_DELIMITER
    var endsWith = [].concat(options.endsWith || []).map(escapeString).concat('$').join('|')
    var route = start ? '^' : ''

    // Iterate over the tokens and create our regexp string.
    for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i]

        if (typeof token === 'string') {
            route += escapeString(token)
        } else {
            var capture = token.repeat
                ? '(?:' + token.pattern + ')(?:' + escapeString(token.delimiter) + '(?:' + token.pattern + '))*'
                : token.pattern

            if (keys) keys.push(token)

            if (token.optional) {
                if (!token.prefix) {
                    route += '(' + capture + ')?'
                } else {
                    route += '(?:' + escapeString(token.prefix) + '(' + capture + '))?'
                }
            } else {
                route += escapeString(token.prefix) + '(' + capture + ')'
            }
        }
    }

    if (end) {
        if (!strict) route += '(?:' + escapeString(delimiter) + ')?'

        route += endsWith === '$' ? '$' : '(?=' + endsWith + ')'
    } else {
        var endToken = tokens[tokens.length - 1]
        var isEndDelimited = typeof endToken === 'string'
            ? endToken[endToken.length - 1] === delimiter
            : endToken === undefined

        if (!strict) route += '(?:' + escapeString(delimiter) + '(?=' + endsWith + '))?'
        if (!isEndDelimited) route += '(?=' + escapeString(delimiter) + '|' + endsWith + ')'
    }

    return new RegExp(route, flags(options))
}

/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 *
 * @param  {(string|RegExp|Array)} path
 * @param  {Array=}                keys
 * @param  {Object=}               options
 * @return {!RegExp}
 */
function pathToRegexp (path, keys, options) {
    if (path instanceof RegExp) {
        return regexpToRegexp(path, keys)
    }

    if (Array.isArray(path)) {
        return arrayToRegexp(/** @type {!Array} */ (path), keys, options)
    }

    return stringToRegexp(/** @type {string} */ (path), keys, options)
}

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
    // //   /^\/foo\/([^\/]+?)(?:\/)?$/i，
    //   [{
    //       delimiter: "/",
    //       name: "bar",
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

    //将options参数中的path字符串存入一个新数组
    const paths = [].concat(path);

    //
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

const keys =  []
const regexp = pathToRegexp('/user/:id', keys)
console.log(regexp,keys)

const match = matchPath('/user/123',{
    path: '/user/:id',
    exact: true,
    strict: false
})

console.log(match)