exports.validateLoginInputs=(req , res , next)=>{
if(!req.body.email.includes('@') ||req.body. password.length<5){
  return  res.status(404).json({
        error:"Wrong Email or Password"
    })
}else{
    next()
}
}