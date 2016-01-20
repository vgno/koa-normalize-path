# koa-normalize-path

Koa middleware that normalizes paths.

[![Build Status](https://img.shields.io/travis/vgno/koa-normalize-path/master.svg?style=flat-square)](http://travis-ci.org/vgno/koa-normalize-path) [![Coverage Status](https://img.shields.io/coveralls/vgno/koa-normalize-path/master.svg?style=flat-square)](https://coveralls.io/r/vgno/koa-normalize-path) [![npm](https://img.shields.io/npm/v/koa-normalize-path.svg?style=flat-square)](https://www.npmjs.com/package/koa-normalize-path)

## Installation
```
npm install koa-normalize-path
```

## API
```js
var koa = require('koa');
var app = koa();
app.use(require('koa-normalize-path')(opts));
```

* `opts` options object.

### Options

- `defer` - If true, serves after yield next, allowing any downstream middleware to respond first. Defaults to `true`.
- `chained` - If the middleware should continue modifying the url if it detects that a redirect already have been performed. Defaults to `true`.

## Example
```js
var koa = require('koa');
var normalizePath = require('koa-normalize-path');

var app = koa();

app.use(normalizePath());

app.use(function *(){
  this.body = 'Hello World';
});

app.listen(3000);
```

## Important
When used together with [koa-static](https://github.com/koajs/static) it might be a good idea to set `defer` to `true` for `koa-static` and false for `koa-normalize-path`. This to avoid a potential problem that will result in an error being thrown stating the path is malicious if it starts with multiple slashes. https://github.com/koajs/send/issues/51

## License
MIT
