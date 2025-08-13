import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../Context/appContext';
import { assets, dummyAddress, dummyOrders } from '../../assets/assets';
import toast from 'react-hot-toast';

function Order() {
    const{currency }=useAppContext()
    const[orders,setOrders]=useState([]);
    const {axios}=useAppContext()
    const fetchOrder = async () => {
   try {
      const { data } = await axios.get('/api/v1/order/seller', { withCredentials: true });
      console.log(data);
      if (data.success) {
         setOrders(data.orders);
         toast.success(data.message);
      } else {
         toast.error(data.message);
      }
   } catch (e) {
      toast.error(e.message);
   }
}
    useEffect(()=>{
        fetchOrder()
    },[])
  return (
        <div className='no-scrollbar flex-1 h-[95vh] overflow-y-scroll'>
            <div className="md:p-10 p-4 space-y-4">
            <h2 className="text-lg font-medium">Orders List</h2>
            {orders.map((order, index) => (
                <div key={index} className="flex flex-col md:items-center md:flex-col-reverse gap-5 justify-between p-5 max-w-4xl rounded  md:items-center gap-5 p-5 max-w-4xl rounded-md border border-gray-300">
                    <div className="flex gap-5 max-w-80">
                        <img className="w-12 h-12 object-cover " src={assets.box_icon} alt="boxIcon" />
                        <>
                            {order.items.map((item, index) => (
                                <div key={index} className="flex flex-col ">
                                    <p className="font-medium">
                                        {item.product.name} <span className='text-primary '>x {item.quantity}</span>
                                    </p>
                                </div>
                            ))}
                        </>
                    </div>

                    <div className="text-sm md:text-base text-black/60">
                        <p className='text-black/80'>{dummyAddress.address.firstName} {dummyAddress.address.lastName}</p>

                        <p>{dummyAddress.address.street}, {dummyAddress.address.city}</p><p> {dummyAddress.address.state},{dummyAddress.address.zipcode}, {dummyAddress.address.country}</p>
                        <p></p>
                        <p>{dummyAddress.address.state}</p>
                    </div>

                    <p className="font-medium text-large my-auto ">{currency}{order.amount}</p>

                    <div className="flex flex-col text-sm md:text-base text-black/60">
                        <p>Method: {order.paymentType}</p>
                        <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                        <p>Payment: {order.isPaid ? "Paid" : "Pending"}</p>
                    </div>
                </div>
            ))}
        </div>
        </div>
    );
}

export default Order
