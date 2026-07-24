const{validationResult}=require("express-validator")
const managerModel=require("../model/managerModel")



exports.addNewSupplier=async(req , res , next)=>{
    try {

        const error=validationResult(req);
        if(!error.isEmpty()){
            return res.status(422).json({
                error:error.array()
            })
        }
        let {name,address,phone_number}=req.body
        const shop_id=req.details.shop_id
        phone_number=phone_number.trim()
const supplier=await managerModel.regNewSupplier(name,address,phone_number,shop_id)
res.status(201).json({
    message:"supplier added Successfully",
    ...supplier
})
    } catch (error) {
        throw error
    }
}


exports.getSuppliers=async(req,res,next)=>{
try {
    const page=Number(req.query.page||1);
    const limit=Number(req.query.limit||3)
    const offset=(page-1)*limit;
    const shop_id=req.details.shop_id
    const suppliers=await managerModel.getSuppliers(shop_id,limit,offset)
    res.status(200).json({
        message:"Supplier fetch successfully",
       ... suppliers
    })
} catch (error) {
    next(error)
}
}

exports.addNewProduct=async(req , res , next)=>{
try {
    const error=validationResult(req);
    if(!error.isEmpty()){
        res.status(422).json({
            error:error.array()

        })
        return
    }
    const{name , category,supplierId}=req.body;
    const brand=req.body.brand || null;
    const description = req.body.description || null;

    const variants=req.body.variants
const shop_id=req.details.shop_id;
const employee_id=req.details.id;

const addedProduct=await managerModel.addNewProduct(name, category,brand,description,variants,shop_id,supplierId,employee_id)
res.status(201).json({
    ...addedProduct
})
} catch (error) {
    next(error)
}
}


exports.getAllProducts=async(req , res , next)=>{
try {
    const page=req.query.page || 1;
    const limit=req.query.limit || 2;
    const employee_id=req.details.id;
    const shop_id=req.details.shop_id;


    

    const offset=(Number(page)-1)*Number(limit);
    
    const getAllProducts=await managerModel.getAllProducts(limit,offset,employee_id,shop_id)
    
} catch (error) {
    throw error
}
}