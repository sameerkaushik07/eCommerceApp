import React, { useContext, useState } from "react";
import axios from "axios";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";


const PlaceOrder = ()=>{
    const[method,setMethod]=useState('cod');
    const[formData,setFormData]=useState({});
    const[loading,setLoading]=useState(false);
    const {navigate, products, cartItems} = useContext(ShopContext);
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

    const updateField = (event) => {
        setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
    };

    const submitOrder = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Please log in before placing an order');
            return;
        }

        const items = Object.entries(cartItems).flatMap(([productId, sizes]) => {
            const product = products.find((item) => item._id === productId);
            if (!product) return [];
            return Object.entries(sizes)
                .filter(([, quantity]) => quantity > 0)
                .map(([size, quantity]) => ({ productId: product._id, size, quantity }));
        });

        if (items.length === 0) {
            toast.error(products.length === 0 ? 'Products are still loading. Please try again.' : 'Your cart is empty');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${backendUrl}/api/order/place`, {
                items,
                address: formData,
                paymentMethod: method,
            }, { headers: { token } });

            if (!response.data.success) throw new Error(response.data.message);
            toast.success('Payment approved and order placed');
            navigate('/orders');
        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                window.dispatchEvent(new Event('auth-change'));
                toast.error('Your session expired. Please log in again');
                navigate('/login');
                return;
            }
            toast.error(error.response?.data?.message || error.message || 'Unable to place order');
        } finally {
            setLoading(false);
        }
    };

    return(
        <form onSubmit={submitOrder} className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t">
            {/* --------Left Side-------- */}
            <div className="flex flex-col gap-4 w-full sm:max-w-120">
                <div className="text-xl my-3">
                    <Title text1={'DELIVERY'} text2={'INFORMATION'} />
                </div>
                <div className="flex gap-3">
                    <input name="firstName" onChange={updateField} required className="border border-gray-30 rounded py-1.5 px-3.5 w-full" type="text" placeholder="First Name" />
                    <input name="lastName" onChange={updateField} required className="border border-gray-30 rounded py-1.5 px-3.5 w-full" type="text" placeholder="Last Name" />
                </div> 
                    <input name="email" onChange={updateField} required className="border border-gray-30 rounded py-1.5 px-3.5 w-full" type="email" placeholder="Email Address" />
                    <input name="street" onChange={updateField} required className="border border-gray-30 rounded py-1.5 px-3.5 w-full" type="text" placeholder="Street" />
                
                 <div className="flex gap-3">
                    <input name="city" onChange={updateField} required className="border border-gray-30 rounded py-1.5 px-3.5 w-full" type="text" placeholder="City" />
                    <input name="state" onChange={updateField} required className="border border-gray-30 rounded py-1.5 px-3.5 w-full" type="text" placeholder="State" />
                </div> 

                 <div className="flex gap-3">
                    <input name="zipcode" onChange={updateField} required className="border border-gray-30 rounded py-1.5 px-3.5 w-full" type="number" placeholder="Zipcode" />
                    <input name="country" onChange={updateField} required className="border border-gray-30 rounded py-1.5 px-3.5 w-full" type="text" placeholder="Country" />
                </div> 
                <input name="phone" onChange={updateField} required className="border border-gray-30 rounded py-1.5 px-3.5 w-full" type="tel" placeholder="Phone" />
            </div>
            {/* ----------------Right side----------------- */}

            <div className="mt-8">
                <div className="mt-8 min-w-80">
                    <CartTotal />

                </div>
                <div className="mt-12">
                    <Title text1={'PAYMENT'} text2={'METHOD'} />

                    {/* payment method selection */}
                    <div className="flex gap-3 flex-col lg:flex-row">

                        <div onClick={()=>setMethod('stripe')} className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${(method==='stripe') ? 'bg-green-700' : ''}`}></p>
                            <img className="h-5 mx-4" src={assets.stripe_logo} alt="" />
                        </div>
                         <div onClick={()=>setMethod('razorpay')} className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${(method==='razorpay') ? 'bg-green-700' : ''}`}></p>
                            <img className="h-5 mx-4" src={assets.razorpay_logo} alt="" />
                        </div>
                         <div onClick={()=>setMethod('cod')} className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${(method==='cod') ? 'bg-green-700' : ''}`}></p>
                            <p className="text-gray-500 text-sm font-medium mx-4">CASH ON DELIVERY</p>
                            
                        </div>
                    </div>
                    <div className="w-full text-end mt-8">
                        <button disabled={loading} type="submit" className="bg-black text-white text-sm my-8 px-16 py-3 disabled:opacity-50" >
                            {loading ? 'PROCESSING...' : 'PLACE ORDER'}
                        </button>
                        

                    </div>
                </div>
            </div>
        </form>
    )
}
export default PlaceOrder;