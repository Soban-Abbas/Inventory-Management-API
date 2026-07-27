const managerModel=require("../model/managerModel")
exports.getProductById=async(req , res , next)=>{
    try {
        console.log("hello")
        const{productId,variantId}=req.query;
        if(!productId || !variantId){
return res.status(422).json({
    message:"Wrong product Id or variant Id"
})
        }
        const product=await managerModel.getProductById(productId,variantId);
        res.status(200).json({
            message:"product found successfully",
            ...product
        })
    } catch (error) {
        next(error)
    }
}