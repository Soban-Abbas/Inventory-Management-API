const { pool } = require("../database/pool");



exports.getSupplierWithPhoneNumber=async(phone_number,shop_id)=>{
    try {
        const supplier=await pool.query("select * from suppliers where shop_id = $1 AND phone_number=$2",[shop_id,phone_number])
        if(supplier.rowCount<1){
            return false
        }else{
            const error=new Error("Supplier already exist with this phone Number")
            error.status=409
throw error;
return;
        }
    } catch (error) {
        throw error
    }
}



exports.regNewSupplier = async (name, address, phone_number, shop_id) => {
    try {


        const supplierExist=await this.getSupplierWithPhoneNumber(phone_number,shop_id);

        const supplier = await pool.query('insert into suppliers (name,address,phone_number,shop_id) values ($1,$2,$3,$4) returning *', [name, address, phone_number, shop_id]);
        if (supplier.rowCount < 1) {
            const error = new Error("Failed to add new Supplier")
            throw error;
            return;
        }
        const { id: Id, name: Name, address: Address, phone_number: Phone_number, shop_id: Shop_id } = supplier.rows[0]
        return {
            id: Id,
            name: Name,
            address: Address,
            phone_number: Phone_number
        }
    } catch (error) {

        if (error.code === '23505') {
            error.status = 409;
            error.message = "Supplier "
        }
        throw error
    }
}