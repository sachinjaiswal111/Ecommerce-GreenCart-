import { json } from "express"
import {v2 as cloudinary} from 'cloudinary'
import Product from "../models/Product.js";



//Add product: /api/v1/product/add
export const addProduct= async(req,res)=>{
    try{
        let productData= JSON.parse(req.body.productData);
        const images= req.files
        
       

        let imagesUrl = await Promise.all(
            images.map(async(item)=>{
                let result = await cloudinary.uploader.upload(item.path,{resource_type:'image'});
                
                return result.secure_url
            })
        )
       
        await Product.create({...productData,image:imagesUrl})
        
        return res.json({
            success:true,
            message:'Product Added'
        })

    }catch(e){
        console.log(e.message)
        
        return res.json({
           success:false,
        message:e.message
        })
        
    }


}

//Get product :/api/v1/product/list
export const productlist= async(req,res)=>{

    try{
        const products = await Product.find({})
        res.json({
            success:true,
            products
        })

    }catch(e){
        console.log(e.message)
        res.json({
            success:true,
            message:e.message
        })

    }

}
// get singledprodct: /api/v1/product/id
export const productId= async(req,res)=>{
    try{
        const {id}= req.body
        const product= await Product.findById(id)
         res.json({
            success:true,
            product
        })

    }catch(e){
        console.log(e.message)
        res.json({
            success:true,
            message:e.message
        })

    }

}
// chagne product in stock: /api/v1/product/id
export const changeStock = async(req,res)=>{
    try{
        const {id,inStock} = req.body
        await productId.findByIdAndUpdate(id,(inStock))
        res.json({success:false,message:"Stock Updated"})
    }catch(e){
        console.log(e.message)
        res.json({
            success:true,
            message:e.message
        })
    }
}