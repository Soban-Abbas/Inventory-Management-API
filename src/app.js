const express=require("express");
require("dotenv").config()
const {startServer}=require("../src/helper/startServer")
const shopEmployees=require("../src/routes/employeeRoutes")
const shopRoutes=require("../src/routes/shopRoutes");
const { globalErrorHandlingMiddleware }=require("../src/middleware/globalErrorHandlingMiddleware")
const managerRoutes=require("../src/routes/managerRoutes")
const bodyParser=require("body-parser")
const app=express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded())
app.use("/shop",shopRoutes)
app.use('/shop',shopEmployees);
app.use('/manager',managerRoutes)
app.use(globalErrorHandlingMiddleware);
startServer(app)