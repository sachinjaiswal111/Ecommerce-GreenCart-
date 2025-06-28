import React from 'react'
import Navbar from './Components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './Pages/Home'
import { Toaster } from 'react-hot-toast';
import Footer from './Components/Footer';
import { useAppContext } from './Context/appContext';
import Login from './Components/Login';
import AllProducts from './Pages/AllProducts';
import ProductsCategory from './Pages/ProductsCategory';
import ProductDetails from './Pages/ProductDetails';
import Cart from './Pages/Cart';
import AddAddress from './Pages/AddAddress';
import MyOrders from './Pages/MyOrders';
import SellerLogin from './Components/seller/SellerLogin';
import SellerLayout from './Pages/SellerLayout';
import AddProduct from './Pages/AddProduct';
import ProductList from './Pages/Seller/ProductList';
import Order from './Pages/Seller/Order';
function App() {

  const isSellerPath = useLocation().pathname.includes("seller");
  const { showUserLogin, isSeller } = useAppContext()
  return (
    <div className='text-default min-h-screen text-gray-700 bg-white'>
      {isSellerPath ? null : <Navbar />}
      {showUserLogin ? <Login /> : null}
      <Toaster />
      <div className={`${isSellerPath ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"}`}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/products' element={<AllProducts />} />
          <Route path='/products/:category' element={<ProductsCategory />} />
          <Route path='/products/:category/:id' element={<ProductDetails />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/add-address' element={<AddAddress />} />
          <Route path='/my-orders' element={<MyOrders />} />

          {/* Seller routes with conditional rendering */}
          <Route
            path='/seller'
            element={isSeller ? <SellerLayout /> : <SellerLogin />}
          >
            {isSeller && (
              <>
                <Route index element={<AddProduct />} />
                <Route path='product-list' element={<ProductList />} />
                <Route path='orders' element={<Order />} />
              </>
            )}
          </Route>
        </Routes>

      </div>
      {!isSellerPath && <Footer />}
    </div>
  )
}

export default App
