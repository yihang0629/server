const mysql = require('mysql')
const config = require('../config/default')

// 方法一：直接连接(createConnection)
const db = mysql.createConnection({
    host:config.database.HOST,
    user:config.database.USER,
    password:config.database.PASSWORD,
    // // 连接 MySQL 时，可以通过在连接字符串中添加 authPlugin 参数来指定使用旧的认证方式
    // authPlugin: 'mysql_native_password'
})

// 实际使用的是连接池方式 createPool
// 方法二：连接指定数据库 
const pool = mysql.createPool({
    host:config.database.HOST,
    user:config.database.USER,
    password:config.database.PASSWORD,
    database:config.database.WALL,
})

// 方法一：直接使用db.query
let bdbs = (sql, values) => {
    return new Promise((resolve, reject) => {
        db.query(sql,values,(err, result) => {
            if(err){
                reject(err)
            }else{
                resolve(result)
            }
        })
    })  
}

// 方法二：通过pool.getConnection 获取连接
// SQL 注入防护：
// 当前代码使用参数化查询（connection.query(sql, values)），已有效防止 SQL 注入
let query = (sql, values) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if(err){
                reject(err)
            }else{
                connection.query(sql, values,(err,rows) => {
                    if(err){
                        reject(err)
                    }else{
                        resolve(rows)
                    }
                    connection.release()
                })
            }
        })
    })  
}

// 创建数据库
let wall = `create database if not exists wall default charset utf8 collate utf8_general_ci;`

// 执行wall变量的SQL语句，创建一个名为wall数据库
let createDataBase = (db) => {
    return bdbs(db,[])
} 

// 创建 知识贴 数据表
let post = `create table if not exists post(
    id INT NOT NULL AUTO_INCREMENT,
    type INT NOT NULL COMMENT '类型0信息1图片',
    message VARCHAR (1000) COMMENT '留言',
    name VARCHAR (100) NOT NULL COMMENT ' 用户名 ',
    userId VARCHAR (100) NOT NULL comment ' 创建者id ',
    moment VARCHAR (100) NOT NULL COMMENT ' 时间',
    label INT NOT NULL COMMENT '标签',
    PRIMARY KEY ( id )
);`

// 创建 图片 数据表
let photo = `create table if not exists photo(
    id INT NOT NULL AUTO_INCREMENT,
    type INT NOT NULL COMMENT '类型0信息1图片',
    imgurl VARCHAR (100) COMMENT '图片路径',
    title VARCHAR (100) NOT NULL COMMENT ' 图片名 ',
    label INT NOT NULL COMMENT '标签', 
    PRIMARY KEY ( id )
);`

// 反馈
let feedback = `create table if not exists feedback(
    id INT NOT NULL AUTO_INCREMENT,
    type INT NOT NULL COMMENT '反馈类型0喜欢1举报2撤销',
    postId INT NOT NULL COMMENT '帖子id',
    userId VARCHAR (100) NOT NULL comment ' 反馈者id / ip地址 ',
    moment VARCHAR (100) NOT NULL COMMENT ' 时间',
    PRIMARY KEY ( id )
);`
// 图片反馈
let photofeedback = `create table if not exists photofeedback(
    id INT NOT NULL AUTO_INCREMENT,
    type INT NOT NULL COMMENT '反馈类型0喜欢1举报2撤销',
    photoId INT NOT NULL COMMENT '帖子id',
    userId VARCHAR (100) NOT NULL comment ' 反馈者id / ip地址 ',
    moment VARCHAR (100) NOT NULL COMMENT ' 时间',
    PRIMARY KEY ( id )
);`

// 评论
let comment = `create table if not exists comment(
    id INT NOT NULL AUTO_INCREMENT,
    postId INT NOT NULL COMMENT '哪个帖子',
    userId VARCHAR (100) NOT NULL comment '评论者id',
    moment VARCHAR (100) NOT NULL COMMENT ' 评论时间',
    imgurl VARCHAR (100) COMMENT '评论者头像',
    comment VARCHAR (1000) COMMENT '评论内容',
    name VARCHAR (100) NOT NULL COMMENT ' 评论时输入的签名 ',
    PRIMARY KEY ( id )
);`

// 图片评论
let photocomment = `create table if not exists photocomment(
    id INT NOT NULL AUTO_INCREMENT,
    photoId INT NOT NULL COMMENT '哪个图片',
    userId VARCHAR (100) NOT NULL comment '评论者id',
    moment VARCHAR (100) NOT NULL COMMENT ' 评论时间',
    imgurl VARCHAR (100) COMMENT '评论者头像',
    comment VARCHAR (1000) COMMENT '评论内容',
    name VARCHAR (100) NOT NULL COMMENT ' 评论时输入的签名 ',
    PRIMARY KEY ( id )
);`

// 创建 用户 数据表
let user = `create table if not exists user(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE  COMMENT '注册时输入的用户名', 
    nickname VARCHAR(50) DEFAULT '匿名' COMMENT '用户昵称',
    password VARCHAR(100) NOT NULL COMMENT '注册时输入的密码',
    user_pic TEXT COMMENT '用户的头像'
);`



let createTable = (sql) =>{
    return query(sql, [])
}

