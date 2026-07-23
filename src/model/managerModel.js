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

exports.addNewProduct=async(name,categoryName,brand,description,variants,shop_id,supplierId,employee_id)=>{
    const client = await pool.connect()
    try {  //geting one dedicated client from pool
        


        // start the transaction
        await client.query('BEGIN')
    
        const category=await this.getCategoryByName(categoryName,shop_id);
    const product=await this.getProductByName(name,shop_id)

        let  addProductDetails;


        if(category){
            console.log("hello from if ")
            addProductDetails =await client.query('insert into products (name,category_id,shop_id,brand,discription) values ($1,$2,$3,$4,$5) returning *' , [name,category,shop_id,brand,description])




        }else{
   console.log("hello for else")
            const addCategory=await client.query('insert into categories (name,shop_id) values ($1,$2) returning *',[categoryName,shop_id])
            
            const id=addCategory.rows[0].id
        


            addProductDetails =await client.query('insert into products (name,category_id,shop_id, brand,discription) values($1,$2,$3,$4,$5) returning *',[name,id,shop_id,brand,description])
        
        }

let Variants=[];
     for (const v of variants) {
        

        let generateSku= (name+"-"+category.length+"-/"+String(v.stock)+Math.random().toString(36).slice(4,8).toUpperCase()).toUpperCase()



            insertedVariants=await client.query('insert into product_variants(product_id,color,size,price,sku,stock) values ($1,$2,$3,$4,$5,$6) returning *',[addProductDetails.rows[0].id, v.color,v.size,Number(v.sellingPrice), generateSku,v.stock])

         Variants.push({
          ...  insertedVariants.rows[0],
          purchasePrice:v.purchasePrice
         }
        )

if(insertedVariants.rowCount<1){
    throw new Error("Failed to insert Products")
}
         

        };


        for (const v of Variants) {
            const insertIntoProductSuppliers = await client.query('insert into product_supplier (product_id,supplier_id,purchasePrice,variant_id) values ($1,$2,$3,$4) returning *', [v.product_id,supplierId,v.purchasePrice,v.id])

            if(insertIntoProductSuppliers.rowCount<1){
                throw new Error("failed to add products")
            }


            
        }


        


for (const v of Variants) {

const total_amount=v.purchasePrice*v.stock


    const insertIntoHistory=await client.query('insert into track_history (employee_id,product_id,action,unit_price,shop_id,variant_id,units,total_amount) values ($1,$2,$3,$4,$5,$6,$7,$8)  returning *',[employee_id,v.product_id,"purchase",v.purchasePrice,shop_id,v.id,v.stock,total_amount])


    if(insertIntoHistory.rowCount<1){
        throw new Error("product failed to add")
    }

}


   
        await client.query("commit") 
        
        return{
            message:"product added successfully"
        }

    }catch(error){
        await client.query("rollback")
        throw error
    }finally{
        client.release()
    }

}

exports.getCategoryByName = async (name, shop_id) => {
    try {
        const category = await pool.query('select id from categories where shop_id =$1 AND lower(name)=lower(trim($2))', [shop_id, name]);
        console.log(category)
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


exports.getProductByName = async (name, shop_id) => {
    try {
        const category = await pool.query('select id from products where shop_id =$1 AND lower(name)=lower(trim($2))', [shop_id, name]);
        console.log(category)
        if (category.rowCount > 0) {
          const error=new Error("Product with this name already exits you can update its details ")
          error.status=409
          throw error

        } else {
            return true;
        }
    } catch (error) {
        throw error
    }
}




