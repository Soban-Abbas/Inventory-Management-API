const {pool} = require("../database/pool");
const crypto = require('crypto')
const { encryptPassword } = require("../helper/encryptPassword")
exports.registerNewShop = async (name, email, password) => {
    try {
        const uniqueCode = crypto.randomBytes(4).toString('hex')
        console.log(uniqueCode)
        const hashPassword = await encryptPassword(password, 10);

const newshop=await pool.query('insert into shops(name,email,password,invite_code) values ($1,$2,$3,$4) returning *',[name,email,hashPassword,uniqueCode]);
if(newshop.rowCount<1){
    const error=new Error();
    throw error;
    return
}

console.log(newshop);
return {
    id:newshop.rows[0].id,
    name:newshop.rows[0].name,
    email:newshop.rows[0].email,
    invite_code:newshop.rows[0].invite_code

}


    } catch (error) {
        throw error
    }
}