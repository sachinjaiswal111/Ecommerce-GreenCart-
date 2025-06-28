import { Children, createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from "axios"
export const AppContext= createContext();

axios.defaults.withCredentials=true;
axios.defaults.baseURL= import.meta.env.VITE_BACKEND_URL

export const AppContextProvider = ({children})=>{


    const currency = import.meta.env.VITE_CURRENCY;
    const navigate= useNavigate();
    const [user,setUser] = useState(null);
    const[isSeller,setIsSeller] = useState(false);
    const[cartItems, setcartItems]=useState({})
    const[searchQuery, setSearchQuery]=useState({})
    
    const [showUserLogin, setShowUserLogin]= useState(false)
    const[products,setProducts]=useState([])

    //fetch usser Status , user and cartItems
    const fetchUser = async()=>{
        try {
            const {data}= await axios.get('/api/v1/user/is-auth');
            if(data.success){
                setUser(data.user)
                setcartItems(data.user.cartItems)
            }
        } catch (error) {
            setUser(null)
        }
    }


    // fetch seller Status
    const fetchSeller = async ()=>{
        try {
            const {data}= await axios.get('/api/v1/seller/is-auth')
            if(data.success){
                setIsSeller(true)
            }else{
                setIsSeller(false)
            }
        } catch (error) {
            
            setIsSeller(false)
        }
    }
    const fetchProducts= async ()=>{
        try {
            const {data} = await axios.get('/api/v1/product/list');
            if(data.success){
                setProducts(data.products)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
             toast.error(error.message)
        }
    }
   
    //add product to cart
    const addToCart=async(itemId)=>{
        let cartData=structuredClone(cartItems)
       if(cartData[itemId]){
        cartData[itemId]+=1;
       }else{
        cartData[itemId]=1;
       }
       setcartItems(cartData);
       toast.success("Added to Cart")
    }
    const updateCartItem=(itemId,quantity)=>{
        let cartData=structuredClone(cartItems)
        cartData[itemId]=quantity;
        setcartItems(cartData)
        toast.success("Cart Updated")

    }
    const removeFromCart=(itemId)=>{
        let cartData=structuredClone(cartItems)
        if(cartData[itemId]){
            cartData[itemId]-=1;
            if(cartData[itemId]===0){
                delete cartData[itemId];
            }
        }
        toast.success("Removed from Cart")
        setcartItems(cartData)
    }
    // get cart item count
    const getCartCount = ()=>{
        let toatalCount= 0;
        for(const item in cartItems){
            toatalCount+=cartItems[item];
        }
        return toatalCount;
    }
    const getCartAmount = ()=>{
        let totalAmount =0;
        for(const items in cartItems){
            console.log(items)
            let itemInfo = products.find((product)=>product._id===items);
            if(cartItems[items]>0){
                totalAmount+=itemInfo.offerPrice*cartItems[items]
            }
        }
        return Math.floor(totalAmount*100)/100;
    }
     useEffect(()=>{
        fetchSeller()
        fetchProducts()
        fetchUser()
    },[])
    // update database Cart Items

    useEffect(()=>{
        const updateCart = async ()=>{
            try{
            const{data} = await axios.post('/api/v1/cart/update',{cartItems})
            if(!data.success){
                toast.error(data.message)
            }
        }catch(error){
            toast.error(error.message)
        }
        }

        if(user){
            updateCart()
        }
    },[cartItems])
    
    const value={navigate,isSeller, user, setIsSeller,setUser,currency,
        showUserLogin,setShowUserLogin,products,addToCart,updateCartItem,removeFromCart,cartItems,searchQuery,setSearchQuery,getCartAmount,getCartCount,axios,fetchProducts,setcartItems,axios
    }
    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
}

export const useAppContext= ()=>{
    return useContext(AppContext)
}