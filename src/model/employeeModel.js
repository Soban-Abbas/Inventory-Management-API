const {pool}=require("../database/pool")
const { encryptPassword }=require('../helper/encryptPassword');
exports.registerEmployee=async(name,phone_number,role , shop_id,password)=>{
    try {


        const encryptedPassword=await encryptPassword(password,10)
        const registerEmployee=await pool.query('insert into employees (name ,phone_number,role,shop_id,password ) values ($1,$2,$3,$4,$5) returning *',[name,phone_number,role,shop_id,encryptedPassword])

if(registerEmployee.rowCount<1){
    const error=new Error("Registration Unsuccessfull")
    throw error
}else{
    const{name,phone_number,role}=registerEmployee.rows[0]
return{
    name,phone_number,role
}}
    } catch (error) {
        if (error.code === '23505'){
            error.status=409;
            error.message="Phone number Already Registered"
        }
        throw error
    }
}

