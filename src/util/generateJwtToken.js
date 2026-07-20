const jwt=require("jsonwebtoken")
exports.generatetoken=(id,role)=>{
    const payload={
        id:id,
        role:role
    }
    const secret = process.env.jwtKey;
    const expiry={
        expiresIn:'1h',
    }

 const token=   jwt.sign(
        payload,secret,expiry
    )

    return token



}