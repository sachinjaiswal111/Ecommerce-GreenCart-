

import express from 'express'
import authUser from '../middlewares/user.js'
import { getAllOrders, getUserOrders, placeOrderCOD ,placeOrderOnline, validate} from '../controllers/orderController.js'
import authSeller from '../middlewares/authSeller.js'

const orderRouter = express.Router()

orderRouter.post('/cod',authUser,placeOrderCOD)
orderRouter.post('/online',authUser,placeOrderOnline)
orderRouter.post('/validate',authUser,validate)


orderRouter.get('/user',authUser,getUserOrders)
orderRouter.get('/seller',authSeller,getAllOrders)

export default orderRouter
