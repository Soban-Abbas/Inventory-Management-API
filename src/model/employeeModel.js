const {pool}=require("../database/pool")
const crypto=require("crypto")
const { generatetoken }=require("../util/employeeToken")
const { encryptPassword,verifyPassword }=require('../helper/encryptPassword');
exports.registerEmployee=async(name,phone_number,role , shop_id,password)=>{
    try {
        const encryptedPassword = await encryptPassword(password, 10)
        let registerEmployee;
if(role.trim().toLowerCase()==='cashier'){
    let joiningId = 'cashier-'+crypto.randomBytes(4).toString("hex")


     registerEmployee = await pool.query('insert into employees (name ,phone_number,role,shop_id,password,joiningid ) values ($1,$2,$3,$4,$5,$6) returning *', [name, phone_number, role, shop_id, encryptedPassword, joiningId])

}else{


    let joiningId = 'manager-' + crypto.randomBytes(4).toString("hex")


    registerEmployee  = await pool.query('insert into employees (name ,phone_number,role,shop_id,password,joiningid ) values ($1,$2,$3,$4,$5,$6) returning *', [name, phone_number, role, shop_id, encryptedPassword, joiningId])


}
      
       
if(registerEmployee.rowCount<1){
    const error=new Error("Registration Unsuccessfull")
    throw error
}else{
    const{joiningid, name,phone_number,role}=registerEmployee.rows[0]
return{
   joiningid, name,phone_number,role
}}
    } catch (error) {
        if (error.code === '23505'){
            error.status=409;
            error.message="Phone number Already Registered"
        }
        throw error
    }
}

exports.findEmployeeById=async(joiningid)=>{
    try {
        const employee=await pool.query('select * from employees where joiningid=$1',[joiningid])
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

exports.loginEmployee=async(joiningid,password)=>{
    try {
        const employee=await this.findEmployeeById(joiningid);
        const correctPassword=await verifyPassword(password,employee.password);
        if(!correctPassword){
            const error=new Error("Wrong Id or password");
            error.status=401;
            throw error
            return
        }
      const token=generatetoken(employee.id,employee.role,employee.shop_id)
      const{id,name , phone_number,role}=employee
      return{
        name,phone_number,role,token
      }
    } catch (error) {
        throw error
    }
}
