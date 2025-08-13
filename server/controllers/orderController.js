
import Product from "../models/Product.js";
import Order from "../models/Order.js"
import Razorpay from 'razorpay'
import crypto from 'crypto';



export const placeOrderOnline = async(req,res) =>{
    try {
        const {userId,items,address}=req.body;
        if(!address|| items.length==0){
            return res.json({
                success:false,
                message:"Invalid data"
            })
        }
        let price = await items.reduce(async(acc,item)=>{
            const product = await Product.findById(item.product)
            return (await acc)+product.offerPrice*item.quantity;

        }, 0)
        

        //add tax chanrge(2%)
        
        price+=Math.floor(price*0.02)
         
        
         const razorpay = new Razorpay({
         key_id: process.env.RAZORPAY_KEY_ID,
         key_secret: process.env.RAZORPAY_SECRET_KEY,
      });

            const options = {
                    amount:price*100,
                    currency:"INR",
                    receipt : "qwsaq1",
            }
            const order = await razorpay.orders.create(options);

            if (!order) {
               return res.status(500).send("server error");
            }

            
       
        return res.json({
            success:true,
            message:"Order placed successfully",
            order
        })

        
    } catch (error) {
        console.log('error from here')
        console.log(error)
        res.json({
            success:false,
            message:error.message
        })
        
    }

}
export const validate = async(req,res)=>{
    try {
        const {userId,items,address,price,razorpay_order_id, razorpay_payment_id, razorpay_signature }=req.body;
        if(!address|| items.length==0){
            return res.status(400).json({
                success:false,
                message:"Invalid data"
            })
        }
       
        

        //add tax chanrge(2%)
          const sha = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET_KEY);
  //order_id + "|" + razorpay_payment_id
       sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
        const digest = sha.digest("hex");
        // console.log(digest);
        // console.log(razorpay_signature);
  if (digest !== razorpay_signature) {
    return res.status(400).json({ success:false,message: "Transaction is not legit!" });
  }

        
          const createdOrder= await Order.create({
            userId,
            items,
            price,
            address,
            paymentType:"Online",
            isPaid:true

        })
   
        return res.status(200).json({
      success: true,
      message: "Order placed successfully"
    });
    } catch (error) {
        console.log(error)
        res.json({
            success:false,
            message:error.message
        })
        
    }
}
//place order COD:/api/order/cod



 export const placeOrderCOD = async(req,res)=>{
    try {
        const {userId,items,address}=req.body;
        if(!address|| items.length==0){
            return res.json({
                success:false,
                message:"Invalid data"
            })
        }
        let price = await items.reduce(async(acc,item)=>{
            const product = await Product.findById(item.product)
            return (await acc)+product.offerPrice*item.quantity;

        }, 0)
        

        //add tax chanrge(2%)

        price+=Math.floor(price*0.02)
        await Order.create({
            userId,
            items,
            price,
            address,
            paymentType:"COD"

        })
       
        return res.json({
            success:true,
            message:"Order placed successfully"
        })
    } catch (error) {
        console.log(error.message)
        res.json({
            success:false,
            message:error.message
        })
        
    }

}
//place order online:/api/order/online


// get orderByuser id : /api/v1/order/user

export const getUserOrders= async(req,res)=>{
    try{
        
        const orders = await Order.find({
            
            $or:[{paymentType:"COD"},{isPaid:true}]
        }).populate("items.product address").sort({createdAt:-1})

        res.json({
            success:true,
            orders
        })
    }catch(error){
        res.json({
            success:false,
            message:error.message
        })
    }
}


// Get All Orders(for seller / admin) : /api/ order/seller

export const getAllOrders = async (req,res)=>{
    try{
       const {userId}= req.body;
        const orders = await Order.find({
            userId,
            $or:[{paymentType:"COD"},{isPaid:true}]
        }).populate("items.product address").sort({createdAt:-1})
        res.json({
            success:true,
            orders
        })
    }catch(error){
        res.json({
            success:false,
            message:error.message
        })
    }

}