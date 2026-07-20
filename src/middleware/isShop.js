exports.isShop=(req , res , next)=>{
    if(req.details.role==="shop"){
        next()
    }else{
      return  res.status(400).json({
            error:"Only shop can access this route"
        })
    }
}