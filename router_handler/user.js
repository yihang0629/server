// db是数据库连接对象
const db = require('../lib/db')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config/default')



// 注册新用户
exports.regUser = async (req, res) => {
    // 接受表单数据
   const userInfo = req.body
    console.log(userInfo );
    // 判断是否合法
    // if(! userInfo.username || ! userInfo.password){
    //     return res.send({status: 1, message: '用户名或密码不合法'})
    // }

    // 定义SQL语句，查询用户名是否被占用
    const sqlStr = `select * from user where username=?`
    await db.query(sqlStr, userInfo.username, (err, results) => {
        if(err){
            // return res.send({status: 1, message: err.message})
            return res.cc(err)
        }

        // 判断用户名是否被占用
        if(results.length > 0){
            // return res.send({status: 1, message: '用户名被占用'})
            return res.cc('用户名被占用')
        }

        // 用户名可以使用 对密码加密
        userInfo.password = bcrypt.hashSync(userInfo.password, 10)
        // console.log(userInfo);

        // 定义插入新用户的sql语句
        const sql = 'insert into user set ?'
        db.query(sql, {username:userInfo.username, password:userInfo.password}, (err, results) => {
            // 判断sql是否执行成功
            // if(err) return res.send({status: 1, message: err.message})
            if(err) return res.cc(err)

            // 判断影响行数是否为一
            // if(results.affectedRows !== 1) return res.send({status: 1, message: '注册失败'})
            if(results.affectedRows !== 1) return res.cc('注册失败')

            // 注册成功
            res.send({status: 0, message: '注册成功'})
        })
    })
}
// 登录
exports.login = (req, res) => {
    const userInfo = req.body
    const sql = 'select * from user where username=?'
    db.query(sql, userInfo.username, (err, results) => {
        if(err) return res.cc(err)

        if(results.length !== 1) return res.cc('登录失败')

       const compareResult =  bcrypt.compareSync(userInfo.password, results[0].password)
       if(! compareResult) return res.cc('登录失败')

        const user = {...results[0], password:'', user_pic:''}

        const tokenStr = jwt.sign(user, config.jwtSerectKey, {expiresIn: config.expiresIn})

        // token 给客户端
        res.send({
            status: 0,
            message: '登录成功',
            token: 'Bearer ' + tokenStr,
        })
    })
    
}