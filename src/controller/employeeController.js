const {validationResult}=require("express-validator")

exports.registerEmployee=async(req , res , next)=>{
    try {
        const error=validationResult(req);
        if(!error.isEmpty()){
          return  res.status(422).json({
                error:error.array()
            })
            }
        console.log(req.body)
    } catch (error) {
        next(error)
    }
}