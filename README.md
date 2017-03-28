# node_require
node_require，简易实现原理。

为了更好的理解 Node.js 的 require 实现机制，我实现了一个简易的版本。我们node index.js的时候就是require('./index.js')，话不多说我们直接上代码：
 - 目录
  - index.js
  - a.js
  - b.js
  - c.js

# index.js
```
'use strict'

function $require(filepath) {
    const fs = require('fs');
    const filename = __dirname + '/' + filepath; //引入的路径
    let code = fs.readFileSync(filename, 'utf8');
    //定义容器
    let module = {
        exports: {}
    };
    let exports = module.exports;
    //代码拼接
    code = '(function($require, module, exports, __dirname, filename) {' +
        code +
        '})($require, module, exports, __dirname, filename);'
    //执行代码
    eval(code);
    //返回模块
    return module.exports;
}

const log = $require('a.js')
log.loga();
log.logb();
$require('c.js').logc();
```
# a.js
```
'use strict'
const b = $require('b.js');
module.exports.loga = function() {
    console.log('我是a');
}
module.exports.logb = b;

```
# b.js
```
'use strict'

module.exports = function() {
    console.log('我是a->b');
}

```
# c.js
```
'use strict'
module.exports.logc = function() {
    console.log('我是c');
}

```

我们运行：试一下 node index,js 输出如下：

```
我是a
我是a->b
我是c
```
---
现在我们的require 不带缓存，每一次都会读取文件，所以我们key value 形式缓存。

index.js修改如下：

```
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

```
输出如下：

```
我是c
c.js：缓存了
我是c
```

//具体源码分析<br>
alinode：https://alinode.aliyun.com/blog/35





