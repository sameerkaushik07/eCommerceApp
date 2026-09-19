import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = ()=>{

    const[currentState,setCurrentState]=useState('Sign Up')
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

    const OnSubmitHandler = async(event)=>{
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const isLogin = currentState === 'Login';
        try {
            const response = await axios.post(`${backendUrl}/api/user/${isLogin ? 'login' : 'register'}`, {
                ...(isLogin ? {} : { name: formData.get('name') }),
                email: formData.get('email'),
                password: formData.get('password'),
            });
            if (!response.data.success) throw new Error(response.data.message);
            localStorage.setItem('token', response.data.token);
            window.dispatchEvent(new Event('auth-change'));
            toast.success(isLogin ? 'Logged in successfully' : 'Account created successfully');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Unable to authenticate');
        }
    }
    return(
       <form onSubmit={OnSubmitHandler} className="flex flex-col items-center w-[95%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800">
            <div className="inline-flex items-center gap-2 mb-2 mt-10">
                <p className="prata-regular text-3xl">{currentState}</p>
                <hr className="border-none h-[1.5px] w-8 bg-gray-800" />

            </div>
            {(currentState==='Login') ? "" :<input name="name" required type="text" className="w-full px-3 py-2 border border-gray-800 " placeholder="Name" />}
            <input name="email" required type="email" className="w-full px-3 py-2 border border-gray-800 " placeholder="Email" />
            <input name="password" required type="password" className="w-full px-3 py-2 border border-gray-800 " placeholder="Password" />
            <div className="w-full flex justify-between text-sm -mt-2">
                <p className="cursor-pointer">Forgot your password</p>
                {
                    (currentState==='Login') ? 
                    <p onClick={()=>setCurrentState('Sign Up')} className="cursor-pointer">Create Account</p> :
                    <p onClick={()=>setCurrentState('Login')} className="cursor-pointer">Login Here</p>

                }
            </div>
            <button className="bg-black text-white font-light px-8 py-2 mt-4">{currentState === 'Login' ? 'Sign In' : 'Sign Up'}</button>
       </form>
    )
}
export default Login;