const {validationResult}=require("express-validator")
const managerModel=require("../model/managerModel")
const cashierModel=require("../model/cashierModel")
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

exports.sellProduct=async(req , res, next)=>{
    try {
        
        const error=validationResult(req)
        if(!error.isEmpty()){
          return  res.status(422).json({
                error:error.array()
            })
        }
const{productId,variantId,units,unitPrice}=req.body;
const{id,shop_id}=req.details;
const sellingProduct=await cashierModel.sellingProduct(productId,variantId,units,unitPrice,id,shop_id)
res.status(200).json({
    message:"product Sell",
    productDetails:sellingProduct
})
    } catch (error) {
        next(error)
    }
}