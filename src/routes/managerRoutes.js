const express=require("express");
const router=express.Router();
const {isManager}=require("../middleware/isManager");
const{verifyToken}=require("../util/verifyToken")
const { validateSupplierDetails } = require("../validator/validateSupplierDetails")
const managerController=require("../controller/managerController")

router.post('/supplier',verifyToken,isManager,validateSupplierDetails,managerController.addNewSupplier)
router.get('/suppliers',verifyToken,isManager,managerController.getSuppliers)

module.exports=router