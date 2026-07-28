const managerModel=require("../model/managerModel");
const {pool}=require("../database/pool")
exports.sellingProduct=async(productId,variantId,units , unitPrice , employeeId , shopId)=>{
    const client = await pool.connect();
    try {
        await client.query('begin')
  const productExist=await managerModel.getProductById(productId,variantId);
  
  if(productExist.product[0].stock<Number(units)){
    const error=new Error(" Available stock is Low")
    error.status=422;
    throw error
  }if(productExist.product[0].price>Number(unitPrice)){
    const error=new Error("Not allow to sell product on lower rates ")
    error.status=422;
    throw error
  }
const sellingItem=await client.query('update  product_variants set stock=stock-$1 where product_id = $2 AND id=$3 AND stock >= $4 returning *',[Number(units),Number(productId),Number(variantId),1]);

        const originalUnitPrice= productExist.product[0].price;

const updateHistory=await client.query('insert into track_history (employee_id,product_id,action,unit_price,shop_id,variant_id,units,total_amount) values($1,$2,$3,$4,$5,$6,$7,$8)',[employeeId,productId,"sell",originalUnitPrice,shopId,variantId,units,Number(units*unitPrice)]);


        await client.query("commit")

return{
    id:productExist.product[0].id,
   name: productExist.product[0].name,
   color:productExist.product[0].color,
   size:productExist.product[0].size,
   totalunitSell:units,
   totalAmount:Number(units*unitPrice)
}







    } catch (error) {
        await client.query("rollback")
        throw error
    }finally{
        client.release()
    }
}