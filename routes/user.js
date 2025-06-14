
const controller = require('../controller/dbServer')



module.exports = function(app){
    // 数据验证通过，则调用 user_handler.regUser 处理函数来处理注册请求
    app.post('/regUser',  (req, res) => {
        controller.regUser(req, res)
    })

    app.post('/login', (req, res) => {
        // console.log(req);
        controller.login(req, res)
    })
}