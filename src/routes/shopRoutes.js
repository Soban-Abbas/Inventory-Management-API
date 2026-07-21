const express=require("express");
const shopController=require("../controller/shopController")
const employeeController =require("../controller/employeeController")
const { verifyToken }=require("../util/verifyToken")
const{isShop}=require("../middleware/isShop")
const { validateEmployeeDetails }=require("../validator/validateEmployeeDetails")
const router = express.Router();
const { shopRegistrationValidation }=require("../validator/shopRegistrationValidation")
const{validateLoginInputs}=require("../helper/validateloginInputs")
const { sendInputValidationError }=require("../helper/sendInputValidtionError")
router.post('/registration',shopRegistrationValidation,sendInputValidationError, shopController.registerShop)
router.post('/login', validateLoginInputs,shopController.loginShop)
router.post('/employee', verifyToken, isShop, validateEmployeeDetails,employeeController.registerEmployee)
module.exports=router