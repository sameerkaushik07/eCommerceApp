import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
export const ShopContext = createContext();
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ShopContextProvider = (props)=>{

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
    const currency = '$';
    const delivery_fee = 10;
    const[search,setSearch]=useState('');
    const[showSearch,setShowSearch]=useState(false);
    const[cartItems,setCartItem]=useState({})
    const[products,setProducts]=useState([])
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/product/list`);
                if (!response.data.success) {
                    throw new Error(response.data.message || 'Unable to load products');
                }
                setProducts(response.data.products);
            } catch (error) {
                toast.error(error.message || 'Unable to load products');
            }
        };

        fetchProducts();
    }, [backendUrl]);




    const addToCart = async (itemId,size) => {

        if (!size){
            toast.error('Please select a size');
            return;
        }

        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            } else {
                cartData[itemId][size] = 1;
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;

        }
        setCartItem(cartData);

    }

    const getCartCount = () => {
        let totalCount = 0;
        for(const items in cartItems){
            for(const item in cartItems[items]){
                if (cartItems[items][item]>0) {
                totalCount += cartItems[items][item];
                }
            }

        }
        return totalCount;
    

    }

    const updateQuantity = async (itemId,size,quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId][size] = quantity;
        setCartItem(cartData);
    }

    const getCartAmount = () =>{
        let totalAmount = 0;
        for(const items in cartItems){
            let itemInfo = products.find((product)=>product._id === items);
            if (!itemInfo) continue;
            for(const item in cartItems[items]){
                if (cartItems[items][item]>0){
                    totalAmount += itemInfo.price * cartItems[items][item];
                }
            }
        }
        return totalAmount;
    }

    const value = {
        products,
        currency,
        delivery_fee,
        search,
        setSearch,
        showSearch,
        setShowSearch,
        addToCart,
        cartItems,
        getCartCount,
        updateQuantity,
        getCartAmount,
        navigate
    }
    return(
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}
export default ShopContextProvider;
