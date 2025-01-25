import express from 'express'
import { registerUser, loginUser } from '../controllers/login&Registration.js';
import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from '../controllers/userController.js';

const userRouter = express.Router();


userRouter.post("/register",registerUser);
userRouter.post("/login",loginUser);

//user management routes
userRouter.post("/add_user",createUser);
userRouter.get("/all_users",getAllUsers);
userRouter.get("/get_user/:id", getUserById);
userRouter.put("/update_user/:id", updateUser);
userRouter.delete("/delete_user/:id", deleteUser);





//import verifyToken from './middleware/authMiddleware.js'; 
//userRouter.post("/register", verifyToken,registerUser);

 export default userRouter; 