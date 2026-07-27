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

exports.getAllProducts=async(req ,res , next)=>{
try {

    
    const page=req.query.page ||1;
    const limit=req.query.limit || 2;
    console.log(page,limit)
    const offset=(Number(page)-1)*Number(limit);
    console.log(req.details.shop_id)
    const products= await managerModel.getAllProducts(Number(limit),offset,Number(req.details.id),Number(req.details.shop_id))
    res.status(200).json({
        message:"product Fetch successfull",
        ...products
    })
} catch (error) {
    next(error)
}
}