const log4js = require('log4js');
const logsConfig = require('../config/logs.js');
//加载配置文件
log4js.configure(logsConfig);
//调用预先定义的日志名称
const resLogger = log4js.getLogger("resLogger");
const errorLogger = log4js.getLogger("errorLogger");
const handleLogger = log4js.getLogger("handleLogger");

// 格式化日志文本 加上日志头尾和换行方便查看 ==>  普通日志、请求日志、响应日志、操作日志、错误日志
const formatText = {
    info: info => {
        let logText = new String();
        logText += " -- info detail:  " + JSON.stringify(info) + "\n";
        return logText;
    },
    request: (req, resTime) => {
        let logText = new String();
        let method = req.method;
        //访问方法
        logText += "request method: " + method + "\n";
        //请求原始地址
        logText += "request originalUrl:  " + req.originalUrl + "\n";
        //客户端ip
        logText += "request client ip:  " + req.ip + "\n";
        //开始时间
        let startTime;
        //请求参数
        if (method === 'GET') {
            logText += "request query:  " + JSON.stringify(req.query) + "\n";
            // startTime = req.query.requestStartTime;
        } else {
            logText += "request body: " + JSON.stringify(req.body) + "\n";
            // startTime = req.body.requestStartTime;
        }
        //服务器响应时间
        logText += "response time: " + resTime + "\n";
        return logText;
    },
    response: (ctx, resTime) => {
        let logText = new String();
        //响应日志开始
        logText += "\n" + "*************** response log start ***************" + "\n";
        //添加请求日志
        logText += formatText.request(ctx.request, resTime);
        //响应状态码
        logText += "response status: " + ctx.status + "\n";
        //响应内容
        logText += "response body: " + JSON.stringify(ctx.body) + "\n";
        //响应日志结束
        logText += "*************** response log end ***************" + "\n";
        return logText;
    },
    handle: info => {
        let logText = new String();
        //响应日志开始
        logText += "\n" + "***************info log start ***************" + "\n";
        //响应内容
        logText += "handle info detail: " + JSON.stringify(info).replace(/\\n/g, "\n") + "\n";
        //响应日志结束
        logText += "*************** info log end ***************" + "\n";
        return logText;
    },
    error: (ctx, err, resTime) => {
        let logText = new String();
        //错误信息开始
        logText += "\n" + "*************** error log start ***************" + "\n";
        //添加请求日志
        logText += formatText.request(ctx.request, resTime);
        //错误名称
        logText += "err name: " + err.name + "\n";
        //错误信息
        logText += "err message: " + err.message + "\n";
        //错误详情
        logText += "err stack: " + err.stack + "\n";
        //错误信息结束
        logText += "*************** error log end ***************" + "\n";
        return logText;
    }
}

module.exports = {
    //封装普通日志
    info: info => {
        if (info) handleLogger.info(formatText.info(info));
    },
    //封装响应日志
    response: (ctx, resTime) => {
        if (ctx) resLogger.info(formatText.response(ctx, resTime));
    },
    //封装操作日志
    handle: (res) => {
        if (res) handleLogger.info(formatText.handle(res));
    },
    //封装错误日志
    err: (ctx, error, resTime) => {
        if (ctx && error) errorLogger.error(formatText.error(ctx, error, resTime));
    }
};