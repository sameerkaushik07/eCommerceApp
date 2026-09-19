import express from "express";
import cors from "cors";
import 'dotenv/config'
import path from "node:path";
import { fileURLToPath } from "node:url";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import syncCatalog from "./services/catalogSync.js";
import userRouter from "./routes/userRout.js";
import productRouter from "./routes/productRout.js";
import orderRouter from "./routes/orderRoute.js";


// App config
const app = express();
const port = process.env.PORT || 4000;
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// Connect to databases
await connectDB();
const syncedProducts = await syncCatalog();
console.log(`Catalog synchronized: ${syncedProducts} products`);
connectCloudinary();

// Middleware
app.use(express.json());
app.use(cors()); // This enables CORS for all routes
app.use('/assets', express.static(path.join(projectRoot, "frontend", "src", "assets")));

// API endpoints
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/order', orderRouter);

app.get('/',(req,res)=>{
    res.send('Api Working')
})

app.listen(port,()=>console.log(`Server started on PORT: ${port}`));
