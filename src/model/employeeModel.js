const {pool}=require("../database/pool")
const { generatetoken }=require("../util/generateJwtToken")
const { encryptPassword,verifyPassword }=require('../helper/encryptPassword');
exports.registerEmployee=async(name,phone_number,role , shop_id,password)=>{
    try {


        const encryptedPassword=await encryptPassword(password,10)
        const registerEmployee=await pool.query('insert into employees (name ,phone_number,role,shop_id,password ) values ($1,$2,$3,$4,$5) returning *',[name,phone_number,role,shop_id,encryptedPassword])

if(registerEmployee.rowCount<1){
    const error=new Error("Registration Unsuccessfull")
    throw error
}else{
    const{id, name,phone_number,role}=registerEmployee.rows[0]
return{
   id, name,phone_number,role
}}
    } catch (error) {
        if (error.code === '23505'){
            error.status=409;
            error.message="Phone number Already Registered"
        }
        throw error
    }
}

exports.findEmployeeById=async(Id)=>{
    try {
        const employee=await pool.query('select * from employees where id=$1',[Id])
        if(employee.rowCount<1){
            const error=new Error("Wrong id or password");
            error.status=401;
            throw error;
return
        }

        const {id,name,password,phone_number,role,shop_id}=employee.rows[0];
        return{
            id,name,password,phone_number,role,shop_id
        }
    } catch (error) {
        console.log(error)
        throw error
    }
}

exports.loginEmployee=async(Id,password)=>{
    try {
        const employee=await this.findEmployeeById(Id);
        const correctPassword=await verifyPassword(password,employee.password);
        if(!correctPassword){
            const error=new Error("Wrong Id or password");
            error.status=401;
            throw error
            return
        }
      const token=generatetoken(Id,employee.role)
      const{id,name , phone_number,role}=employee
      return{
        id,name,phone_number,role,token
      }
    } catch (error) {
        throw error
    }
}
