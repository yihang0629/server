// db是数据库连接对象
const db = require('../lib/db')

// 新增 知识贴
exports.insertWall = async(req, res) => {
    // 用data接受前端发来的数据
    let data = req.body;
    // console.log(data);

    await db.insertWall([data.type, data.message, data.name, data.userId, data.moment, data.label])
        .then(result => {
            res.send({
                code:200,
                message:result,
            })
        })
}



// 新增反馈
exports.insertFeedback = async(req, res) => {
    let data = req.body;

    await db.insertFeedback([data.type, data.postId, data.userId, data.moment])
        .then(result => {
            res.send({
                code:200,
                message:result,
            })
        })
}
// 新增 图片反馈
exports.insertphotoFeedback = async(req, res) => {
    let data = req.body;

    await db.insertphotoFeedback([data.type, data.photoId, data.userId, data.moment])
        .then(result => {
            res.send({
                code:200,
                message:result,
            })
        })
}

// 新增 评论
exports.insertComment = async(req, res) => {
    let data = req.body;

    await db.insertComment([data.postId, data.userId, data.moment, data.imgurl, data.comment, data.name])
        .then(result => {
            res.send({
                code:200,
                message:result,
            })
        })
}

// 新增 注册用户
exports.regUser = async(req, res) => {
    let data = req.body;

    await db.regUser([data.username, data.password])
        .then(result => {
            res.send({
                code:200,
                message:result,
            })
        })
}
exports.login = async(req, res) => {
    let data = req.body;

    await db.findUser(data.username, data.password)
        .then(result => {
            res.send({
                code:200,
                message:result,
            })
        })
}

// 删除 知识贴
exports.deleteWall = async(req, res) => {
    let data = req.body;

    await db.deleteWall(data.id)
        .then(result => {
            res.send({
                code:200,
                message:result,
            })
        })
}
// 删除 图片
exports.deleteWall = async(req, res) => {
    let data = req.body;

    await db.deleteWall(data.id)
        .then(result => {
            res.send({
                code:200,
                message:result,
            })
        })
}

// 删除 图片
exports.deletePhoto = async(req, res) => {
    let data = req.body;

    await db.deletePhoto(data.id)
        .then(result => {
            res.send({
                code:200,
                message:result,
            })
        })
}

// 删除 反馈
exports.deleteFeedback = async(req, res) => {
    let data = req.body;

    await db.deleteFeedback(data.id)
        .then(result => {
            res.send({
                code:200,
                message:result,
            })
        })
}

// 删除 评论
exports.deleteComment = async(req, res) => {
    let data = req.body;

    await db.deleteComment(data.id)
        .then(result => {
            res.send({
                code:200,
                message:result,
            })
        })
}

// 分页查询帖子，获取 点赞，举报，撤销的数据
exports.findWallPage = async (req, res) => {
    let data = req.body
    await db.findWallPage(data.page, data.pagesize, data.type, data.label)
        .then(async result => {
            for(let i = 0; i < result.length; i ++){
                // 喜欢数
                result[i].like = await db.feedbackCount(result[i].id, 0)
                // 举报数
                result[i].report = await db.feedbackCount(result[i].id, 1)
                // 要求撤销数
                result[i].revoke = await db.feedbackCount(result[i].id, 2)
                // 是否点赞
                result[i].islike = await db.likeCount(result[i].id, data.userId)
                // 评论数
                result[i].comcount = await db.commentCount(result[i].id)
            }

            res.send({
                code:200,
                message:result,
            })
        }) 
}

// 分页查询 某个帖子的评论
exports.findCommentPage = async(req, res) => {
    let data = req.body;

    await db.findCommentPage(data.page,data.pagesize,data.id)
        .then(result => {
            res.send({
                code:200,
                message:result,
            })
        })
}


// 新增 图片
exports.insertPhoto = async(req, res) => {
    let data = req.body;

    await db.insertPhoto([data.type, data.imgurl, data.title, data.label])
        .then(result => {
            res.send({
                code:200,
                message:result,
            })
        })
}

// 新增 图片评论
exports.insertPhotoComment = async(req, res) => {
    let data = req.body;

    await db.insertPhotoComment([data.photoId, data.userId, data.moment, data.imgurl, data.comment, data.name])
        .then(result => {
            res.send({
                code:200,
                message:result,
            })
        })
}

// 分页查询图片，获取 点赞，举报，撤销的数据
exports.findPhotoPage = async (req, res) => {
    let data = req.body
    await db.findPhotoPage(data.page, data.pagesize, data.type, data.label)
        .then(async result => {
            for(let i = 0; i < result.length; i ++){
                // 喜欢数
                result[i].like = await db.photofeedbackCount(result[i].id, 0)
                // 举报数
                result[i].report = await db.photofeedbackCount(result[i].id, 1)
                // 要求撤销数
                result[i].revoke = await db.photofeedbackCount(result[i].id, 2)
                // 是否点赞
                result[i].islike = await db.photolikeCount(result[i].id, data.userId)
                // 评论数
                result[i].comcount = await db.photocommentCount(result[i].id)
            }

            res.send({
                code:200,
                message:result,
            })
        }) 
}

// 分页查询 某个图片的评论
exports.findPhotoCommentPage = async(req, res) => {
    let data = req.body;

    await db.findPhotoCommentPage(data.page,data.pagesize,data.id)
        .then(result => {
            res.send({
                code:200,
                message:result,
            })
        })
}