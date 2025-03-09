import { getCollegeDetails, getStudentDetails, savedeiteddetails } from "../controllers/college.cpntroller.js";
import express from "express"

const collegerouter = express.Router();

collegerouter.post('/getcollegedetails', getCollegeDetails); 
collegerouter.post('/editdetails', savedeiteddetails)
collegerouter.post('/getstudentdetails',getStudentDetails)

export {collegerouter}