exports.isManager=(req , res , next)=>{
    if(req.details.role==="manager"){
        next()
    }else{
      return  res.status(401).json({
            error:"Unauthorized to Access these Routes"
        })
    }
}