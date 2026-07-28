const {check}=require("express-validator")
exports.velidateImageInput=[
check('productId')
.trim()
.notEmpty()
.withMessage("product id is required")
.bail()
.isInt()
.withMessage("product Id must be an integer ")
,
check('variantId')
        .trim()
        .notEmpty()
        .isInt()
        .withMessage("variant Id must be an integer ")
    


   

]