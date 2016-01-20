'use strict';

var expect = require('expect');
var normalizePath = require('../index.js');

describe('koa-normalize-path', function() {
    describe('defer = false', function() {
        it('should redirect on url and path has to many slashes', function() {
            var mock = createMock('////foo////');
            var normalizePathMock = normalizePath({defer: false}).bind(mock.this);
            var normalizePathMockGenerator = normalizePathMock();
            normalizePathMockGenerator.next();
            expect(mock.redirectMock.calls[0].arguments[0]).toEqual('/foo/');
            expect(mock.this.status).toBe(301);
        });
    });

    describe('chained = false', function() {
        it('should not redirect on url that already have been modified', function() {
            var mock = createMock('/fOo////');

            // Mock that something has made a redirect before us
            mock.this.status = 301;
            mock.this.body = 'Redirecting to …';
            mock.this.response = {
                get: function() {
                    return '/foo////';
                }
            };

            var normalizePathMock = normalizePath({chained: false}).bind(mock.this);
            var normalizePathMockGenerator = normalizePathMock();
            normalizePathMockGenerator.next();
            normalizePathMockGenerator.next();
            expect(mock.redirectMock).toNotHaveBeenCalled();
            expect(mock.this.status).toBe(301);
        });
    });

    describe('chained = true & defer = true', function() {
        describe('redirect', function() {
            it('should redirect on url that already have been modified and path has to many slashes', function() {
                var mock = createMock('/fOo///');

                // Mock that something has made a redirect before us
                mock.this.status = 301;
                mock.this.body = 'Redirecting to …';
                mock.this.response = {
                    get: function() {
                        return '/foo///';
                    }
                };

                var normalizePathMock = normalizePath().bind(mock.this);
                var normalizePathMockGenerator = normalizePathMock();
                normalizePathMockGenerator.next();
                normalizePathMockGenerator.next();
                expect(mock.redirectMock.calls[0].arguments[0]).toEqual('/foo/');
                expect(mock.this.status).toBe(301);
            });

            it('should redirect on url and path have to many slashes', function() {
                var mock = createMock('//foo/');
                var normalizePathMock = normalizePath().bind(mock.this);
                var normalizePathMockGenerator = normalizePathMock();
                normalizePathMockGenerator.next();
                normalizePathMockGenerator.next();
                expect(mock.redirectMock.calls[0].arguments[0]).toEqual('/foo/');
                expect(mock.this.status).toBe(301);
            });

            it('should redirect on url and path has to many slashes with query', function() {
                var mock = createMock('///foo?hello=wOrld', 'hello=wOrld');
                var normalizePathMock = normalizePath().bind(mock.this);
                var normalizePathMockGenerator = normalizePathMock();
                normalizePathMockGenerator.next();
                normalizePathMockGenerator.next();
                expect(mock.redirectMock.calls[0].arguments[0]).toEqual('/foo?hello=wOrld');
                expect(mock.this.status).toBe(301);
            });

            it('should redirect on UTF-8 url and path has to many slashes', function() {
                var mock = createMock('/fØö//////БАЯ');
                var normalizePathMock = normalizePath().bind(mock.this);
                var normalizePathMockGenerator = normalizePathMock();
                normalizePathMockGenerator.next();
                normalizePathMockGenerator.next();
                expect(mock.redirectMock.calls[0].arguments[0]).toEqual('/fØö/БАЯ');
                expect(mock.this.status).toBe(301);
            });
        });

        describe('not redirect', function() {
            it('should not redirect on urland path have correct amount of slashes', function() {
                var mock = createMock('/foo');
                var normalizePathMock = normalizePath().bind(mock.this);
                var normalizePathMockGenerator = normalizePathMock();
                normalizePathMockGenerator.next();
                normalizePathMockGenerator.next();
                expect(mock.redirectMock).toNotHaveBeenCalled();
                expect(mock.this.status).toBe(undefined);
            });

            it('should not redirect on url and path have correct amount of slashes', function() {
                var mock = createMock('/foo/?hello=wOrld', 'hello=wOrld');
                var normalizePathMock = normalizePath().bind(mock.this);
                var normalizePathMockGenerator = normalizePathMock();
                normalizePathMockGenerator.next();
                normalizePathMockGenerator.next();
                expect(mock.redirectMock).toNotHaveBeenCalled();
                expect(mock.this.status).toBe(undefined);
            });
        });
    });
});

function createMock(originalUrl, querystring) {
    querystring = querystring || '';
    var redirectMock = expect.createSpy();
    return {
        redirectMock: redirectMock,
        this: {
            originalUrl: originalUrl,
            querystring: querystring,
            status: undefined,
            redirect: redirectMock
        }
    };
}
