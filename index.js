var fs = require("fs");
var sutil = {};
module.exports = sutil;


/**
 * 从指定的根目录下遍历子目录dirname
 * 在子目录下找指定的文件,filename.js
 * file = require(filename.js)后
 * 通过func(dirname, file) 执行回调
 * @param {String} rootdir 查询的根目录
 * @param {String} filename 寻找的子目录下的文件名称，不带扩展名
 * @param {function} func 将对应的子目录名称和寻找的文件模块交给func处理
 */
sutil.foreachdir = function(rootdir, filename, func) {
    var dirs = fs.readdirSync(rootdir);
    dirs.forEach((dirname) => {
        var service;
        try {
            service = require(rootdir + "/" + dirname + "/"+ filename +".js");
            func(dirname, service);
        }
        catch(e) {
            // console.warn("load service failed",e.message, dirname);
            return;
        }
    })
}

//设置跨域访问
sutil.crossdomain = function(app) {
    app.all('*', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
        res.header("X-Powered-By",'3.1.4');
        res.header("Content-Type", "application/json;charset=utf-8");
        next();
    });
}