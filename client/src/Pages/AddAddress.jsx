import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { useAppContext } from '../Context/appContext'
import toast from 'react-hot-toast'

const InputFiled = (({
    type, placeholder, name, handleChange, address
}) => (
    <input type={type}
        placeholder={placeholder}
        name={name}
        onChange={handleChange}
        value={address[name]}
        required
        className='w-full px-2 py-2.5 border-2 border-gray-300 rounded outline-none text-gray-500 focus:border-primary transition' />
))

function AddAddress() {
    const [address, setAddress] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        phone: ''

    })
    const { axios, user, navigate } = useAppContext()
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        setAddress((prevAddress) => ({
            ...prevAddress,
            [name]: value
        }))
    }
    const onsubmitHandler = async (e) => {
        e.preventDefault()
        try {
            
            const { data } = await axios.post('/api/v1/address/add', { address });
            
            if (data.success) {
                toast.success(data.message)
                navigate('/cart')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    useEffect(() => {
        if (!user) {
            navigate('/cart')
        }
    }, [user])
    return (
        <div className='mt-16 pb-16'>
            < p className='text-2xl md:text-3xl text-gray-500'>Add Shipping <span className='font-semibold text-primary'>Address</span></p>

            <div className='flex flex-col-reverse md:flex-row justify-between mt-10'>
                <div className='flex-1 max-w-md'>

                    <form action="" onSubmit={onsubmitHandler} className='space-y-3 mt-6 text-sm'>
                        <div className='grid grid-cols-2 gap-4'>
                            <InputFiled handleChange={handleChange}
                                address={address} name='firstName' type='text' placeholder='First Name' />

                            <InputFiled handleChange={handleChange}
                                address={address} name='lastName' type='text' placeholder='Last Name' />
                        </div>
                        <InputFiled handleChange={handleChange} address={address} name='email' type="email" placeholder="Email address" />

                        <InputFiled handleChange={handleChange} address={address} name="street" type='text' placeholder='street' />
                        <div className='grid grid-cols-2 gap-4'>
                            <InputFiled handleChange={handleChange} address={address} name='city' type='text' placeholder='City' />
                            <InputFiled handleChange={handleChange} address={address} name='state' type='text' placeholder='State' />

                        </div>
                        <div className='grid grid-cols-2 gap-4'>
                            <InputFiled handleChange={handleChange} address={address} name='zipcode' type='number' placeholder='Zip code' />
                            <InputFiled handleChange={handleChange} address={address} name='country' type='text' placeholder='Country' />

                        </div>
                        <InputFiled handleChange={handleChange} address={address} name='phone' type="text" placeholder="phone" />
                        <button className='w-full mt-6 bg-primary text-white py-3 hover:bg-primary-dull transition cursor-pointer uppercase'>
                            Save address
                        </button>

                    </form>
                </div>



                <img src={assets.add_address_iamge} alt="addAdress" className='md:mr-16
                  mb-16 md:mt-0'/>



            </div>


        </div>
    )
}

export default AddAddress
