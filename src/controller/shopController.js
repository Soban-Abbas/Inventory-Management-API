const e = require("express");
const shopModel = require("../model/shopModel")
const {validationResult}=require('express-validator')
exports.registerShop = async (req, res, next) => {
    try {

        const { name, email, password } = req.body;

        const result = await shopModel.registerNewShop(name, email, password)
        res.status(201).json({
            message: "Shop registered Successfully",
            shopDetails: {
                ...result
            }
        })


    } catch (error) {

        next(error)

    }
}
exports.loginShop=async(req , res , next)=>{
    try {
        const {email,password}=req.body;
        const loginShop=await shopModel.loginShop(email,password)
        res.status(200).json({
            Message:"Shop Login Successfully",
            loginShop
        })
    } catch (error) {
        throw error
    }
}
