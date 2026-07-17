const express=require("express");
const shopController=require("../controller/shopController")
const router = express.Router();
router.post('/shop', shopController.registerShop)


module.exports=router