'use strict';

var normalize = require('path').normalize;

module.exports = normalizePath;

function normalizePath(opts) {
    opts = opts || {};

    if (opts.defer !== false) {
        opts.defer = opts.defer || true;
    }

    if (opts.chained !== false) {
        opts.chained = opts.chained || true;
    }

    return function* (next) {
        if (opts.defer) {
            yield next;
        }

        var path;

        // We have already done a redirect and we will continue if we are in chained mode
        if (opts.chained && this.status === 301) {
            path = getPath(this.response.get('Location'), this.querystring);
        } else if (this.status !== 301) {
            path = getPath(this.originalUrl, this.querystring);
        }

        if (path) {
            var normalizedPath = normalize(path);
            if (path !== normalizedPath) {
                var query = this.querystring.length ? '?' + this.querystring : '';

                this.status = 301;
                this.redirect(normalizedPath + query);
            }
        }

        if (!opts.defer) {
            yield next;
        }
    };
}

function getPath(original, querystring) {
    if (querystring.length) {
        return original.slice(0, -querystring.length - 1);
    }

    return original;
}
