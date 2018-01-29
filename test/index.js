'use strict';

const expect = require('expect');
const normalizePath = require('../');

describe('koa-normalize-path', () => {
    describe('defer = false', () => {
        it('should redirect on url and path has to many slashes', async () => {
            const mock = createMock('////foo////');
            await normalizePath({defer: false})(mock.ctx, mock.next);

            expect(mock.redirectMock.calls[0].arguments[0]).toEqual('/foo/');
            expect(mock.ctx.status).toBe(301);
        });
    });

    describe('chained = false', () => {
        it('should not redirect on url that already have been modified', async () => {
            const mock = createMock('/fOo////');

            // Mock that something has made a redirect before us
            mock.ctx.status = 301;
            mock.ctx.body = 'Redirecting to …';
            mock.ctx.response = {
                get() {
                    return '/foo////';
                }
            };

            await normalizePath({chained: false})(mock.ctx, mock.next);

            expect(mock.redirectMock).toNotHaveBeenCalled();
            expect(mock.ctx.status).toBe(301);
        });
    });

    describe('chained = true & defer = true', () => {
        describe('redirect', () => {
            it('should redirect on url that already have been modified and path has to many slashes', async () => {
                const mock = createMock('/fOo///');

                // Mock that something has made a redirect before us
                mock.ctx.status = 301;
                mock.ctx.body = 'Redirecting to …';
                mock.ctx.response = {
                    get() {
                        return '/foo///';
                    }
                };

                await normalizePath()(mock.ctx, mock.next);

                expect(mock.redirectMock.calls[0].arguments[0]).toEqual('/foo/');
                expect(mock.ctx.status).toBe(301);
            });

            it('should redirect on url and path have to many slashes', async () => {
                const mock = createMock('//foo/');
                await normalizePath()(mock.ctx, mock.next);

                expect(mock.redirectMock.calls[0].arguments[0]).toEqual('/foo/');
                expect(mock.ctx.status).toBe(301);
            });

            it('should redirect on url and path has to many slashes with query', async () => {
                const mock = createMock('///foo?hello=wOrld', 'hello=wOrld');
                await normalizePath()(mock.ctx, mock.next);

                expect(mock.redirectMock.calls[0].arguments[0]).toEqual('/foo?hello=wOrld');
                expect(mock.ctx.status).toBe(301);
            });

            it('should redirect on UTF-8 url and path has to many slashes', async () => {
                const mock = createMock('/fØö//////БАЯ');
                await normalizePath()(mock.ctx, mock.next);

                expect(mock.redirectMock.calls[0].arguments[0]).toEqual('/fØö/БАЯ');
                expect(mock.ctx.status).toBe(301);
            });
        });

        describe('not redirect', () => {
            it('should not redirect on urland path have correct amount of slashes', async () => {
                const mock = createMock('/foo');
                await normalizePath()(mock.ctx, mock.next);

                expect(mock.redirectMock).toNotHaveBeenCalled();
                expect(mock.ctx.status).toBe(undefined);
            });

            it('should not redirect on url and path have correct amount of slashes', async () => {
                const mock = createMock('/foo/?hello=wOrld', 'hello=wOrld');
                await normalizePath()(mock.ctx, mock.next);

                expect(mock.redirectMock).toNotHaveBeenCalled();
                expect(mock.ctx.status).toBe(undefined);
            });
        });
    });
});

function createMock(originalUrl, querystring) {
    querystring = querystring || '';
    const redirectMock = expect.createSpy();
    return {
        redirectMock: redirectMock,
        ctx: {
            originalUrl: originalUrl,
            querystring: querystring,
            status: undefined,
            redirect: redirectMock
        },
        next: async () => {}
    };
}
