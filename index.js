const express = require('express');
const path = require('path');
const ejs = require('ejs');
const config = require('./config/default');


const app = express();

// 获取静态路径
app.use(express.static(path.join(__dirname, '/views')));
app.use(express.static(path.join(__dirname, '/dist')));
app.use(express.static(path.join(__dirname, '/data')));

// 设置允许跨域访问该服务器
app.all('*', function(req, res, next) {
    // 允许访问IP *代表所有
    res.header("Access-Control-Allow-Origin", "*");
    // 允许跨域请求携带的请求头
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type");
    // 允许跨域请求携带认证信息（比如 Cookie）
    res.header("Access-Control-Allow-Credentials", true);
    // 允许跨域请求的方法
    res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
    // 自定义响应头，表示服务器的版本信息
    res.header("X-Power-By", '3.2.1');
    res.header('Content-Type', "application/json;charset=utf-8");

    if (req.method == 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// 用于设置 Express 应用使用 ejs 模板引擎来渲染 HTML 文件
// 告诉 Express 使用 ejs 模板引擎来处理后缀名为 .html 的文件。
// ejs.__express 是 ejs 模板引擎提供的一个函数，用于处理模板文件。
app.engine('html', ejs.__express);
// 告诉 Express 使用 HTML 文件作为视图模板。
// 它将模板引擎设置为 'html'，表示要渲染的模板文件的后缀名是 .html。
app.set('view engine', 'html');

// 解析前端数据
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// 通过以上配置，Express 应用可以正确地解析请求主体中的 JSON 数据和 URL 编码数据，并将其放在 req.body 中供后续处理使用



// 引入路由
require('./routes/index')(app);
require('./routes/files')(app);
require('./routes/user')(app);


app.listen(config.port, () => {
    console.log(`启动端口${config.port}`);
});
