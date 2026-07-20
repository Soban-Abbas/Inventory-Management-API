const {check}=require("express-validator");
exports.shopRegistrationValidation=[
    check("name")
    .trim()
    .notEmpty()
    .isLength({min:5,max:20})
    .withMessage("Namem length should be 5 or more")
    .bail()
    .isAlphanumeric()
    .withMessage("name can only contain letters and numbers "),

    check("email")
    .trim()
    .notEmpty()
    .isEmail()
    .withMessage("Invalid Email"),

    check("password")
    .trim()
    .notEmpty()
    .isLength({min:6})
.withMessage("Password length should atleast 6 digits"),
check('confirm-password')
.trim()
.custom((value , {req})=>{
if(value===req.body.password){
    return true;
}else{
    throw new Error("Password and Confirm Password Mismatch")
}
})

]