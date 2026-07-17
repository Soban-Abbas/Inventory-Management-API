const { createTables }=require("../database/creatingTables")
exports.startServer=async(app)=>{
    try {
        await createTables();
        app.listen(3000,()=>{
            console.log("server is started on Port 3000")
        })
    } catch (error) {
        console.log(error)
    }
}