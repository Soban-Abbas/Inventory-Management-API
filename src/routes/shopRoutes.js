const express=require("express");
const shopController=require("../controller/shopController")
const router = express.Router();
const { shopRegistrationValidation }=require("../validator/shopRegistrationValidation")
const{validateLoginInputs}=require("../helper/validateloginInputs")
const { sendInputValidationError }=require("../helper/sendInputValidtionError")
router.post('/registration',shopRegistrationValidation,sendInputValidationError, shopController.registerShop)
router.post('/login', validateLoginInputs,shopController.loginShop)
module.exports=router