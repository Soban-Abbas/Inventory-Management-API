const {check}=require("express-validator")

exports.validateInputs=[

    check('productId')
    .trim()
    .notEmpty()
    .withMessage("empty field productId not allowed")
    .bail()
    .isInt({min:1})
    .withMessage("Only interger values is alloowed"),
    check('variantId')
        .trim()
        .notEmpty()
        .withMessage("empty field variantId not allowed")
        .bail()
        .isInt({ min: 1 })
        .withMessage("Only interger values is alloowed"),
    check("units")
    .trim()
    .notEmpty()
    .withMessage("Please enter units are selling")
    .bail()
    .isInt({min:1})
    .withMessage("unit must be integer"),
    check("unitPrice")
        .trim()
        .notEmpty()
        .withMessage("Please enter  selling price of item")
        .bail()
        .isInt({ min: 1 })
        .withMessage("unitPrice must be integer")

]