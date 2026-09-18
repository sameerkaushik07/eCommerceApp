import express from "express";
import cors from "cors";
import 'dotenv/config'
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRout.js";
import productRouter from "./routes/productRout.js";


// App config
const app = express();
const port = process.env.PORT || 4000;

// Connect to databases
connectDB();
connectCloudinary();

// Middleware
app.use(express.json());
app.use(cors()); // This enables CORS for all routes

// API endpoints
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);

app.get('/',(req,res)=>{
    res.send('Api Working')
})

app.listen(port,()=>console.log(`Server started on PORT: ${port}`));
