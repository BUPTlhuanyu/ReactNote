---
id: react-router-generatepath
sidebar_label: generatePath
slug: '/react/react-router/others/react-router-generatepath'
sidebar_position: 5
title: ''
---

## generatePath ##

generatePath函数主要调用[path-to-regexp](https://github.com/pillarjs/path-to-regexp/blob/master/Readme.md)中的compile实现，compile的作用是根据路径匹配规则产生一个路径生成函数，如下代码所示：

	const toPath = pathToRegexp.compile('/user/:id')
	
	toPath({ id: 123 }) //=> "/user/123"
	toPath({ id: 'café' }) //=> "/user/caf%C3%A9"
	toPath({ id: '/' }) //=> "/user/%2F"
	
	toPath({ id: ':/' }) //=> "/user/%3A%2F"
	toPath({ id: ':/' }, { encode: (value, token) => value }) //=> "/user/:/"
	
	const toPathRepeated = pathToRegexp.compile('/:segment+')
	
	toPathRepeated({ segment: 'foo' }) //=> "/foo"
	toPathRepeated({ segment: ['a', 'b', 'c'] }) //=> "/a/b/c"
	
	const toPathRegexp = pathToRegexp.compile('/user/:id(\\d+)')
	
	toPathRegexp({ id: 123 }) //=> "/user/123"
	toPathRegexp({ id: '123' }) //=> "/user/123"
	toPathRegexp({ id: 'abc' }) //=> Throws `TypeError`.

generatePath(path = "/", params = {}) 根据传入的path以及params产生一个路径，当传入的path为根目录"/"时，直接返回"/"。如下例所示：

	console.log(generatePath('/user/:id',{id:123}),)	
	//输出为：  "/user/123"


### 源码 ###

	import pathToRegexp from "path-to-regexp";
	
	const cache = {};
	const cacheLimit = 10000;
	let cacheCount = 0;
	
	function compilePath(path) {
	  if (cache[path]) return cache[path];
	
	  const generator = pathToRegexp.compile(path);
	
	  if (cacheCount < cacheLimit) {
	    cache[path] = generator;
	    cacheCount++;
	  }
	
	  return generator;
	}
	
	/**
	 * Public API for generating a URL pathname from a path and parameters.
	 */
	function generatePath(path = "/", params = {}) {
	  return path === "/" ? path : compilePath(path)(params, { pretty: true });
	}
	
	export default generatePath;
