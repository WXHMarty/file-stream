const fs = require("fs");

async function upload(ctx, next) {
    const files = ctx.request.files.file;
    files.forEach(file => {
        // 创建可读流
        const reader = fs.createReadStream(file.path);
        // 获取上传文件扩展名
        let filePath = path.join(__dirname, 'public/upload/') + `/${file.name}`;
        // 创建可写流
        const upStream = fs.createWriteStream(filePath);
        // 可读流通过管道写入可写流
        reader.pipe(upStream);
    });
    // for (let file of files) {
    //     // 创建可读流
    //     const reader = fs.createReadStream(file.path);  
    //     // 获取上传文件扩展名
    //     let filePath = path.join(__dirname, 'public/upload/') + `/${file.name}`;
    //     // 创建可写流
    //     const upStream = fs.createWriteStream(filePath);
    //     // 可读流通过管道写入可写流
    //     reader.pipe(upStream);
    // }
    return ctx.body = "上传成功！";
}

module.exports = { upload };