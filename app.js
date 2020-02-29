const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const body = require('koa-body');

const index = require('./routes/index');
const users = require('./routes/users');
const transfer = require('./routes/transfer');
const logsUtil = require('./utils/logs.js');

// error handler
onerror(app);

// middlewares
app.use(body({
    // 支持文件格式
    multipart: true,
    formidable: {
        // 保留文件扩展名
        keepExtensions: true,
        maxFileSize: 10 * 1024 * 1024 * 1024
    }
}));
app.use(json());
// app.use(logger());
app.use(require('koa-static')(__dirname + '/public'));

app.use(views(__dirname + '/views', { extension: 'pug' }));

// logger
app.use(async(ctx, next) => {
    // const start = new Date();
    // await next();
    // const ms = new Date() - start;
    // console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);

    const start = new Date();
    let intervals;
    try {
        await next();
        intervals = new Date() - start;
        logsUtil.response(ctx, intervals);
    } catch (error) {
        intervals = new Date() - start;
        logsUtil.err(ctx, error, intervals);
    }
});

// routes
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());
app.use(transfer.routes(), transfer.allowedMethods());

// error-handling
app.on('error', (err, ctx) => logsUtil.err(ctx, error, ""));

module.exports = app;