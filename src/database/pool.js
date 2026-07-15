const {Pool}=require("pg");
exports.pool=new Pool({
    user:process.env.user,
    password:process.env.password,
    host:process.env.host,
    port:process.env.port,
    database:process.env.database,

    max:10,
    connectionTimeoutMillis:5000,//if req comes and not get conection because connection are already busy then it req fails after 5 sec
    idleTimeoutMillis:10000 //if conection is not used for 10 sec it closes 
})