const {check}=require("express-validator")
exports.productValidation=[
    check('name')
    .trim()
    .notEmpty()
    .isLength({min:4})
    .withMessage("name length should be inbetween 4 to 20 characters"),

check('category')
        .trim()
        .notEmpty()
        .isLength({ min: 4 })
        .withMessage("name length should be inbetween 4 to 20 characters"),

check('supplierId')
.trim()
.notEmpty()
.isInt()
.withMessage("Supplier id must be integer"),


//         check('brand')
//         .optional({values:'falsy'})
//         .isLength({min:4})
//         .withMessage("brand name length should be greater that 4 character")
// ,
// check('discription')
// .optional({values:"falsy"})
// .isLength({min:10})
// .withMessage("discription should atleast be 10 digit long")


check("variants").custom((value)=>{
    const data=value

    const colorExist=data.some((v)=>{
        return v.color
    })

    if(colorExist){
        const missingColor=data.some((v)=>{
return !v.color
        })

        if(missingColor){
            throw new Error("Color is missing in any variant")
        }
    }




    const sizeExist = data.some((v) => {
        return v.size
    })

    if (colorExist) {
        const missingSize = data.some((v) => {
            return !v.size
        })

        if (missingSize) {
            throw new Error("Size is missing in any variant")
        }
    }
    return true
}),


check("variants.*.purchasePrice")
.notEmpty()
.withMessage("Purchase Price cannot be empty")
.isInt({min:1,max:99999999.99})
.withMessage("price should be in betwen 0 and 99999999.99")


,


    check("variants.*.sellingPrice")
        .notEmpty()
        .withMessage("selling  Price cannot be empty")
        .isInt({ min: 1, max: 99999999.99 })
        .withMessage("selling price should be in betwen 0 and 99999999.99")

,
        check("variants.*.stock")
        .notEmpty()
        .withMessage("Stock is required")
        .isInt({ min: 0 })
        .withMessage("Stock must be a non-negative integer")


]