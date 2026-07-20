const {validationResult}=require("express-validator")
const employeeModel=require("../model/employeeModel")

exports.registerEmployee=async(req , res , next)=>{
    try {
        const error=validationResult(req);
        if(!error.isEmpty()){
          return  res.status(422).json({
                error:error.array()
            })
            }
            let{name,phone_number,role,password}=req.body;
            const shop_id=req.details.id
    password=password.trim();
    console.log(password);
   const registeredEmployee=     await employeeModel.registerEmployee(name,phone_number,role,shop_id,password);
res.status(201).json({
    message:"Employee registered Successfully",
   ... registeredEmployee
})


    } catch (error) {
        next(error)
    }
}

exports.loginEmployee=async(req , res , next)=>{

}