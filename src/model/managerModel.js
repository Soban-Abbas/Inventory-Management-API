const { pool } = require("../database/pool");
const crypto=require("crypto")


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

exports.getSuppliers=async(shop_id,limit,offset)=>{
    try {
        const suppliers=await pool.query('select * from suppliers where shop_id=$1 order by id asc limit  $2 offset  $3',[shop_id,limit,offset])
        console.log(suppliers)
        if(suppliers.rowCount<1){
            const error=new Error("No supplier found")
            error.status=404;
            throw error;
            return
        }

        const updatedSuppliersDetails=suppliers.rows.map((s)=>{
            return{
                id:s.id,
                name:s.name,
                address:s.address,
                phone_number:s.phone_number
            }
        })
            return{
        suppliers:  updatedSuppliersDetails
            }
            
        
    } catch (error) {
        throw error
    }
}

exports.addNewProduct=async(name,categoryName,brand,description,variants,shop_id,supplierId)=>{
    const client = await pool.connect()
    try {  //geting one dedicated client from pool
        
console.log("hello")

        // start the transaction
        await client.query('BEGIN')
    
        const category=await this.getCategoryByName(name,shop_id);
        console.log(category)
       

        let  addProductDetails;


        if(category){
console.log("in into if")
            addProductDetails =await client.query('insert into products (name,category_id,shop_id,brand,discription) values ($1,$2,$3,$4,$5) returning *' , [name,category,shop_id,brand,description])


            console.log("hi inside if ")

        }else{
   
            const addCategory=await client.query('insert into categories (name,shop_id) values ($1,$2) returning *',[categoryName,shop_id])
            
            const id=addCategory.rows[0].id
            console.log(id)


            addProductDetails =await client.query('insert into products (name,category_id,shop_id, brand,discription) values($1,$2,$3,$4,$5) returning *',[name,id,shop_id,brand,description])
            console.log(addProductDetails);
            console.log("hi inside else end ")
        }

let Variants=[];
     for (const v of variants) {
        

        let generateSku= (name+"-"+category.length+"-/"+String(v.stock)+Math.random().toString(36).slice(4,8).toUpperCase()).toUpperCase()



            insertedVariants=await client.query('insert into product_variants(product_id,color,size,price,sku,stock) values ($1,$2,$3,$4,$5,$6) returning *',[addProductDetails.rows[0].id, v.color,v.size,Number(v.sellingPrice), generateSku,v.stock])

         Variants.push(insertedVariants.rows[0])

if(insertedVariants.rowCount<1){
    throw new Error("Failed to insert Products")
}
         

        };


console.log(Variants);









console.log("jits before commit")
        await client.query("rollback")
        console.log("rollback")
        await client.query("commit")









    }catch(error){
        await client.query("rollback")
        throw error
    }finally{
        client.release()
    }

// start transaction
}

exports.getCategoryByName = async (name, shop_id) => {
    try {
        const category = await pool.query('select id from categories where shop_id =$1 AND lower(name)=lower($2)', [shop_id, name]);
        if (category.rowCount > 0) {
            const id = category.rows[0].id
            return id;

        } else {
            return false
        }
    } catch (error) {
        throw error
    }
}




