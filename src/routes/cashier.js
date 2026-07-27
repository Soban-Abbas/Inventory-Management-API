const express=require("express");
const { verify } = require("jsonwebtoken");
const{isCashier}=require("../middleware/isCashier")
const { verifyToken }=require("../util/verifyToken")
const cashierController=require("../controller/cashierController")

const router= express.Router()
router.get('/product',verifyToken,isCashier,cashierController.getProductById)


module.exports=router