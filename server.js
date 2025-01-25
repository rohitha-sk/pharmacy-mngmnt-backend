import bodyParser from 'body-parser';
import express from 'express';
import userRouter from './routes/userRouter.js';
import mongoose from "mongoose";
import cors from 'cors';
import dotenv from 'dotenv';
import InventoryRouter from './routes/inventoryRouter.js';

dotenv.config();  // This loads the environment variables from the .env file

// console.log(process.env.JWT_SECRET); 


const app = express();

app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(bodyParser.json());


const connectionString ="mongodb+srv://rohitha:123@cluster0.to2cf.mongodb.net/pharmacy-management?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(connectionString).then(
    ()=>{
        console.log("Connected to the database")
    }
).catch(
    ()=>{
        console.log("Connection failed")
    }
)



app.use('/api/users', userRouter);
app.use('/api/inventory', InventoryRouter);

app.listen(5000,(req,res)=>{
    console.log("Server is running on port 5000")
    });