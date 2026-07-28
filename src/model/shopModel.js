const { pool } = require("../database/pool");
const bcrypt=require("bcrypt")
const crypto = require('crypto')
const { encryptPassword , verifyPassword} = require("../helper/encryptPassword");
const { generatetoken }=require("../util/generateJwtToken")
const { error } = require("console");
exports.registerNewShop = async (name, email, password) => {
    try {
        const uniqueCode = crypto.randomBytes(4).toString('hex')
        const hashPassword = await encryptPassword(password, 10);

        const newshop = await pool.query('insert into shops(name,email,password,invite_code) values ($1,$2,$3,$4) returning *', [name, email, hashPassword, uniqueCode]);
        if (newshop.rowCount < 1) {
            const error = new Error();
            throw error;
            return
        } 

        console.log(newshop);
        return {
            id: newshop.rows[0].id,
            name: newshop.rows[0].name,
            email: newshop.rows[0].email,
            invite_code: newshop.rows[0].invite_code

        }


    } catch (error) {
        if (error.code == '23505'){
            const error=new Error("Email already registered");
            error.status=409;
            throw error
            return
        }
        throw error
    }
}
exports.getShopByEmail=async(email)=>{
    try {
        
        const shop=await pool.query('select * from shops where email=$1',[email])
    if(shop.rowCount<1){
      const error=new Error("Wrong Email or Password")
      error.status=404
      throw error;
      return
    }else{
        return shop
    }
    } catch (error) {
        throw error
    }
}

exports.loginShop=async(Email,password)=>{
    try {
        
        const shop=await this.getShopByEmail(Email)
        console.log(shop)
        const validPassword = await verifyPassword(password,shop.rows[0].password);
        if(!validPassword){
            const error=new Error("Wrong Email or Password");
            error.status=404;
            throw error;
            return
        }
     
        const {id,name,email,invite_code}=shop.rows[0];
        const token=generatetoken(id,"shop")
        return{
            id,name,email,invite_code,token
        }
    } catch (error) {
        throw error
    }
}
exports.getHistory=async(shop_id)=>{
    try {
        const history= await pool.query('select employee_id , action , date, total_amount from track_history where shop_id=$1',[shop_id]);
        if(history.rowCount<1){
            const error = new Error("Not record found ");
            error.status=404;
            throw error
        }else{
            return history.rows
        }
    } catch (error) {
        throw error
    }
}