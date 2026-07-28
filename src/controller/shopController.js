const excelJS = require("exceljs");
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
           ... loginShop
        })
    } catch (error) {
        throw error
    }
}
exports.getRecord=async(req , res , next)=>{
    try {
        

        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet("history");

        // Define columns in the worksheet 
        worksheet.columns = [
            { header: "Employee Id", key: "employee_id", width: 15 },
            { header: "action ", key: "action", width: 15 },
            { header: "date", key: "date", width: 25 },
            { header: "total_amount", key: "total_amount", width: 10 },
        ];


const history=await shopModel.getHistory(req.details.id)

        // Add data to the worksheet 
        history.forEach(h => { worksheet.addRow(h); });

        // Set up the response headers 
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"); res.setHeader("Content-Disposition", "attachment; filename=" + "record.xlsx");

        // Write the workbook to the response object 
        workbook.xlsx.write(res).then(() => res.end());




    } catch (error) {
        next(error)
    }
}
