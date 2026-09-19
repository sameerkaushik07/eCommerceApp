import React from "react";
import{assets} from '../assets/assets'
import { Link,NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';



const Navbar = ()=>{
    const[visible,setVisible]=useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(Boolean(localStorage.getItem('token')));
    const {setShowSearch,getCartCount}=useContext(ShopContext);
    useEffect(() => {
        const updateAuth = () => setIsAuthenticated(Boolean(localStorage.getItem('token')));
        window.addEventListener('auth-change', updateAuth);
        return () => window.removeEventListener('auth-change', updateAuth);
    }, []);
    const logout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        window.dispatchEvent(new Event('auth-change'));
    };
    return(
        <div className="flex items-center justify-between py-5  font-medium">
           <Link to='/'> <img src={assets.logo} className="w-36" alt="Logo" /></Link>
            <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
                <NavLink to='/' className='flex flex-col items-center gap-1' >
                    <p>Home</p>
                    <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden"/>
                 </NavLink>

                  <NavLink to='/collection' className='flex flex-col items-center gap-1' >
                    <p>Collection</p>
                    <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden"/>
                 </NavLink>

                  <NavLink to='/about' className='flex flex-col items-center gap-1' >
                    <p>About</p>
                    <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden"/>
                 </NavLink>

                  <NavLink to='/contact' className='flex flex-col items-center gap-1' >
                    <p>Contact</p>
                    <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden"/>
                 </NavLink>

                  <a href={import.meta.env.VITE_ADMIN_URL || 'http://localhost:5174'} className='flex flex-col items-center gap-1' >
                    <p>Admin</p>
                    <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden"/>
                 </a>

            </ul>
            <div className="flex item-center gap-6">
                <img onClick={()=>setShowSearch(true)} src={assets.search_icon} className="w-5 cursor-pointer" alt="" />

                <div className="group relative">
                    <Link to={isAuthenticated ? '/orders' : '/login'}><img src={assets.profile_icon} className="w-5 cursor-pointer" alt="" /></Link>
                    <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
                        <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
                            {isAuthenticated ? <>
                                <Link to='/orders' className="cursor-pointer hover:text-black">My Orders</Link>
                                <button onClick={logout} className="text-left cursor-pointer hover:text-black">Logout</button>
                            </> : <Link to='/login' className="cursor-pointer hover:text-black">Login</Link>}
                        </div>
                    </div>
                </div>

                <Link to='/cart' className="relative">
                    <img src={assets.cart_icon} className="w-5 cursor-pointer" alt="" />
                    <p className="absolute rounded-full bg-black text-white bottom-10px -right-2 w-4 text-center leading-5">{getCartCount()}</p>
                </Link>
                <img onClick={()=>setVisible(true)} src={assets.menu_icon} className="w-5 cursor-pointor sm:hidden" alt="" />
            </div>

            {/* menu items mobile screen */}
            <div className={`absolute top-0 right-0 bottom-0 overflow-hidden py-5 bg-white transition-all ${visible?'w-full':'w-0'}`}>
                <div className="flex flex-col text-gray-600">
                    <div onClick={()=>setVisible(false)} className="flex items-center gap-4 p3 mb-8 ms-5">
                        <img src={assets.dropdown_icon} className="h-4 rotate-180" alt="" />
                        <p>Back</p>

                    </div>
                    <NavLink to='/' onClick={()=>setVisible(false)} className='py-2 pl-6 border'>Home</NavLink>
                    <NavLink to='/collection' onClick={()=>setVisible(false)} className='py-2 pl-6 border'>Collection</NavLink>
                    <NavLink to='/about' onClick={()=>setVisible(false)} className='py-2 pl-6 border'>About</NavLink>
                    <NavLink to='/contact' onClick={()=>setVisible(false)} className='py-2 pl-6 border'>Contact</NavLink>
                    <a href={import.meta.env.VITE_ADMIN_URL || 'http://localhost:5174'} onClick={()=>setVisible(false)} className='py-2 pl-6 border'>Admin</a>

                </div>
            </div>
        </div>
    )
}

export default Navbar