
const managerModel=require("../model/managerModel")
const {validationResult}=require("express-validator")



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