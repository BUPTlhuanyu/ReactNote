"use strict";(self.webpackChunkreact_note_docusaurus=self.webpackChunkreact_note_docusaurus||[]).push([[5803],{4028:function(n){n.exports=JSON.parse('{"blogPosts":[{"id":"blog-post","metadata":{"permalink":"/ReactNote/blog/blog-post","editUrl":"https://github.com/BUPTlhuanyu/ReactNote/tree/master/blog/2021-09-30-blog-post.md","source":"@site/blog/2021-09-30-blog-post.md","title":"koa code analyse","description":"Koa2\u5b98\u7f51 \u2014\u2014> github\u5730\u5740","date":"2021-09-30T00:00:00.000Z","formattedDate":"September 30, 2021","tags":[{"label":"node koa","permalink":"/ReactNote/blog/tags/node-koa"}],"readingTime":12.67,"truncated":false,"authors":[{"name":"liaohuanyu","title":"Maintainer of ReactNote","url":"https://github.com/BUPTlhuanyu","imageURL":"https://github.com/BUPTlhuanyu.png","key":"lhuanyu"}],"frontMatter":{"slug":"blog-post","title":"koa code analyse","authors":"lhuanyu","tags":["node koa"]},"nextItem":{"title":"AOP design-pattern in javascript","permalink":"/ReactNote/blog/blog-post"}},"content":"> [Koa2\u5b98\u7f51](https://koa.bootcss.com/) \u2014\u2014> [github\u5730\u5740](https://github.com/koajs/koa)\\n\\n> [Koa2\u8fdb\u9636\u5b66\u4e60\u7b14\u8bb0](https://chenshenhai.github.io/koa2-note/) \u2014\u2014> [github\u5730\u5740](https://github.com/chenshenhai/koa2-note)\\n\\n> [Koa.js \u8bbe\u8ba1\u6a21\u5f0f-\u5b66\u4e60\u7b14\u8bb0](https://chenshenhai.github.io/koajs-design-note/) \u2014\u2014> [github\u5730\u5740](https://github.com/chenshenhai/koajs-design-note)\\n\\n## koa\u7c7b\u7684\u7ed3\u6784\\n\\n```\\nmodule.exports = class Application extends Emitter\uff5b\\n    constructor() {\\n    super();\\n    this.proxy = false;\\n    this.middleware = [];\\n    this.subdomainOffset = 2;\\n    this.context = Object.create(context);\\n    this.request = Object.create(request);\\n    this.response = Object.create(response);\\n  }\\n  listen(...args) {...}\\n  toJSON() {...}\\n  inspect() {...}\\n  use(fn) {...}\\n  callback() {...}\\n  handleRequest(ctx, fnMiddleware) {...}\\n  createContext(req, res) {...}\\n  onerror(err) {...}\\n\uff5d\\n```\\n\\n\\n\\n## \u7b80\u5355\u793a\u4f8b\u51fa\u53d1\\n\u5982\u4e0b\u4e3a\u5b98\u65b9\u7ed9\u51fa\u7684\u7ea7\u8054\u5f62\u5f0f\u7684`koa`\u793a\u4f8b\uff0c\\n\\n```\\nconst Koa = require(\'koa\');\\nconst app = new Koa();\\n\\n// logger\\n\\napp.use(async (ctx, next) => {\\n  await next();\\n  const rt = ctx.response.get(\'X-Response-Time\');\\n  console.log(`${ctx.method} ${ctx.url} - ${rt}`);\\n});\\n\\n// x-response-time\\n\\napp.use(async (ctx, next) => {\\n  const start = Date.now();\\n  await next();\\n  const ms = Date.now() - start;\\n  ctx.set(\'X-Response-Time\', `${ms}ms`);\\n});\\n\\n// response\\n\\napp.use(async ctx => {\\n  ctx.body = \'Hello World\';\\n});\\n\\napp.listen(3000);\\n```\\n\u4e0a\u8ff0\u793a\u4f8b\u7684\u5de5\u4f5c\u8fc7\u7a0b\u53ef\u4ee5\u5206\u4e3a\u51c6\u5907\u9636\u6bb5\u4e0e\u5904\u7406reques\u4e8b\u4ef6\u8fd9\u4e24\u4e2a\u9636\u6bb5\u3002\\n\\n### \u51c6\u5907\u9636\u6bb5\\n\\n\u51c6\u5907\u9636\u6bb5\u4f1a\u521b\u5efakoa\u5b9e\u4f8b\uff0c\u6ce8\u518c\u4e2d\u95f4\u4ef6\uff0c\u76d1\u542c\u6307\u5b9a\u7aef\u53e3\uff0c\u4e2d\u95f4\u4ef6\u7684\u5904\u7406\u65b9\u5f0f\u4e3a\u6d0b\u8471\u6a21\u578b\u8bbe\u8ba1\u6a21\u5f0f\uff1a\\n1. \u521b\u5efa\u4e00\u4e2a`koa`\u5b9e\u4f8b\u4e3a`app`;\\n2. \u6ce8\u518c`logger`\u4e2d\u95f4\u4ef6\uff0c\u4e5f\u5c31\u662f\u5c06\u4e2d\u95f4\u4ef6\u51fd\u6570\u6dfb\u52a0\u5230\u4e00\u4e2a\u540d\u4e3a`middleware`\u7684\u6570\u7ec4\u4e2d\u3002\\n3. \u6ce8\u518c`x-response-time`\u4e2d\u95f4\u4ef6\u3002\\n4. \u6ce8\u518c`response`\u4e2d\u95f4\u4ef6\u3002\\n5. \u76d1\u542c3000\u7aef\u53e3\u3002\\n\\n#### 1. \u521b\u5efakoa\u5b9e\u4f8b\uff0c\u8c03\u7528constructor\uff0c\u5b9a\u4e49\u5b9e\u4f8b\u5c5e\u6027middleware\u7b49\u7b49\\n#### 2. koa\u5b9e\u4f8b\u7684koa\u7c7b\u7684\u539f\u578b\u5bf9\u8c61\u65b9\u6cd5use\u6dfb\u52a0\u4e2d\u95f4\u4ef6\uff0cuse\u65b9\u6cd5\u53ea\u662f\u7b80\u5355\u7684\u5c06\u4e2d\u95f4\u4ef6\u6dfb\u52a0\u5230\u5b9e\u4f8b\u7684\u5c5e\u6027middleware\u6570\u7ec4\u4e2d\uff0c\u7136\u540e\u8fd4\u56de\u5b9e\u4f8b\u81ea\u8eab\u7684this\u3002\\n\\n```\\n  use(fn) {\\n    if (typeof fn !== \'function\') throw new TypeError(\'middleware must be a function!\');\\n    debug(\'use %s\', fn._name || fn.name || \'-\');\\n    this.middleware.push(fn);\\n    return this;\\n  }\\n```\\n#### 3. \u76d1\u542c\u7aef\u53e33000\uff0c\u8c03\u7528\u539f\u578b\u5bf9\u8c61\u65b9\u6cd5listen\uff0c\u8be5\u65b9\u6cd5\u5185\u90e8\u4f1a\u8c03\u7528node\u7684http\u6a21\u5757\uff0c\u8c03\u7528\u5b9e\u4f8b\u65b9\u6cd5this.callback\uff0c\u7136\u540e\u5c06\u8fd4\u56de\u7ed3\u679c\u4f5c\u4e3ahttp.createServer\u7684\u4f20\u5165\u53c2\u6570\u5373\u4f5c\u4e3a\u7aef\u53e3\u89e6\u53d1\u7684request\u4e8b\u4ef6\u7684\u56de\u8c03\u51fd\u6570\u3002http.createServer\u8fd0\u884c\u540e\u8fd4\u56de\u4e00\u4e2ahttp\u670d\u52a1\u5668\uff0c\u7136\u540e\u5c06\u8be5http\u670d\u52a1\u5668\u76d1\u542c\u7aef\u53e33000\u3002\u57283000\u7aef\u53e3\u6709\u8bf7\u6c42\u7684\u65f6\u5019\uff0c\u89e6\u53d1node\u673a\u5236\u7684request\u4e8b\u4ef6\uff0c\u5e76\u8c03\u7528this.callback()\u8fd4\u56de\u7684\u51fd\u6570\u3002this.callback\u51fd\u6570\u4f1a\u5c06\u4e2d\u95f4\u4ef6\u51fd\u6570\u7ec4\u7ec7\u6210\u6d0b\u8471\u6a21\u578b\uff0c\u5e76\u8fd4\u56de\u4e00\u4e2a\u6267\u884c\u5165\u53e3\u51fd\u6570\uff0c\u7528\u4e8e\u6309\u7167\u7279\u5b9a\u987a\u5e8f\u6267\u884c\u4e2d\u95f4\u4ef6\u3002\\n\u5728\u6267\u884cthis.callback()\u51fd\u6570\u7684\u8fc7\u7a0b\u4e2d\uff0c\u9996\u5148\u4f1a\u8c03\u7528compose\u51fd\u6570\u5904\u7406\u4e2d\u95f4\u4ef6\uff0c\u7136\u540e\u8fd4\u56dehandleRequest\u51fd\u6570\uff0c\u8be5\u51fd\u6570\u662frequest\u4e8b\u4ef6\u7684\u56de\u8c03\u51fd\u6570\uff0c\u7528\u4e8e\u6267\u884c\u4e2d\u95f4\u4ef6\u5bf9req\u4e0eres\u8fdb\u884c\u5904\u7406\u3002\\n\\n```\\n  listen(...args) {\\n    debug(\'listen\');\\n    const server = http.createServer(this.callback());\\n    return server.listen(...args);\\n  }\\n  callback() {\\n    //compose\u51fd\u6570\u5c06\u4e2d\u95f4\u4ef6\u6570\u7ec4\u8f6c\u6362\u6210\u6267\u884c\u94fe\u51fd\u6570fn\\n    const fn = compose(this.middleware);\\n\\n    if (!this.listenerCount(\'error\')) this.on(\'error\', this.onerror);\\n\\n    const handleRequest = (req, res) => {\\n      const ctx = this.createContext(req, res);\\n      return this.handleRequest(ctx, fn);\\n    };\\n\\n    return handleRequest;\\n  }\\n  handleRequest(ctx, fnMiddleware) {\\n    const res = ctx.res;\\n    res.statusCode = 404;\\n    const onerror = err => ctx.onerror(err);\\n    const handleResponse = () => respond(ctx);\\n    onFinished(res, onerror);\\n    return fnMiddleware(ctx).then(handleResponse).catch(onerror);\\n  }\\n```\\n\\n### compose\u5982\u4f55\u7ec4\u7ec7\u4e2d\u95f4\u4ef6\u6570\u7ec4middleware\\n\u5982\u4f55\u5b9e\u73b0\u4e00\u4e2acompose\uff0c\u8be5\u51fd\u6570\u7684\u529f\u80fd\u662f\u6309\u987a\u5e8f\u6267\u884cmiddleware\u4e2d\u7684\u4e2d\u95f4\u4ef6\uff1a\\n1. \u5047\u8bbe\u4e2d\u95f4\u4ef6\u51fd\u6570\u90fd\u662f\u4e00\u6b65\u5230\u5e95\u5168\u90e8\u6267\u884c\u5b8c\u540e\u518d\u6267\u884c\u4e0b\u4e00\u4e2a\u4e2d\u95f4\u4ef6\\n2. \u4e2d\u95f4\u4ef6\u51fd\u6570\u9996\u5148\u6267\u884c\u4e00\u90e8\u5206\u7136\u540e\u6267\u884c\u5176\u4ed6\u4e2d\u95f4\u4ef6\uff0c\u7136\u540e\u518d\u56de\u6765\u6267\u884c\u6267\u884c\u5269\u4e0b\u7684\u90e8\u5206\u3002\\n3. \u4e2d\u95f4\u4ef6\u51fd\u6570\u662f\u5f02\u6b65\u7684\u60c5\u51b5\\n4. \u9650\u5236\u4e00\u4e2a\u4e2d\u95f4\u4ef6\u53ea\u80fd\u6267\u884c\u4e00\u6b21\\n5. \u5141\u8bb8\u4e2d\u95f4\u4ef6\u622a\u83b7\u4fe1\u606f\u4ee5\u53ca\u5904\u7406\u9519\u8bef\\n#### \u4e2d\u95f4\u4ef6\u51fd\u6570\u90fd\u662f\u4e00\u6b65\u5230\u5e95\u5168\u90e8\u6267\u884c\u5b8c\u540e\u518d\u6267\u884c\u4e0b\u4e00\u4e2a\u4e2d\u95f4\u4ef6\uff1a\\n\\n```\\nfunction myCompose(ctx = [],middleware){\\n    return dispatch(0)\\n    function dispatch(i){\\n        let fn = middleware[i];\\n        if(!fn) return;\\n        return fn(ctx, dispatch.bind(null,i+1));\\n    }\\n}\\n\\nlet fn0 = function(ctx,next){\\n    console.log(0);\\n    ctx.push(0)\\n    next()\\n}\\n\\nlet fn1 = function(ctx,next){\\n    console.log(1);\\n    ctx.push(1)\\n    next();\\n}\\n\\nlet fn2 = function(ctx,next){\\n    console.log(2);\\n    ctx.push(2)\\n    next();\\n}\\n\\nlet middleware = [fn0,fn1,fn2]\\nlet ctx = []\\nmyCompose(ctx,middleware);\\nconsole.log(ctx);\\n```\\n#### \u4e2d\u95f4\u4ef6\u51fd\u6570\u9996\u5148\u6267\u884c\u4e00\u90e8\u5206\u7136\u540e\u6267\u884c\u5176\u4ed6\u4e2d\u95f4\u4ef6\uff0c\u7136\u540e\u518d\u56de\u6765\u6267\u884c\u6267\u884c\u5269\u4e0b\u7684\u90e8\u5206\\n\u4e0a\u9762\u7684\u4ee3\u7801\u80fd\u5426\u5b9e\u73b0\u8fd9\u6837\u7684\u4e00\u4e2a\u529f\u80fd\u5462\uff1f\u6d4b\u8bd5\u5982\u4e0b\uff1a\\n\\n\\n```\\nlet fn0 = function(ctx,next){\\n    console.log(0);\\n    ctx.push(0)\\n    next()\\n    console.log(\\"fn0\\");\\n}\\n\\nlet fn1 = function(ctx,next){\\n    console.log(1);\\n    ctx.push(1)\\n    next();\\n    console.log(\\"fn1\\");\\n}\\n\\nlet fn2 = function(ctx,next){\\n    console.log(2);\\n    ctx.push(2)\\n    next();\\n    console.log(\\"fn2\\");\\n}\\nlet middleware = [fn0,fn1,fn2]\\nlet ctx = []\\nmyCompose(ctx,middleware);\\nconsole.log(ctx);\\n```\\n\u8fd4\u56de\u7684\u7ed3\u679c\uff1a\\n\\n```\\n0\\n1\\n2\\nfn2\\nfn1\\nfn0\\n(3) [0, 1, 2]\\n```\\n\\n\u663e\u7136\u4e0a\u9762\u7684myCompose\u51fd\u6570\u662f\u53ef\u4ee5\u5b9e\u73b0\u8fd9\u6837\u7684\u529f\u80fd\u7684\u3002\\n\\n#### \u4e2d\u95f4\u4ef6\u51fd\u6570\u662f\u5f02\u6b65\u7684\u60c5\u51b5\\n\u6d4b\u8bd5\u5f02\u6b65\u7684\u60c5\u51b5\uff1a\\n\\n```\\nlet fn0 = async function(ctx,next){\\n    console.log(0);\\n    ctx.push(0)\\n    await next()\\n    console.log(\\"fn0\\");\\n}\\n\\nlet fn1 = async function(ctx,next){\\n    console.log(1);\\n    ctx.push(1)\\n    await next();\\n    console.log(\\"fn1\\");\\n}\\n\\nlet fn2 = async function(ctx,next){\\n    console.log(2);\\n    ctx.push(2)\\n    await next();\\n    console.log(\\"fn2\\");\\n}\\nlet middleware = [fn0,fn1,fn2]\\nlet ctx = []\\nmyCompose(ctx,middleware);\\nconsole.log(ctx);\\n```\\n\u8fd4\u56de\u7684\u7ed3\u679c\uff1a\\n\\n```\\n0\\n1\\n2\\n(3) [0, 1, 2]\\nfn2\\nfn1\\nfn0\\n```\\n\\n#### \u9650\u5236\u4e00\u4e2a\u4e2d\u95f4\u4ef6\u53ea\u80fd\u6267\u884c\u4e00\u6b21\\n\\n```\\nfunction myCompose(ctx = [],middleware){\\n    return dispatch(0)\\n    function dispatch(i){\\n        let fn = middleware[i];\\n        if(!fn) return;\\n        return fn(ctx, dispatch.bind(null,i+1));\\n    }\\n}\\nlet fn0 = async function(ctx,next){\\n    console.log(0);\\n    ctx.push(0)\\n    await next()\\n    await next()\\n    console.log(\\"fn0\\");\\n}\\n\\nlet fn1 = async function(ctx,next){\\n    console.log(1);\\n    ctx.push(1)\\n    await next();\\n    console.log(\\"fn1\\");\\n}\\n\\nlet fn2 = async function(ctx,next){\\n    console.log(2);\\n    ctx.push(2)\\n    await next();\\n    console.log(\\"fn2\\");\\n}\\nlet middleware = [fn0,fn1,fn2]\\nlet ctx = []\\nmyCompose(ctx,middleware);\\nconsole.log(ctx);\\n```\\n\u8fd4\u56de\u7684\u7ed3\u679c\uff1a\\n\\n```\\n0\\n1\\n2\\n(3) [0, 1, 2]\\nfn2\\nfn1\\n1\\n2\\nfn2\\nfn1\\nfn0\\n```\\n\u5728fn0\u51fd\u6570\u4e2d\u8c03\u7528\u4e86\u4e24\u6b21next()\uff0c\u8fd9\u6837\u4f1a\u5bfc\u81f4\u91cd\u65b0\u6267\u884c\u4e86fn0\u540e\u9762\u7684\u6240\u6709\u4e2d\u95f4\u4ef6\u51fd\u6570\u3002\u4e3a\u4e86\u907f\u514d\u8fd9\u6837\u60c5\u51b5\u7684\u53d1\u751f\uff0c\u9700\u8981\u9650\u5236\u4e00\u4e2a\u4e2d\u95f4\u4ef6\u53ea\u80fd\u6267\u884c\u4e00\u6b21\u3002myCompose\u51fd\u6570\u662f\u901a\u8fc7\u8c03\u7528dispatch\u51fd\u6570\u6765\u6267\u884c\u4e2d\u95f4\u4ef6\u51fd\u6570\u7684\uff0c\u56e0\u6b64\u53ef\u4ee5\u901a\u8fc7\u963b\u6b62dispatch\u51fd\u6570\u6765\u963b\u6b62\u4e2d\u95f4\u4ef6\u51fd\u6570\u7684\u6267\u884c\u3002\u4ecemyCompose\u51fd\u6570\u53ef\u77e5\uff0c\u5728\u4e2d\u95f4\u4ef6\u51fd\u6570\u4e2d\u6267\u884c\u5230\u7b2c\u4e8c\u6b21next\u7684\u65f6\u5019\uff0c\u5fc5\u5b9a\u5df2\u7ecf\u8c03\u7528\u4e86middleware.length\u6b21dispatch\uff0c\u5373\u6267\u884c\u8fc7\u4e86\u6240\u6709\u4e2d\u95f4\u4ef6\u51fd\u6570next\u4e4b\u524d\u7684\u903b\u8f91\u3002\u6267\u884cnext()\u51fd\u6570\u5176\u5b9e\u5c31\u662f\u6267\u884c`dispatch.bind(null, i + 1)` \uff0c\u7531\u6b64\u53ef\u4ee5\u770b\u51fa\uff0c\u6bcf\u4e2a\u4e2d\u95f4\u4ef6\u51fd\u6570\u6267\u884c\u7b2c\u4e8c\u6b21 next \u7684\u51fd\u6570\u7684\u65f6\u5019\uff0c\u4f20\u5165\u7684\u7b2c\u4e00\u4e2a\u53c2\u6570\u5c31\u662f i+1 \uff0ci+1 \u7684\u8303\u56f4\u662f[0,3]\u3002\u56e0\u6b64\u53ef\u4ee5\u8bb0\u5f55\u4e00\u4e0b\u5df2\u7ecf\u6267\u884c\u4e86\u591a\u5c11\u6b21dispatch\u5230index\u4e2d\uff0c\u7136\u540e\u6bcf\u6b21dispatch\u7684\u65f6\u5019\u6bd4\u8f83\u7b2c\u4e00\u4e2a\u53c2\u6570 i+1 \u4e0e index \u7684\u503c\uff0c\u6765\u5224\u65ad\u662f\u5426\u5b58\u5728\u540c\u4e00\u4e2a\u4e2d\u95f4\u4ef6\u51fd\u6570\u88ab\u6267\u884c\u4e86\u591a\u6b21\u7684\u60c5\u51b5\u3002\u56e0\u6b64\u4fee\u6539\u540emyCompose\u5982\u4e0b\uff1a\\n\\n```\\nfunction myCompose(ctx = [],middleware){\\n    let index = -1;\\n    return dispatch(0)\\n    function dispatch(i){\\n        if(i <= index) return;\\n        index = i;\\n        let fn = middleware[i];\\n        if(!fn) return;\\n        return fn(ctx, dispatch.bind(null,i+1));\\n    }\\n}\\n\\n```\\n\u8fd4\u56de\u7684\u7ed3\u679c\uff1a\\n\\n```\\n0\\n1\\n2\\n(3) [0, 1, 2]\\nfn2\\nfn1\\nfn0\\n```\\n#### \u5141\u8bb8\u4e2d\u95f4\u4ef6\u622a\u83b7\u4fe1\u606f\u4ee5\u53ca\u5904\u7406\u9519\u8bef\\n\u5bf9\u4e8e\u4e00\u4e2a\u4e2d\u95f4\u4ef6\u800c\u8a00\uff0c\u6bd4\u5982\\n\\n```\\nlet fn0 = async function(ctx,next){\\n    console.log(0);\\n    ctx.push(0)\\n    await next()\\n    console.log(\\"fn0\\");\\n}\\n```\\n\u5982\u679c\u4e0b\u4e00\u4e2a\u4e2d\u95f4\u4ef6\u51fa\u73b0\u4e86\u95ee\u9898\uff0c\u6216\u8005fn0\u4e2d\u95f4\u4ef6\u51fd\u6570\u9700\u8981\u4e0b\u4e00\u4e2a\u4e2d\u95f4\u4ef6\u51fd\u6570\u8fd4\u56de\u4e00\u4e9b\u6570\u636e\u8fdb\u884c\u5904\u7406\uff0c\u90a3\u4e48\u5982\u4f55\u5b9e\u73b0\u5462\uff1f\u5229\u7528promise.resolve\u4ee5\u53careject\u6765\u5904\u7406\u6570\u636e\u4ee5\u53ca\u9519\u8bef\u4fe1\u606f\u3002\u4fee\u6539\u540e\u7684\u4ee3\u7801\u4e3a\uff1a\\n\\n```\\nfunction myCompose(ctx = [],middleware){\\n    let index = -1;\\n    return dispatch(0)\\n    function dispatch(i){\\n        if(i <= index) return Promise.reject(new Error(\'next() called multiple times in a middleware\'));\\n        index = i;\\n        let fn = middleware[i];\\n        if(!fn) return Promise.resolve();\\n        return Promise.resolve(fn(ctx, dispatch.bind(null,i+1)));\\n    }\\n}\\n```\\n\u5982\u679creturn Promise.resolve(fn(context, dispatch.bind(null, i + 1)));\u51fa\u73b0\u9519\u8bef\uff0c\u5229\u7528try-catch\u8fdb\u884c\u6355\u83b7\u5e76\u4e14\u5c06\u9519\u8bef\u4fe1\u606freject\u5230\u4e0a\u5c42\u4e2d\u95f4\u4ef6\u3002\u4fee\u6539\u540e\u7684\u4ee3\u7801\u4e3a\uff1a\\n\\n```\\nfunction myCompose(ctx = [],middleware){\\n    let index = -1;\\n    return dispatch(0)\\n    function dispatch(i){\\n        if(i <= index) return Promise.reject(new Error(\'next() called multiple times in a middleware\'));\\n        index = i;\\n        let fn = middleware[i];\\n        if(!fn) return Promise.resolve();\\n        try {\\n            return Promise.resolve(fn(ctx, dispatch.bind(null,i+1)));\\n        } catch(err){\\n            return Promise.reject(err)\\n        }\\n    }\\n}\\n```\\n\u5b98\u65b9\u7ed9\u51fa\u7684compose\u5b9e\u73b0\u5982\u4e0b\uff1a\\n```\\nfunction compose (middleware) {\\n    if (!Array.isArray(middleware)) throw new TypeError(\'Middleware stack must be an array!\')\\n    for (const fn of middleware) {\\n        if (typeof fn !== \'function\') throw new TypeError(\'Middleware must be composed of functions!\')\\n    }\\n\\n    /**\\n     * @param {Object} context\\n     * @return {Promise}\\n     * @api public\\n     */\\n\\n    return function (context, next) {\\n        // last called middleware #\\n        let index = -1\\n        return dispatch(0)\\n        function dispatch (i) {\\n            if (i <= index) return Promise.reject(new Error(\'next() called multiple times\'))\\n            index = i\\n            let fn = middleware[i]\\n            if (i === middleware.length) fn = next\\n            if (!fn) return Promise.resolve()\\n            try {\\n                return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));\\n            } catch (err) {\\n                return Promise.reject(err)\\n            }\\n        }\\n    }\\n}\\n```\\n\u4e0e\u4e4b\u524d\u7684myCompose\u7248\u672c\u6bd4\u8f83\u591a\u4e86\u4e00\u4e2aif (i === middleware.length) fn = next;\u8fd9\u6837\u5904\u7406\u662f\u4e3a\u4e86\u68c0\u6d4b\u5982\u679c\u6267\u884c\u5230middleware\u6700\u540e\u4e00\u4e2a\u4e2d\u95f4\u4ef6\uff0c\u5219\u5c06compose(this.middleware)(ctx,fnLast);\u4e2d\u7684fnLast\u6700\u4e3a\u6700\u540e\u4e00\u4e2a\u4e2d\u95f4\u4ef6\u3002koa\u6e90\u7801\u4e2d\u8fd9\u4e2anext\u4e3aundefined\u3002\\n\\n### \u5904\u7406reques\u4e8b\u4ef6\\n\\n\u5f53\u76d1\u542c\u52303000\u7aef\u53e3\u6709\u8bf7\u6c42\u8fc7\u6765\u7684\u65f6\u5019\uff0c\u89e6\u53d1request\u4e8b\u4ef6\uff0c\u7136\u540e\u5f00\u59cb\u6267\u884c\u5404\u4e2a\u4e2d\u95f4\u4ef6\uff0c\u5b9e\u9645\u5728\u4e4b\u524d\u5b9e\u73b0myCompose\u51fd\u6570\u7684\u8fc7\u7a0b\u4e2d\u53ef\u4ee5\u770b\u51fa\u4e2d\u95f4\u4ef6\u6267\u884c\u7684\u987a\u5e8f\u3002\\n\\n### \u603b\u7ed3\\n\\n```\\nconst Koa = require(\'koa\');\\nconst app = new Koa();\\n\\n// logger\\n\\napp.use(async (ctx, next) => {\\n  await next();\\n  const rt = ctx.response.get(\'X-Response-Time\');\\n  console.log(`${ctx.method} ${ctx.url} - ${rt}`);\\n});\\n\\n// x-response-time\\n\\napp.use(async (ctx, next) => {\\n  const start = Date.now();\\n  await next();\\n  const ms = Date.now() - start;\\n  ctx.set(\'X-Response-Time\', `${ms}ms`);\\n});\\n\\n// response\\n\\napp.use(async ctx => {\\n  ctx.body = \'Hello World\';\\n});\\n\\napp.listen(3000);\\n```\\n\u8fd9\u91cc\u4e2d\u95f4\u4ef6\u7ea7\u8054\u7684\u65b9\u5f0f\u5bf9ctx\u8fdb\u884c\u9010\u6b65\u5904\u7406\uff0c\u6839\u636ecompose.js\u53ef\u77e5\u4f20\u5165\u4e2d\u95f4\u4ef6\u7684next\u5176\u5b9e\u5c31\u662f\uff1a\\n\\n```\\ndispatch.bind(null, i + 1)\\n```\\n#### \u5de5\u4f5c\u539f\u7406\\n\\n1. \u521b\u5efa\u4e00\u4e2akoa\u5bf9\u8c61\uff0c\u7136\u540e\u8c03\u7528use(fn)\u5c06fn push\u5230\u8be5koa\u5bf9\u8c61\u7684\u4e2d\u95f4\u4ef6\u6570\u7ec4\u4e2d\\n2. \u63a5\u7740\u8c03\u7528listen\u521b\u5efa\u4e00\u4e2a\u670d\u52a1\u5668\u5bb9\u5668\uff0c\u7136\u540e\u8c03\u7528this.callback()\uff0c\u7136\u540e\u76d1\u542c\u6307\u5b9a\u7aef\u53e3\\n3. this.callback()\u9996\u5148\u4f1a\u8c03\u7528compose\u5bf9\u4e2d\u95f4\u4ef6\u6570\u7ec4\u8fdb\u884c\u5904\u7406\uff0c\u8fd4\u56de\u4e00\u4e2a\u6d0b\u8471\u6a21\u578b\u7684\u5165\u53e3\u51fd\u6570\u3002\u7136\u540e\u8fd4\u56de\u4e00\u4e2ahandleRequest\\n4. handleRequest\u51fd\u6570\u4f1a\u5728\u76d1\u542c\u5230\u7aef\u53e3\u6709\u8bf7\u6c42\u7684\u65f6\u5019\u8c03\u7528\uff0c\u8be5\u51fd\u6570\u6700\u7ec8\u4f1a\u8c03\u7528\u6d0b\u8471\u6a21\u578b\u7684\u5165\u53e3\u51fd\u6570\u3002\\n5. handleRequest\u51fd\u6570\u63a5\u6536\u4e24\u4e2a\u53c2\u6570req, res\uff1b\u8be5\u51fd\u6570\u6267\u884c\u7684\u65f6\u5019\u9996\u5148\u4f1a\u6839\u636e\u4f20\u5165\u7684req, res\u521b\u5efa\u4e00\u4e2actx\uff1b\u7136\u540e\u8c03\u7528koa\u5bf9\u8c61\u7684handleRequest\u51fd\u6570\uff0c\u5c06\u7ed3\u679c\u8fd4\u56de\u3002\\n6. koa\u5bf9\u8c61\u7684handleRequest\u51fd\u6570\u63a5\u6536\u4e24\u4e2a\u53c2\u6570(ctx, fn)\uff0cctx\u5c31\u662f\u6839\u636ereq, res\u521b\u5efa\u7684ctx\uff0cfn\u5c31\u662f\u8c03\u7528compose\u8fd4\u56de\u7684\u6d0b\u8471\u6a21\u578b\u5165\u53e3\u51fd\u6570\u3002 koa\u5bf9\u8c61\u7684handleRequest\u51fd\u6570\u6700\u7ec8\u4f1a\u8c03\u7528fn(ctx)\\n\\n\u5728\u4e2d\u95f4\u4ef6\u9700\u8981\u7ea7\u8054\u7684\u65f6\u5019\uff0c\u9700\u8981\u7ed9\u4e2d\u95f4\u4ef6\u4f20\u5165\u7b2c\u4e8c\u4e2a\u53c2\u6570next\\n\\n\\n#### \u6280\u5de7\\n\\n```\\nlet fn0 = async function(ctx,next){\\n    console.log(0);\\n    ctx.push(0)\\n    await next()\\n    await next().catch(err=>console.log(err))\\n    console.log(\\"fn0\\");\\n}\\n```\\n\u6ce8\u610f\u8fd9\u91cc\uff0c\u4e2d\u95f4\u4ef6\u7cfb\u7edf\u5e26\u6765\u7684\u95ee\u9898\uff0c\u4e2d\u95f4\u4ef6\u53ef\u4ee5\u968f\u610f\u7ed9ctx\u5b9a\u4e49\u5b9e\u4f8b\u65b9\u6cd5\u4ee5\u53ca\u5c5e\u6027\uff0c\u8fd9\u6837\u4f1a\u5bfc\u81f4\u4e2d\u95f4\u4ef6\u4e4b\u95f4\u7684\u8986\u76d6\u7684\u95ee\u9898\uff0c\u5f88\u96be\u68c0\u67e5\u4e0d\u9519\u8bef\u3002\u901a\u8fc7\u5728\u4e2d\u95f4\u4ef6\u5bf9next\u8fdb\u884ccatch\u6765\u8fdb\u884c\u9519\u8bef\u68c0\u67e5\u3002 \\n\\n```\\nawait next().catch(err=>console.log(err))\\n```\\n\u4f1a\u6253\u5370\u9519\u8bef\uff0c\u4f46\u662f\u7a0b\u5e8f\u4e0d\u4f1acrash\u6389\u3002"},{"id":"blog-post","metadata":{"permalink":"/ReactNote/blog/blog-post","editUrl":"https://github.com/BUPTlhuanyu/ReactNote/tree/master/blog/2021-09-29-blog-post.md","source":"@site/blog/2021-09-29-blog-post.md","title":"AOP design-pattern in javascript","description":"- x] [\u7b80\u4ecb","date":"2021-09-29T00:00:00.000Z","formattedDate":"September 29, 2021","tags":[{"label":"design-pattern","permalink":"/ReactNote/blog/tags/design-pattern"}],"readingTime":3.545,"truncated":false,"authors":[{"name":"liaohuanyu","title":"Maintainer of ReactNote","url":"https://github.com/BUPTlhuanyu","imageURL":"https://github.com/BUPTlhuanyu.png","key":"lhuanyu"}],"frontMatter":{"slug":"blog-post","title":"AOP design-pattern in javascript","authors":"lhuanyu","tags":["design-pattern"]},"prevItem":{"title":"koa code analyse","permalink":"/ReactNote/blog/blog-post"}},"content":"- [x] [\u7b80\u4ecb](https://github.com/chenshenhai/koajs-design-note/blob/master/note/chapter02/01.md)\\r\\n- [x] [\u7528AOP\u6539\u5584javascript\u4ee3\u7801](http://www.alloyteam.com/2013/08/yong-aop-gai-shan-javascript-dai-ma/)\\r\\n\\r\\n\\r\\n## \u9762\u5411\u5207\u9762\u7f16\u7a0b\uff08AOP\uff09\u7b80\u4ecb\\r\\n\u8be5\u6587\u4e2d\u4e00\u4e2a\u91cd\u8981\u7684\u542f\u53d1\u662f\u5229\u7528\u51fd\u6570\u66ff\u6362\u7684\u65b9\u5f0f\u6765\u5b9e\u73b0AOP(\u5f53\u7136\u8fd9\u6837\u5e76\u4e0d\u662f\u6700\u597d\u7684\uff0c\u4e0b\u9762\u6587\u7ae0\u4f1a\u8bf4\u5230)\uff0c\u4f8b\u5b50\uff1a\\r\\n\\r\\n\u66ff\u6362\u65b9\u6cd5\\r\\n```\\r\\nvar origDoSomething = thing.doSomething;\\r\\n// Method replacement is a simple form of AOP\\r\\nthing.doSomething = function() {\\r\\n    doSomethingElseFirst();\\r\\n    return origDoSomething.apply(this, arguments);\\r\\n}\\r\\n```\\r\\n\\r\\n\u66ff\u6362\u539f\u578b\\r\\n\\r\\n```\\r\\nvar origDoSomething = Thing.prototype.doSomething;\\r\\nThing.prototype.doSomething = function() {\\r\\n    var start = Date.now();\\r\\n    var result = origDoSomething.apply(this, arguments);\\r\\n    console.log((Date.now() - start) + \'ms\', x, y, result);\\r\\n    return result;\\r\\n}\\r\\n```\\r\\n\u4e0a\u9762\u7684\u65b9\u5f0f\u4e5f\u88ab\u79f0\u4e3a [Monkey patching](https://www.audero.it/blog/2016/12/05/monkey-patching-javascript/)\uff0c\u8fd9\u79cd\u65b9\u5f0f\u901a\u5e38\u7528\u4e8e polyfill \u6d4f\u89c8\u5668\u5df2\u6709\u7684\u65b9\u6cd5\u3002\\r\\n\\r\\n\\r\\n## \u7528AOP\u6539\u5584javascript\u4ee3\u7801\\r\\n\u5b9e\u73b0AOP\u53ef\u4ee5\u7528\u4e0a\u6587\u4e2d\u7684\u66ff\u6362\u65b9\u5f0f\uff0c\u4f46\u662f\u8fd9\u6837\u4f1a\u51fa\u73b0\u4e00\u4e9b\u95ee\u9898\uff1a\\r\\n> \u591a\u4e86\u4e00\u4e2a\u8ba8\u538c\u7684\u4e2d\u95f4\u53d8\u91cf\u6bd4\u5982`origDoSomething`, \u6765\u7ba1\u7406\u5b83\u4e5f\u8981\u82b1\u8d39\u4e00\u4e9b\u989d\u5916\u7684\u6210\u672c.\\r\\n\\r\\n\u8be5\u6587\u7ed9\u51fa\u4e86\u4e24\u4e2a\u5178\u578b\u7684\u5207\u9762\u51fd\u6570\uff0c\u5229\u7528\u8fd9\u4e9b\u5207\u9762\u51fd\u6570\u7ed3\u5408\u5404\u79cd\u8bbe\u8ba1\u6a21\u5f0f\u53ef\u4ee5\u5b9e\u73b0\u65e0\u4fb5\u5165\u5f0f\u7f16\u7a0b\u3002\\r\\n\\r\\n#### \u5207\u9762\u51fd\u6570before\\r\\n\\r\\n```\\r\\nFunction.prototype.before = function( func ){\\r\\n    var __self = this;\\r\\n    return function(){\\r\\n        if( func.apply( this, arguments ) === false ){\\r\\n            return false;\\r\\n        }\\r\\n        return __self.apply( this, arguments );\\r\\n    }\\r\\n}\\r\\n```\\r\\n\u8fd9\u6837\u7684\u51fd\u6570\u8c03\u7528\u7684\u65b9\u6cd5\u5982\u4e0b\uff1a\\r\\n\\r\\n```\\r\\nvar a = function(){\\r\\n    console.log(\'1\')\\r\\n}\\r\\n\\r\\na.before( function(){\\r\\n    return false\\r\\n} )()\\r\\n```\\r\\n**\u539f\u7406\u5206\u6790**\uff1a\u5c06\u9700\u8981\u589e\u52a0\u529f\u80fd\u7684\u51fd\u6570\u79f0\u4e3a\u539f\u51fd\u6570\uff0c\u539f\u51fd\u6570\u8fd9\u4e2a\u5bf9\u8c61\u8c03\u7528\u539f\u578b\u94fe\u4e0a\u7684`before`\u65b9\u6cd5\uff0c\u8be5\u65b9\u6cd5\u63a5\u6536\u4e00\u4e2a\u51fd\u6570\u4f5c\u4e3a\u53c2\u6570`func`\uff0c\u8fd9\u4e2a\u51fd\u6570\u4f1a\u5728\u539f\u51fd\u6570\u4e4b\u524d\u8c03\u7528\u3002`before`\u65b9\u6cd5\u7684\u539f\u7406\u662f\uff1a\u5c06\u6307\u5411\u539f\u51fd\u6570\u5bf9\u8c61\u7684`this`\u4fdd\u5b58\u5230\u5185\u90e8\u53d8\u91cf`__self`\u4e2d\uff0c\u7136\u540e\u8fd4\u56de\u4e00\u4e2a\u95ed\u5305\u51fd\u6570\uff0c\u8fd9\u4e2a\u51fd\u6570\u4f1a\u5148\u8c03\u7528`func`,\u5982\u679c`func`\u8fd4\u56de\u7684\u7ed3\u679c\u4e0d\u6ee1\u8db3\u67d0\u4e9b\u6761\u4ef6\u5c31\u4e0d\u518d\u6267\u884c\u539f\u51fd\u6570,\u5982\u679c\u6ee1\u8db3\u5219\u5728\u95ed\u5305\u6240\u5728\u4e0a\u4e0b\u6587\u4e2d\u6267\u884c\u539f\u51fd\u6570\u4e5f\u5c31\u662f`__self`\u6307\u5411\u7684\u51fd\u6570\u3002\\r\\n\\r\\n#### \u5207\u9762\u51fd\u6570after\\r\\n\\r\\n```\\r\\nFunction.prototype.after = function( func ){\\r\\n    var __self = this;\\r\\n    return function(){\\r\\n        var ret = __self.apply( this, arguments );\\r\\n        if( ret === false ){\\r\\n            return false;\\r\\n        }\\r\\n        func.apply( this, arguments )\\r\\n        return ret;\\r\\n    }\\r\\n}\\r\\n```\\r\\n\u8fd9\u91cc\u548cbefore\u539f\u7406\u4e00\u6837\uff0c\u53ea\u662f\u4f1a\u5bf9\u539f\u51fd\u6570\u7684\u6267\u884c\u7ed3\u679c\u8fdb\u884c\u62e6\u622a\uff0c\u901a\u8fc7\u67d0\u4e9b\u5224\u65ad\u903b\u8f91\u6765\u51b3\u5b9a\u662f\u5426\u6267\u884cafter\u6ce8\u5165\u7684\u51fd\u6570\u4ee5\u53ca\u8fd4\u56de\u539f\u51fd\u6570\u7ed3\u679c\u3002\\r\\n\\r\\n### \u5c0f\u7ed3\\r\\n\u4e0a\u9762\u63d0\u5230\u4e86\u4e24\u79cd\u5b9e\u73b0 AOP \u7684\u65b9\u5f0f\uff0c\u6211\u4eec\u7a0d\u5fae\u603b\u7ed3\u4e00\u4e0b\u9002\u7528\u573a\u666f\uff1a\\r\\n1. \u7b2c\u4e00\u79cd\u65b9\u6cd5\u9002\u7528\u4e8e\u4f60\u786e\u5b9e\u60f3\u4fee\u6539\u7b2c\u4e09\u65b9\u5e93\u67d0\u4e2a\u51fd\u6570\u7684\u884c\u4e3a\uff0c\u65e0\u8bba\u662f\u4f60\u4e3b\u52a8\u8c03\u7528\u8be5\u65b9\u6cd5\u8fd8\u662f\u5e93\u672c\u8eab\u6216\u8005\u5176\u4ed6\u7684\u4f9d\u8d56\u4e5f\u8c03\u7528\u4e86\u8be5\u65b9\u6cd5\uff0c\u4f60\u6dfb\u52a0\u7684\u989d\u5916\u64cd\u4f5c\u90fd\u751f\u6548\u3002\u6bd4\u5982 san-devtools \u4e2d\u5b9e\u73b0\u65f6\u95f4\u65c5\u884c\u7684\u65b9\u5f0f\u3002\\r\\n2. \u7b2c\u4e8c\u79cd\u65b9\u6cd5\u53ea\u4f1a\u5728\u4f60\u4e3b\u52a8\u8c03\u7528 \u7c7b\u4f3c before \u7684 AOP \u51fd\u6570\u7684\u65f6\u5019\u4f1a\u751f\u6548\u3002"}]}')}}]);