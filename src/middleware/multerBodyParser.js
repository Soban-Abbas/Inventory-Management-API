const multer=require("multer");
exports.parserData=(req , res , next)=>{
    const upload = multer({
        storage: multer.memoryStorage()
    })

    console.log(req.body)
   // next()
}

