const express=require("express");
require("dotenv").config()
const {startServer}=require("../src/helper/startServer")
const app=express();





startServer(app)