'use strict'

function $require(filepath) {
    const fs = require('fs');
    const filename = __dirname + '/' + filepath; //引入的路径

    //缓存
    $require.cache = $require.cache || {};
    if ($require.cache[filename]) {
        console.log(filepath + '：缓存了')
        return $require.cache[filename].exports;
    }
    let code = fs.readFileSync(filename, 'utf8');
    //定义容器
    let module = {
        exports: {}
    };
    let exports = module.exports;
    //代码拼接
    code = '(function($require, module, exports, __dirname, __filename) {' +
        code +
        '})($require, module, exports, __dirname, filename);'
    //执行代码
    eval(code);
    //缓存
    $require.cache[filename] = module;

    //返回模块
    return module.exports;
}

$require('c.js').logc();
$require('c.js').logc();
