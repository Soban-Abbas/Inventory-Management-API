const { check } = require("express-validator")
const { options } = require("../routes/managerRoutes")
exports.updateProductValidation = [
    check('productId')
        .trim()
        .notEmpty()
        .withMessage("ProductId cannot be empty")
        .bail()
        .isInt()
        .withMessage("ProductId should be an integer")
    ,

    check('variantId')
        .trim()
        .notEmpty()
        .withMessage("variantId cannot be empty")
        .bail()
        .isInt()
        .withMessage("VariantId should be an integer")

    ,

    check('stock')
        .trim()
        .notEmpty()
        .withMessage("stock cannot be empty")
        .bail()
        .isInt({ min: 1 })
        .withMessage("stock should be an integer and greater then 0"),

    check('purchasePrice')
        .trim()
        .notEmpty()
        .withMessage("purchase cannot be empty")
        .bail()

        .isInt({ min: 1 })
        .withMessage("purchase should be an integer and greater then 0")
    ,


    check('sellingPrice')
        .trim()
        .notEmpty()
        .withMessage("stock cannot be empty")
        .bail()


        .isInt({ min: 1 })
        .withMessage("selling  should be an integer and greater then 0"),

        check('supplierId')
            .trim()
            .notEmpty()
            .withMessage("supplierid cannot be empty")
            .bail()
        .isInt({min:1})
        .withMessage("Supplier id must be interger and greater then 1 ")


]