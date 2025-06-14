// 全局的配置文件
const config = {
    // 启动的端口号
    port:3000,
    database:{
        HOST:'localhost',
        USER:'root',
        PASSWORD:'Yh200229.',
        WALL:'wall',
    },

    // 加密和解密Token的秘钥
    jwtSerectKey: 'hhhh',
    // token有效时间
    expiresIn: '10h'
}

module.exports = config;