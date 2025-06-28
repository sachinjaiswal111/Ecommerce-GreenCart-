
import Product from "../models/Product.js";
import Order from "../models/Order.js"



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

// get orderByuser id : /api/v1/order/user

export const getUserOrders= async(req,res)=>{
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


// Get All Orders(for seller / admin) : /api/ order/seller

export const getAllOrders = async (req,res)=>{
    try{
       
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