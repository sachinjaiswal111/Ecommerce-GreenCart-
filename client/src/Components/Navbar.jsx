import React, { useEffect, useState } from 'react'
import { NavLink, useSearchParams } from 'react-router-dom'
import { assets } from '../assets/assets'
import { useAppContext } from '../Context/appContext'
import toast from 'react-hot-toast'

function Navbar() {
    const [open, setOpen] = React.useState(false)
    const { user, setUser, setShowUserLogin, navigate,setSearchQuery,searchQuery,getCartCount,axios } = useAppContext();
    const logout = async () => {
       try{
        const {data}= await axios.get('/api/v1/user/logout')
        if(data.success){
            toast.success(data.message)
            setUser(null);
            navigate('/')
        }else{
            toast.error(data.message)
        }
       }catch(error){
        toast.error(error.message);

       }
    }
    useEffect(()=>{
        if(searchQuery.length>0){
            navigate("/products")
        }
    },[searchQuery])


    return (
        <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">

            <NavLink to='/' onClick={()=>setOpen(false)}>
                <img className="h-9" src={assets.logo} alt="logo" />
            </NavLink>

            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center gap-8">
                <NavLink to='/'>Home</NavLink>
                <NavLink to='/products'>All products</NavLink>
                <NavLink to='/'>Contact</NavLink>
                <NavLink to='/seller' className=' bg-gray-100 border-1 border-gray-400 rounded-full p-1 px-2
                '>seller-Login</NavLink>
                <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
                    <input className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500" type="text" placeholder="Search products"
                    onChange={(e)=>setSearchQuery(e.target.value)} />
                    <img src={assets.search_icon} alt="search" className='w-4 h-4' />
                </div>

                <div onClick={()=>navigate("/cart")} className="relative cursor-pointer">
                    <img src={assets.nav_cart_icon} alt="cart" className='w-6 opacity-80' />
                    <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">{getCartCount()}</button>
                </div>

               {!user ?( <button className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full"
                onClick={()=>setShowUserLogin(true)}>
                    Login
                </button>):
                 (
                    <div className='relative group'>
                        <img src= {assets.profile_icon} alt="" className='w-10' />
                        <ul className='hidden group-hover:block absolute top-10 right-0 bg-white shadow border border-gray-200 py-2.5 w-30
                         rounded-md text-sm z-40'>
                            <li className='p-1.5 pl-3 hover:bg-primary/10 cursor-pointer' onClick={()=>navigate("my-orders")}>My Orders</li>
                            <li className='p-1.5 pl-3 hover:bg-primary/10 cursor-pointer' onClick={logout}>Logout</li>
                        </ul>
                    </div>
                 )
                }
            </div>

            <button onClick={() => open ? setOpen(false) : setOpen(true)} aria-label="Menu" className="sm:hidden">
                {/* Menu Icon SVG */}
                <img src={assets.menu_icon} alt="menu" className='' />
            </button>

            {open && (<div className={`${open ? 'flex' : 'hidden'} absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden z-50`}>
                <NavLink to='/' onClick={() => { setOpen(false) }}>Home</NavLink>
                <NavLink to='/products' onClick={() => { setOpen(false) }}>All Prouducts</NavLink>
                {user &&
                    
                        <NavLink to='/products' onClick={() => { setOpen(false) }}>My Orders</NavLink>
                }
                {user && 
                 <NavLink to='/cart' onClick={() => { setOpen(false) }}>My Cart</NavLink>
                }
                <NavLink to='/' onClick={() => { setOpen(false) }}>Contact</NavLink>

                {!user ? (<button className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-indigo-600 transition text-white rounded-full text-sm"
                    onClick={() => {
                        setOpen(false);
                        setShowUserLogin(true);
                    }}>
                    Login
                </button>) : (<button className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-indigo-600 transition text-white rounded-full text-sm"
                    onClick={logout}>
                    Logout
                </button>)}



            </div>)}


        </nav>
    )
}

export default Navbar
