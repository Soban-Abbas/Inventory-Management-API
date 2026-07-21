const jwt=require("jsonwebtoken")
exports.verifyToken=(req , res , next)=>{
    const header=req.headers.authorization;
    if(!header){
      return  res.status(401).json({
            error:"Please login First"
        })
    }
    const token=header.split(" ")[1];
    if(!token){
        return res.status(401).json({
            error: "Please login First"
        })
    }

    const decode = jwt.verify(token, process.env.jwtKey);
const {id , role,shop_id}=decode;
req.details={id,role,shop_id};
next();

}