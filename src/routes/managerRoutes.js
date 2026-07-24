const express=require("express");
const multer =require("multer");
const router=express.Router();
const {isManager}=require("../middleware/isManager");
const{verifyToken}=require("../util/verifyToken")
const { validateSupplierDetails } = require("../validator/validateSupplierDetails")
const managerController=require("../controller/managerController")

const { productValidation }=require("../validator/productValidation")
router.post('/supplier',verifyToken,isManager,validateSupplierDetails,managerController.addNewSupplier)
router.get('/suppliers',verifyToken,isManager,managerController.getSuppliers)
router.post('/product',verifyToken, isManager,productValidation,managerController.addNewProduct)
router.get('/product',verifyToken,isManager,managerController.getAllProducts)
module.exports=router