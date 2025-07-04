import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../Context/appContext'
import { Form, isRouteErrorResponse } from 'react-router-dom'
import toast from 'react-hot-toast'


function SellerLogin() {
    const {isSeller,setIsSeller,navigate,axios}=useAppContext()
    const [email, setEmail] =useState("")
    const[password,setPassword]=useState("")
    useEffect(()=>{
        if(isSeller){
            navigate("/seller")
        }

    },[isSeller])
    const onSubmitHandler=async(e)=>{
        try{
          e.preventDefault();
          const {data}= await axios.post('/api/v1/seller/login',{email,password},{withCredentials: true});
          if(data.success){
            setIsSeller(true);
            navigate('/seller')
          }else{
            toast.error(data.message)
          }

        }catch(e){
          toast.error(e.message)
        }
    }
  return !isSeller&&(
   <form onSubmit={onSubmitHandler} className="min-h-screen flex items-center justify-center text-sm text-gray-600">
  <div className="flex flex-col gap-5 items-start p-8 py-12 min-w-80 sm:min-w-88 rounded-lg shadow-xl border border-gray-200">
    <p className="text-2xl font-medium m-auto">
      <span className="text-primary">Seller</span> Login
    </p>

    <div className="w-full">
      <label className="block mb-1">Email</label>
      <input
         onChange={(e)=>setEmail(e.target.value)}
         value={email}
        type="email"
        placeholder="Enter your email"
        className="border border-gray-200 rounded w-full p-2 outline-primary mb-4"
        required
      />

      <label className="block mb-1">Password</label>
      <input
      onChange={(e)=>setPassword(e.target.value)} value={password}
        type="password"
        placeholder="Enter your password"
        className="border border-gray-200 rounded w-full p-2 outline-primary"
        required
      />
    </div>

    <button className="bg-primary text-white w-full py-2 rounded cursor-pointer">
      Login
    </button>
  </div>
</form>

  )
}

export default SellerLogin
