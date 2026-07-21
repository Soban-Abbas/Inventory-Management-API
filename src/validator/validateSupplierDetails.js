const {check}=require("express-validator")
exports.validateSupplierDetails=[
    check('name')
    .trim()
    .notEmpty()
    .isLength({min:4})
    .withMessage("Name should atleast be 4 character")
    
    ,

    check("address")
    .trim()
    .notEmpty()
    .withMessage("address cannnot be empty")
    ,

    check('phone_number')
    .trim()
    .notEmpty()
    .withMessage("contact Number cannot be empty")
    .bail()
    .matches(/^\+[1-9][0-9]{7,14}$/)
        .withMessage("Contact Number should be in form of (e.g. +923001234567)")

]