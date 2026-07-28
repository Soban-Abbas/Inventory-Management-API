const multer = require("multer");
exports.fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'upload')
    },
    filename: (req, file, cb) => {


        const filename = file.originalname + '-' + Date.now() + "-" + (Math.random() * 99 + 1).toFixed(5)

        cb(null, file.originalname + '-' + filename + file.originalname)
    }
})

exports.fileFilter = (req, file, cb) => {

    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    }
    else {
        const error = new Error("only accept png , jpg images")
        error.status = 415;
        cb(error, false)
    }

}