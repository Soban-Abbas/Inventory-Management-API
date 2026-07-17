const shopModel=require("../model/shopModel")
exports.registerShop=async(req , res , next)=>{
    console.log("Hello")
try {
    const { name, email, password } = req.body;

 const result=   await shopModel.registerNewShop(name,email,password)
res.status(201).json({
    message : "Shop registered Successfully",
    shopDetails:{
        ...result
    }
})


} catch (error) {
   
next(error)

}
}