const express=require("express");
const { verifyToken }=require("../util/verifyToken");
const { isShop }=require("../middleware/isShop")
const { validateEmployeeDetails }=require("../validator/validateEmployeeDetails")
const employeeController=require("../controller/employeeController")
const{isManager}=require("../middleware/isManager")

const router=express.Router();


router.post('/employee/login',employeeController.loginEmployee)
module.exports=router