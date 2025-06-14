var multer = require('multer');

function random(min, max){
    return Math.floor(Math.random() * (max - min)) + min;
}

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, './data/photo')
    },
    filename: function(req, file, cb) {
        let type = file.originalname.replace(/.+\./, '.')
        cb(null, Date.now() + random(1,100) + type)
    }
})

const upload = multer({storage: storage})

module.exports = function(app){
    app.post('/profile', upload.single('file'), function(req, res, next){
        let name = req.file.filename;
        let imgurl = '/photo/' + name
        
        res.send(imgurl)
    })
}
