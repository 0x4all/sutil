var fs = require("fs");
var path = require("path");
var crypto = require("crypto");
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


/**
 * 1.执行 next(),后续handler继续执行
 * 2.执行 next(err),后续不再执行，就进入 errhandler
 * 3.只要不执行next，后续也不再执行
 */
sutil.foreachhandler = function(arr, req, errhandler) {
    if(!(arr instanceof Array)) {
        throw new Error("arr is not Array");
        return;
    }
    if(!(errhandler && typeof errhandler == "function")) {
        throw new Error("errhandler is not function");
        return;
    }
    var i = 0;
    var n = arr.length;
    var next = function(err) {
        if(err) {
            errhandler(err);
            return;
        }
        if(i < n) {
            var handler = arr[i++];
            if(!!handler && typeof handler === "function") {
                handler(req, next);
            }
            else {
                console.warn("array index:",i-1," is not function. ignored.")
            }
        }
        else if(i == n){
            errhandler(null, req);
            return;
        }
    }
    next();
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

sutil.md5 = function(content) {
    var c = crypto.createHash("md5");
    c.update(content);
    return c.digest('hex');
};

    
/**
 * to base64
 * @param {String} content 
 */
sutil.base64t = function(content){
	return new Buffer(content).toString('base64');
}

/**
 * from base64
 * @param {String} content 
 */
sutil.base64f = function(content){
	return new Buffer(content, 'base64').toString();
}

    
sutil.safecall = function(cb){
    if (typeof cb === 'function') {
        var len = arguments.length;
        if(len == 1) {
            return cb();
        }
    
        if(len == 2) {
            return cb(arguments[1]);
        }
    
        if(len == 3) {
            return cb(arguments[1], arguments[2]);
        }
    
        if(len == 4) {
            return cb(arguments[1], arguments[2], arguments[3]);
        }
    
        var args = Array(len - 1);
        for (i = 1; i < len; i++){
            args[i - 1] = arguments[i];
        }
        cb.apply(null, args);
    }
};

var _rootdir = process.cwd();
sutil.rootdir = function(rootdir) {
    _rootdir = rootdir;
    return sutil;
}
/**
 * 从_rootdir开始计算路径进行require，一般用于配置类文件
 * @param {String} filepath 以根目录为基础的相对目录
 */
sutil.require = function(filepath){
    var p = path.resolve(_rootdir, filepath);
    return require(p);
}


/**
 * 
 * @param  {String} content  content
 * @param  {String|Number} salt salt
 * @param  {String} pwd encrypt password
 * @return {String}     token string
 */
sutil.createtoken = function(content, salt, pwd) {
	var msg = content + '|' + salt;
	var cipher = crypto.createCipher('aes256', pwd);
	var enc = cipher.update(msg, 'utf8', 'hex');
	enc += cipher.final('hex');
	return enc;
};

/**
 * Parse token to validate it and get result array.
 * @param  {String} token token string
 * @param  {String} pwd   decrypt password
 * @return {Array}  
 */
sutil.parsetoken = function(token, pwd) {
	var decipher = crypto.createDecipher('aes256', pwd);
	var dec;
	try {
		dec = decipher.update(token, 'hex', 'utf8');
		dec += decipher.final('utf8');
	} catch(err) {
		console.error('[token] fail to decrypt token. %j', token);
		return null;
	}
	var ts = dec.split('|');
	if(ts.length < 2) {
		// illegal token
		return null;
	}
	return ts;
};

sutil.padding = function(str, len ,padchar){
    if(!str) {
        str='';
    }
    str = str.toString();
    if(!padchar) {
        padchar='0';
    }
    if(!len){
        len = str.length;
    }
    var left = len - str.length;
    for(var i =0; i < left; ++i){
        str = padchar + str;
    }
    return str;
};

var basetime = new Date("2018/01/01").getTime();
/**
 * 
 * @param {Date} date 
 */
sutil.basedate = function(date){
    basetime = date.getTime();
};
/**
 * 自[basedate](默认2018/01/01)日以来的毫秒数
 */
sutil.timenow = function(){
    return Date.now() - basetime;
};

sutil.basetime = function(){
    return basetime;
};

sutil.bitset = require("./bitset");

