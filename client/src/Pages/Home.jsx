import React from 'react'
import MainBanner from '../Components/MainBanner'
import Categories from '../Components/Categories'
import BeastSeller from '../Components/BeastSeller'
import BottomBanner from '../Components/BottomBanner'
import NewsLetter from '../Components/NewsLetter'
import Footer from '../Components/Footer'

function Home() {
  return (
    <div className='mt-10'>
      <MainBanner/>
      <Categories/>
      <BeastSeller/>
      <BottomBanner/>
      <NewsLetter/>
      
    </div>
  )
}

export default Home
