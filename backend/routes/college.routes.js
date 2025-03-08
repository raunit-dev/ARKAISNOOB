import { getCollegeDetails, getStudentDetails, savedeiteddetails } from "../controllers/college.cpntroller.js";
import express from "express"

const collegerouter = express.Router();

collegerouter.post('/getcollegedetails', getStudentDetails); 
collegerouter.post('/editdetails', savedeiteddetails)


export {collegerouter}