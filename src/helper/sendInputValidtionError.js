const {validationResult}=require("express-validator")

exports.sendInputValidationError=(req , res, next)=>{
    const error=validationResult(req);
    if(!error.isEmpty()){
       return res.status(422).json({
            error:error.array()
        })
    }else{
        next()
    }
}