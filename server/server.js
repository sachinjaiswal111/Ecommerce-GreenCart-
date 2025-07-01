import cookieParser from 'cookie-parser';
import express from 'express'
import cors from 'cors'
import connectDb from './config/db.js';
import  dotenv from 'dotenv';
import { userRouter } from './routes/user.routes.js';
import sellerRouter from './routes/seller.route.js';
import connectCloudinary from './config/clounary.js';
import productRouter from './routes/product.route.js';
import cartRouter from './routes/cart.route.js';
import addressRouter from './routes/address.route.js';
import orderRouter from './routes/order.route.js';
dotenv.config();

const app=express();
const port = process.env.port||4000;

await connectDb()
await connectCloudinary()



const allowedOrigins=["https://ecommerce-green-cart-soo1.vercel.app"]

// Middleware configration



app.use(express.json());
app.use(cookieParser());
app.use(cors({origin:allowedOrigins,credentials:true}));

app.get('/',(req,res)=>{
    res.send("Api is working")
})

app.use('/api/v1/user',userRouter)
app.use('/api/v1/seller',sellerRouter)
app.use('/api/v1/product',productRouter)
app.use('/api/v1/cart',cartRouter)
app.use('/api/v1/address',addressRouter)
app.use('/api/v1/order',orderRouter)

app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`)
})

