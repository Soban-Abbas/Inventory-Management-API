const jwt=require("jsonwebtoken")
exports.generatetoken=(id,role,shop_id)=>{
    const payload={
        id:id,
        role:role,
        shop_id:shop_id
    }
    const secret = process.env.jwtKey;
    const expiry={
        expiresIn:'4h',
    }

 const token=   jwt.sign(
        payload,secret,expiry
    )

    return token



}