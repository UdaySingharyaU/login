import  express from "express";
import {signup,login,logout} from "../controller/authController.js";
import catchAsync from "../middleware/catchAsync.middleware.js";
const router=express.Router();




//routers

router.post('/signup', catchAsync(signup));
router.post('/login', catchAsync(login));
router.post('/logout', catchAsync(logout));


export default router;