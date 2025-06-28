import express from 'express'
import { upload } from '../config/multer.js';
import authSeller from '../middlewares/authSeller.js';
import { addProduct, changeStock, productId, productlist } from '../controllers/productController.js';

const productRouter= express.Router();

productRouter.post('/add', upload.array(['images']), authSeller, addProduct);
productRouter.get('/list',productlist)
productRouter.get('/list',productId)
productRouter.post('/stock',authSeller,changeStock)

export default productRouter