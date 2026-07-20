const express=require("express");
const { verifyToken }=require("../util/verifyToken");
const { isShop }=require("../middleware/isShop")
const { validateEmployeeDetails }=require("../validator/validateEmployeeDetails")
const employeeController=require("../controller/employeeController")
const router=express.Router();


router.post('/employee', verifyToken, isShop, validateEmployeeDetails,employeeController.registerEmployee)

module.exports=router