// 先创建数据库，再创建表
async function create(){
    await createDataBase(wall)
    createTable(post)
    createTable(photo)
    createTable(feedback)
    createTable(photofeedback)
    createTable(comment)
    createTable(photocomment)
    createTable(user)
    
}

create();
// 查询用户信息 实现登录
exports.findUser =async (username,password) => {
    // console.log('aaa');
    let _sql;
    
    _sql = `select id, nickname, user_pic from user where username="${username}" and password="${password}";`
    return query(_sql);
}
// 新增 知识贴
exports.insertWall = (value) => {
    let _sql = "insert into post set type=?,message=?,name=?,userId=?,moment=?,label=?;"
    return query(_sql, value)
}

// 新增 反馈
exports.insertFeedback = (value) => {
    let _sql = "insert into feedback set type=?,postId=?,userId=?,moment=?;"
    return query(_sql, value)
}
// 新增 图片反馈
exports.insertphotoFeedback = (value) => {
    let _sql = "insert into photofeedback set type=?,photoId=?,userId=?,moment=?;"
    return query(_sql, value)
}
// 新增 评论
exports.insertComment = (value) => {
    let _sql = "insert into comment set postId=?,userId=?,moment=?,imgurl=?,comment=?,name=?;"
    return query(_sql, value)
}
// 新增 注册用户
exports.regUser = (value) => {
    let _sql = "insert into user set username=?,password=?;"
    return query(_sql, value)
}



// 删除 知识帖
exports.deleteWall = (id) => {
    let _sql = `delete a,b,c from post a left join feedback b on a.id=b.postId left join comment c on a.id=c.postId where a.id="${id}";`
    return query(_sql)
}

// 删除 图片
exports.deletePhoto = (id) => {
    let _sql = `delete a,b,c from photo a left join photofeedback b on a.id=b.photoId left join photocomment c on a.id=c.photoId where a.id="${id}";`
    return query(_sql)
}

// 删除 反馈
exports.deleteFeedback = (id) => {
    let _sql = `delete from feedback where a.id="${id}";`
    return query(_sql)
}

// 删除 评论
exports.deleteComment = (id) => {
    let _sql = `delete from comment where a.id="${id}";`
    return query(_sql)
}

// 分页查询 知识贴 pagesize表示一页有多少条 page表示当前是那一页
exports.findWallPage = (page, pagesize, type, label) => {
    let _sql;
    if(label == -1){
        _sql = `select * from post where type="${type}" order by id desc limit ${(page - 1) * pagesize},${pagesize};`
    }else{
        _sql = `select * from post where type="${type}" and label="${label}" order by id desc limit ${(page - 1) * pagesize},${pagesize};`
    }
    return query(_sql)
}   

// 分页查询 某个帖子的评论
exports.findCommentPage = (page, pagesize, id) => {
    let _sql = `select * from comment where postId="${id}" order by id desc limit ${(page - 1) * pagesize},${pagesize};`
    return query(_sql)
} 

// 查询 反馈数据
exports.feedbackCount = (postId, type) => {
    let _sql = `select count(*) as count from feedback where postId="${postId}" and type="${type}";`
    return query(_sql)
}

// 查询评论总数
exports.commentCount = (postId) => {
    let _sql = `select count(*) as count from comment where postId="${postId}";`
    return query(_sql)
}

// 是否点赞
exports.likeCount = (postId, uid) => {
    let _sql = `select count(*) as count from feedback where postId="${postId}" and userId="${uid}" and type=0;`
    return query(_sql)
}



// //////////////////////////////////////////////////////////////////////////////////

// 新增 图片
exports.insertPhoto = (value) => {
    let _sql = "insert into photo set type=?,imgurl=?,title=?,label=?;"
    return query(_sql, value)
}

// 新增图片评论
exports.insertPhotoComment = (value) => {
    let _sql = "insert into photocomment set photoId=?,userId=?,moment=?,imgurl=?,comment=?,name=?;"
    return query(_sql, value)
}

// 分页查询图片 pagesize表示一页有多少条 page表示当前是那一页
exports.findPhotoPage = (page, pagesize, type, label) => {
    let _sql;
    if(label == -1){
        _sql = `select * from photo where type="${type}" order by id desc limit ${(page - 1) * pagesize},${pagesize};`
    }else{
        _sql = `select * from photo where type="${type}" and label="${label}" order by id desc limit ${(page - 1) * pagesize},${pagesize};`
    }
    return query(_sql)
}   

// 分页查询 图片的评论
exports.findPhotoCommentPage = (page, pagesize, id) => {
    let _sql = `select * from photocomment where photoId="${id}" order by id desc limit ${(page - 1) * pagesize},${pagesize};`
    return query(_sql)
} 

// 查询 图片反馈数据
exports.photofeedbackCount = (photoId, type) => {
    let _sql = `select count(*) as count from photofeedback where photoId="${photoId}" and type="${type}";`
    return query(_sql)
}

// 查询 图片评论总数
exports.photocommentCount = (photoId) => {
    let _sql = `select count(*) as count from photocomment where photoId="${photoId}";`
    return query(_sql)
}

// 是否点赞某图片
exports.photolikeCount = (photoId, uid) => {
    let _sql = `select count(*) as count from photofeedback where photoId="${photoId}" and userId="${uid}" and type=0;`
    return query(_sql)
}

