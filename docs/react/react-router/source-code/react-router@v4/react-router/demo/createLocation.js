/**
 * Created by liaohuanyu on 2019/2/15.
 */

// https://github.com/mjackson/resolve-pathname/blob/master/modules/index.js
function isAbsolute(pathname) {
    return pathname.charAt(0) === '/';
}

// About 1.5x faster than the two-arg version of Array#splice()
function spliceOne(list, index) {
    for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1) {
        list[i] = list[k];
    }

    list.pop();
}
function resolvePathname(to, from) {
    if (from === undefined) from = '';

    var toParts = (to && to.split('/')) || [];
    var fromParts = (from && from.split('/')) || [];

    var isToAbs = to && isAbsolute(to);
    var isFromAbs = from && isAbsolute(from);
    var mustEndAbs = isToAbs || isFromAbs;

    if (to && isAbsolute(to)) {
        // to is absolute
        fromParts = toParts;
    } else if (toParts.length) {
        // to is relative, drop the filename
        fromParts.pop();
        fromParts = fromParts.concat(toParts);
    }

    if (!fromParts.length) return '/';

    var hasTrailingSlash;
    if (fromParts.length) {
        var last = fromParts[fromParts.length - 1];
        hasTrailingSlash = last === '.' || last === '..' || last === '';
    } else {
        hasTrailingSlash = false;
    }

    var up = 0;
    for (var i = fromParts.length; i >= 0; i--) {
        var part = fromParts[i];

        if (part === '.') {
            spliceOne(fromParts, i);
        } else if (part === '..') {
            spliceOne(fromParts, i);
            up++;
        } else if (up) {
            spliceOne(fromParts, i);
            up--;
        }
    }

    if (!mustEndAbs) for (; up--; up) fromParts.unshift('..');

    if (
        mustEndAbs &&
        fromParts[0] !== '' &&
        (!fromParts[0] || !isAbsolute(fromParts[0]))
    )
        fromParts.unshift('');

    var result = fromParts.join('/');

    if (hasTrailingSlash && result.substr(-1) !== '/') result += '/';

    return result;
}

// https://github.com/mjackson/value-equal/blob/master/modules/index.js
function valueOf(obj) {
    return obj.valueOf ? obj.valueOf() : Object.prototype.valueOf.call(obj);
}

function valueEqual(a, b) {
    // Test for strict equality first.
    if (a === b) return true;

    // Otherwise, if either of them == null they are not equal.
    if (a == null || b == null) return false;

    if (Array.isArray(a)) {
        return (
            Array.isArray(b) &&
            a.length === b.length &&
            a.every(function(item, index) {
                return valueEqual(item, b[index]);
            })
        );
    }

    if (typeof a === 'object' || typeof b === 'object') {
        var aValue = valueOf(a);
        var bValue = valueOf(b);

        if (aValue !== a || bValue !== b) return valueEqual(aValue, bValue);

        return Object.keys(Object.assign({}, a, b)).every(function(key) {
            return valueEqual(a[key], b[key]);
        });
    }

    return false;
}

// https://github.com/ReactTraining/history/blob/master/modules/PathUtils.js

function addLeadingSlash(path) {
    return path.charAt(0) === '/' ? path : '/' + path;
}

function stripLeadingSlash(path) {
    return path.charAt(0) === '/' ? path.substr(1) : path;
}

function hasBasename(path, prefix) {
    return new RegExp('^' + prefix + '(\\/|\\?|#|$)', 'i').test(path);
}

function stripBasename(path, prefix) {
    return hasBasename(path, prefix) ? path.substr(prefix.length) : path;
}

function stripTrailingSlash(path) {
    return path.charAt(path.length - 1) === '/' ? path.slice(0, -1) : path;
}

function parsePath(path) {
    let pathname = path || '/';
    let search = '';
    let hash = '';

    const hashIndex = pathname.indexOf('#');
    if (hashIndex !== -1) {
        hash = pathname.substr(hashIndex);
        pathname = pathname.substr(0, hashIndex);
    }

    const searchIndex = pathname.indexOf('?');
    if (searchIndex !== -1) {
        search = pathname.substr(searchIndex);
        pathname = pathname.substr(0, searchIndex);
    }

    return {
        pathname,
        search: search === '?' ? '' : search,
        hash: hash === '#' ? '' : hash
    };
}

function createPath(location) {
    const { pathname, search, hash } = location;

    let path = pathname || '/';

    if (search && search !== '?')
        path += search.charAt(0) === '?' ? search : `?${search}`;

    if (hash && hash !== '#') path += hash.charAt(0) === '#' ? hash : `#${hash}`;

    return path;
}


//https://github.com/ReactTraining/history/blob/master/modules/LocationUtils.js

function createLocation(path, state, key, currentLocation) {
    let location;
    if (typeof path === 'string') {
        // Two-arg form: push(path, state)
        location = parsePath(path);
        location.state = state;
    } else {
        // One-arg form: push(location)
        location = { ...path };

        if (location.pathname === undefined) location.pathname = '';

        if (location.search) {
            if (location.search.charAt(0) !== '?')
                location.search = '?' + location.search;
        } else {
            location.search = '';
        }

        if (location.hash) {
            if (location.hash.charAt(0) !== '#') location.hash = '#' + location.hash;
        } else {
            location.hash = '';
        }

        if (state !== undefined && location.state === undefined)
            location.state = state;
    }

    try {
        location.pathname = decodeURI(location.pathname);
    } catch (e) {
        if (e instanceof URIError) {
            throw new URIError(
                'Pathname "' +
                location.pathname +
                '" could not be decoded. ' +
                'This is likely caused by an invalid percent-encoding.'
            );
        } else {
            throw e;
        }
    }

    if (key) location.key = key;

    if (currentLocation) {
        // Resolve incomplete/relative pathname relative to current location.
        if (!location.pathname) {
            location.pathname = currentLocation.pathname;
        } else if (location.pathname.charAt(0) !== '/') {
            location.pathname = resolvePathname(
                location.pathname,
                currentLocation.pathname
            );
        }
    } else {
        // When there is no prior location and pathname is empty, set it to /
        if (!location.pathname) {
            location.pathname = '/';
        }
    }

    return location;
}
function locationsAreEqual(a, b) {
    return (
        a.pathname === b.pathname &&
        a.search === b.search &&
        a.hash === b.hash &&
        a.key === b.key &&
        valueEqual(a.state, b.state)
    );
}

//当to为string类型的时候
console.log(createLocation("/user/123"))
//返回
// {
//         hash: "",
//         pathname: "/user/123",
//         search: "",
//         state: undefined
// }

// 当to为对象的时候
// let to={
//     pathname: "/login",
//     search: "?utm=your+face",
//     state: { "a":1}
// }
// console.log(createLocation({
//     ...to,
//     pathname:"/user/123"
// }))
//
// 返回
// {
//     hash:""
//     pathname:"/user/123"
//     search:"?utm=your+face"
//     state:{
//         a:1
//     }
// }