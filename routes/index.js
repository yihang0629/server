const controller = require('../controller/dbServer')

module.exports = function(app){
    // test
    app.get('/test', (req,res) => {
        res.type('html')
        res.render('test')
    })

    // 给帖子post数据表新增数据项 
    app.post('/insertWall', (req, res) => {
        controller.insertWall(req, res)
    })

    // 新增 反馈 
    app.post('/insertFeedback', (req, res) => {
        controller.insertFeedback(req, res)
    })
    // 新增 图片反馈 
    app.post('/insertphotoFeedback', (req, res) => {
        controller.insertphotoFeedback(req, res)
    })

    // 新增 post 的评论
    app.post('/insertComment', (req, res) => {
        controller.insertComment(req, res)
    })


  


    // 删除 知识帖
    app.post('/deleteWall', (req, res) => {
        controller.deleteWall(req, res)
    })

    // 删除 反馈
    app.post('/deleteFeedback', (req, res) => {
        controller.deleteFeedback(req, res)
    })

    // 删除 评论
    app.post('/deleteComment', (req, res) => {
        controller.deleteComment(req, res)
    })

    // 分页查询 知识贴 pagesize表示一页有多少条 page表示当前是那一页
    app.post('/findWallPage', (req, res) => {
        controller.findWallPage(req, res)
    })

    // 分页查询 某个帖子的评论
    app.post('/findCommentPage', (req, res) => {
        controller.findCommentPage(req, res)
    })

    // 用户进入进行ip登记
    app.post('/signIP', (req,res) => {
        var ip = req.ip;

        res.send({
            code:200,
            ip: ip
        })
    })

    // 新增图片
    app.post('/insertPhoto', (req, res) => {
        controller.insertPhoto(req, res)
    })
    
    // 删除 图片
    app.post('/deletePhoto', (req, res) => {
        controller.deletePhoto(req, res)
    })
    // 新增图片评论
    app.post('/insertPhotoComment', (req, res) => {
        controller.insertPhotoComment(req, res)
    })
    // 分页查询图片，获取 点赞，举报，撤销的数据
    app.post('/findPhotoPage', (req, res) => {
        controller.findPhotoPage(req, res)
    })
    // 分页查询 某个图片的评论
    app.post('/findPhotoCommentPage', (req, res) => {
        controller.findPhotoCommentPage(req, res)
    })

    // 分页查询用户列表
    app.post('/findUserPage', (req, res) => {
        controller.findUserPage(req, res)
    })

    // 更新用户状态
    app.post('/updateUserStatus', (req, res) => {
        controller.updateUserStatus(req, res)
    })
}