const express=require("express");
const { verify } = require("jsonwebtoken");
const{isCashier}=require("../middleware/isCashier")
const { validateInputs }=require("../validator/validateSellingInput")
const { verifyToken }=require("../util/verifyToken")
const cashierController=require("../controller/cashierController")

const router= express.Router()
router.get('/product',verifyToken,isCashier,cashierController.getProductById)

router.get('/products', verifyToken, isCashier, cashierController.getAllProducts)


router.post('/product', verifyToken, isCashier, validateInputs,cashierController.sellProduct)
module.exports=router;