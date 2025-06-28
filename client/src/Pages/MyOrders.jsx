import React, { useEffect, useState } from 'react'
import { useAppContext } from '../Context/appContext'
import { dummyAddress, dummyOrders } from '../assets/assets'
import toast from 'react-hot-toast'

function MyOrders() {
    const [myOrders, setMyOrders]= useState([])
    const { currency,axios  } = useAppContext()
    const fetchMyorder = async () => {
        try{
            const {data}= await axios.get('/api/v1/order/user')
            if(data.success){
                setMyOrders(data.orders)
            }else{
                toast.error(data.message)
            }

        }catch(e){
            toast.error(e.message)
        }
    }
    useEffect(() => {
        fetchMyorder()
    }, [])
    return (
        <div className='mt-16 pb-16'>
            <div className='flex flex-col items-end w-max mb-8 pe'>
                <p className='text-2xl font-medium uppercase '>My orders</p>
                <div className='w-16 h-0.5 bg-primary rounded-full'></div>
              </div>
            {
                myOrders.map((order, index) => (
                    <div
                        key={index}
                        className="border border-gray-300 rounded-lg mb-10 p-4 py-5 max-w-xl w-full"
                    >
                        <p className="flex justify-between md:items-center text-gray-400 md:font-medium max-md:flex-col gap-10">
                            <span>OrderId: {order._id}</span>
                            <span>Payment: {order.paymentType}</span>
                            <span>Total Amount: {currency} {order.amount}</span>
                        </p>

                        {order.items.map((item, itemIndex) => (
                            <div
                                key={itemIndex}
                                className={`relative bg-white text-gray-500/70 flex flex-col md:flex-row md:items-center justify-between py-5 gap-5 ${
  order.items.length !== itemIndex + 1 ? "border-b border-gray-300" : ""
}`}

                            >
                                <div className="flex items-center">
                                    <div className="bg-primary/10 p-4 rounded-lg">
                                        <img src={item.product.image[0]} alt="" className="w-16 h-16 object-cover" />
                                    </div>
                                    <div className="ml-4">
                                        <h2 className="text-xl font-medium text-gray-800">{item.product.name}</h2>
                                        <p>Category: {item.product.category}</p>
                                    </div>
                                </div>

                                <div className="flex flex-col justify-center md:ml-8 mb-4 mb:mb-0">
                                    <p>Quantity: {item.quantity || "1"}</p>
                                    <p>Status: {order.status}</p>
                                    <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                                    <p className="font-medium text-gray-700">Amount: {currency} {item.product.offerPrice * item.quantity}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ))

            }
        </div>
    )
}

export default MyOrders
