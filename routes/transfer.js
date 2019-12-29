const router = require('koa-router')();

const TransgerService = require("../service/TransgerService");

router.prefix('/transfer');
router.post("/upload", TransgerService.upload(ctx, next));