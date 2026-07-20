const{check}=require("express-validator");
exports.validateEmployeeDetails=[
    check("name")
    .trim()
    .notEmpty()
    .withMessage("Name cannot be empty")
    .bail()
    .isLength({min:4,max:20})
    .withMessage("Name length should be in between 4 to 20 characters")
    .bail()
    .isAlpha()
    .withMessage("name can only contain characters"),


    check("phone_number")
    .trim()
    .notEmpty()
    .withMessage("Phone number cannot be empty")
    .bail()
        .matches(/^\+[1-9][0-9]{7,14}$/)
        .withMessage("Phone number must be in international format (e.g. +923001234567)")

    ,

    check("role")
    .trim()
    .notEmpty()
    .withMessage("role cannot be empty")
    .bail()
    .isIn(['cashier' , 'manager'])
    .withMessage("Role can only be manager or cashier")
    ,
    check("password")
    .trim()
    .notEmpty()
    .withMessage("Password cannot be empty")
    .bail()
    .isLength({min:6,max:20})
    .withMessage("Password length should be inbwteen 6 to 20 digits"),

    check("confirm-password")
    .custom((value,{req})=>{
        if(value===req.body.password){
            return true
        }else{
            throw new Error("password and confrim password mismaytch")
        }
    })

]