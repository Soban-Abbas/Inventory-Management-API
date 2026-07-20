const express=require("express");
require("dotenv").config()
const {startServer}=require("../src/helper/startServer")
const shopRoutes=require("../src/routes/shopRoutes");
const { globalErrorHandlingMiddleware }=require("../src/middleware/globalErrorHandlingMiddleware")
const bodyParser=require("body-parser")
const app=express();
app.use(bodyParser.json());
app.use("/shop",shopRoutes)


app.use(globalErrorHandlingMiddleware);
startServer(app)