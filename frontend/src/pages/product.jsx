import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { useState } from "react";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";

const Product = ()=>{
    const {productId} = useParams();
    const {products,currency,addToCart} = useContext(ShopContext);
    const[productData,setProductData]=useState(false);
    const[imgClick,setImgClick]=useState(0);
    const[size,setSize]=useState()

    const fetchProductData = ()=>{
        const product = products.find(item => item._id === productId);
        if(product){
            setProductData(product);
        }
        
       
    };
    useEffect(()=>{
        fetchProductData();
    },[productId,products])

    return productData ? (
        <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
           {/* product data */}
            <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
                {/* images */}
                <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
                    {/* {console.log(productData.image)} */}
                    <div className="flex sm:flex-col overflow-x-auto sm overflow-y-scroll justify-between sm:justify-normal sm:w-[18.17%] w-full ">
                        {(productData.image).map((imag,index)=>(
                            <img onClick={(e)=>(setImgClick(index))} key={index} src={imag} className="w-[24%] sm:w-full sm:mb-3 shrink-0 cursor-pointer" alt="" />
                        ))
                        }

                    </div>
                    <div className="w-full sm:w-80%">
                        <img src={productData.image[imgClick]} className="w-full h-auto"alt="" />

                    </div>
                </div>
                {/* product details */}

                <div className="flex-1">
                    <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
                    <div className="flex items-center gap-1 mt-2">
                        <img src={assets.star_icon} alt="" className="w-3 " />
                        <img src={assets.star_icon} alt="" className="w-3" />
                        <img src={assets.star_icon} alt="" className="w-3" />
                        <img src={assets.star_icon} alt="" className="w-3" />
                        <img src={assets.star_dull_icon} alt="" className="w-3" />
                        <p className="pl-2">(122)</p>
                    </div>
                    <p className="mt-5 text-3xl font-medium">{currency}{productData.price}</p>
                    <p className="mt-5 text-gray-500 md:w-4/5">{productData.description}</p>
                    <div className="flex flex-col gap-4 my-8">
                        <p>Select Size</p>
                        <div className="flex gap-2">
                            {
                                
                                (productData.sizes).map((sizes,index)=>(
                                    <button onClick={()=>(setSize(sizes))} className={`border py-2 px-4 bg-gray-100 cursor-pointer ${sizes===size ? 'border-orange-500' : ''}`} key={index}>{sizes}</button>
                                ))
                                
                            }
                            {/* {console.log(size)} */}

                        </div>

                    </div>
                    <button onClick={()=>addToCart(productData._id,size)} className="bg-black text-white px-8 py-3 text-sm active:bg-green-700">ADD TO CART</button>
                    <hr className="mt-8 sm:w-4/5" />
                    <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
                        <p>100% Origional Product</p>
                        <p>Cash on delivery is available on this product.</p>
                        <p>Easy return and exchange policy within 7 days</p>
                    </div>

                </div>

            </div>
            {/* Description and reviews section */}
            <div className="mt-20">
                <div className="flex">
                    <b className="border px-5 py-3 text-sm">Description</b>
                    <p className="border px-5 py-3 text-sm">Reviews (122)</p>
                </div>
                <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
                    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Minima corrupti libero laudantium exercitationem dolorum rem, cumque at dignissimos provident dolores enim eligendi voluptatibus odio labore consequuntur error blanditiis? Ullam, omnis!</p>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis deserunt sit culpa provident corrupti laudantium perspiciatis recusandae iste accusamus aperiam expedita accusantium ratione ducimus aspernatur vitae, amet asperiores dolorum? Similique?</p>

                </div>

            </div>
            {/* Display related products */}
            <RelatedProducts category={productData.category} subCategory={productData.subCategory} />

        </div>
    ) : <div>Loading...</div>
    
}
export default Product