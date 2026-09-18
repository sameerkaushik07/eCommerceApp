
import React from 'react'
import {Routes, Route} from 'react-router-dom'
import Home from './pages/home';
import About from './pages/About';
import Cart from './pages/Cart';
import Contact from './pages/contact';
import Login from './pages/Login';
import Orders from './pages/Orders';
import PlaceOrder from './pages/PlaceOrder';
import Product from './pages/product';
import Collection from './pages/Collection';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SearchBar from './components/SearchBar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return(
    <div className='mx-4 sm:mx-20'>
      <ToastContainer />
      <Navbar />
      <SearchBar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/login' element={<Login />} />
        <Route path='/orders' element={<Orders />} />
        <Route path='/placeorder' element={<PlaceOrder />} />
        <Route path='/product/:productId' element={<Product />} />
        <Route path='/collection' element={<Collection />} />
      </Routes>
      <Footer />
    </div>
  )
}
export default App;