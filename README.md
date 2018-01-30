# koa-normalize-path

Koa middleware that normalizes paths.

**Notice: koa-normalize-path@2 supports koa@2; if you want to use this module with koa@1, please use koa-normalize-path@1.**

[![Build Status](https://img.shields.io/travis/vgno/koa-normalize-path/master.svg?style=flat-square)](http://travis-ci.org/vgno/koa-normalize-path) [![Coverage Status](https://img.shields.io/coveralls/vgno/koa-normalize-path/master.svg?style=flat-square)](https://coveralls.io/r/vgno/koa-normalize-path) [![npm](https://img.shields.io/npm/v/koa-normalize-path.svg?style=flat-square)](https://www.npmjs.com/package/koa-normalize-path)

## Installation
```
npm install koa-normalize-path
```

## API
```js
const Koa = require('koa');
const app = new Koa();
app.use(require('koa-normalize-path')(opts));
```

* `opts` options object.

### Options

- `defer` - If true, serves after yield next, allowing any downstream middleware to respond first. Defaults to `true`.
- `chained` - If the middleware should continue modifying the url if it detects that a redirect already have been performed. Defaults to `true`.

## Example
```js
const Koa = require('koa');
const normalizePath = require('koa-normalize-path');

const app = new Koa();

app.use(normalizePath());

app.use(ctx => {
  ctx.body = 'Hello World';
});

app.listen(3000);
```

## Important
When used together with [koa-static](https://github.com/koajs/static) it might be a good idea to set `defer` to `true` for `koa-static` and false for `koa-normalize-path`. This to avoid a potential problem that will result in an error being thrown stating the path is malicious if it starts with multiple slashes. https://github.com/koajs/send/issues/51

## License
MIT
