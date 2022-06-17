import "dotenv/config";
import express from "express";

const APP=express();
const PORT=process.env.port;

APP.listen(PORT,()=>{
	console.log(`Server listening on http://localhost:${PORT}`);
});