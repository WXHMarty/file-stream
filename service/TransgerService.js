const fs = require("fs");
const path = require("path");

const filePathPre = require("../config/application.json").filePathPre;
const logger = require("../utils/logs");

async function upload(ctx, next) {
    let { fPath } = ctx.request.body;
    if (/^\/.*/.test(fPath)) return ctx.body = { status: "failed", message: "Illegal fPath" };
    let parentPath = `${filePathPre}${fPath}`;
    logger.info(`upload file to ${parentPath}`);
    if (!fs.existsSync(parentPath)) fs.mkdirSync(parentPath);
    const file = ctx.request.files.file;
    // 创建可读流
    const reader = fs.createReadStream(file.path);
    // 获取上传文件扩展名
    let filePath = `${parentPath}/${file.name}`;
    // 创建可写流
    const upStream = fs.createWriteStream(filePath);
    // 可读流通过管道写入可写流
    await reader.pipe(upStream);
    return ctx.body = { status: "success", message: "上传成功！" };
}

module.exports = { upload };