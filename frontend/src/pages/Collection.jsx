
import React, { useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { useContext } from "react";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

const Collection = ()=>{

    const {products,search,showSearch}=useContext(ShopContext);
    const[showFilter,setShowFilter]=useState(false);
    const[filteredProducts,setFilteredProducts]=useState([]);
    const[Category,setCategory]=useState([]);
    const[SubCategory,setSubCategory]=useState([]);
    const[sortType,setSortType]=useState('relevant');

    const toggleCategory=(e)=>{
        if(Category.includes(e.target.value)){
            setCategory(prev=> prev.filter(item => item !== e.target.value))
        }else{
            setCategory(prev=> [...prev,e.target.value])
        }
    }
    const toggleSubCategory=(e)=>{
        if(SubCategory.includes(e.target.value)){
            setSubCategory(prev=> prev.filter(item => item !== e.target.value))
        }else{
            setSubCategory(prev=> [...prev,e.target.value])
        }
    }

    const applyFilter = () => {
        let productsCopy = products.slice();
        if(showSearch && search){
            productsCopy = productsCopy.filter(product => product.name.toLowerCase().includes(search.toLowerCase()));
        }
        if (Category.length > 0) {
            productsCopy = productsCopy.filter(product => Category.includes(product.category));
        }
        if (SubCategory.length > 0) {
            productsCopy = productsCopy.filter(product => SubCategory.includes(product.subCategory));
        }
        setFilteredProducts(productsCopy);
    }

    const sortProduct = ()=>{
        let fpCopy = filteredProducts.slice();

        switch(sortType){
            case 'low-high':
             setFilteredProducts(fpCopy.sort((a,b)=> a.price - b.price))   ;
                break;
            case 'high-low':
                setFilteredProducts(fpCopy.sort((a,b)=> b.price - a.price));
                break;
            default:
                break;
        }
        
    }

    

   

    useEffect(()=>{
        applyFilter();
    },[Category,SubCategory,search,showSearch])

    useEffect(()=>{
        sortProduct();
    },[sortType])
   

    return(
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">

            {/* Filter Options */}

            <div className="min-w-60 ">
                <p onClick={()=>setShowFilter(!showFilter)} className="my-2 text-xl flex items-center cursor-pointer gap-2">FILTERS
                    <img src={assets.dropdown_icon} className={`${showFilter ? 'rotate-90' : ''} sm:hidden h-3`} alt="" />
                </p>
                {/* Category Filter */}

                <div className={`border border-gray-300 pl-5 py-3 mt-6  ${showFilter ? '' : 'hidden'} sm:block` }>
                    <p className="mb-3 text-sm font-medium">CATEGORIES</p>
                    <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
                        <p className="flex gap-2">
                            <input type="checkbox" className="w-3" value={'Men'} onChange={toggleCategory} />Men
                        </p>
                        <p className="flex gap-2">
                            <input type="checkbox" className="w-3" value={'Women'} onChange={toggleCategory} />Women
                        </p>
                        <p className="flex gap-2">
                            <input type="checkbox" className="w-3" value={'Kids'} onChange={toggleCategory} />Kids
                        </p>

                    </div>
                </div>

            
            {/* SubCategory filter */}

            <div className="min-w-60">
               

                <div className={`border border-gray-300 pl-5 my-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
                    <p className="mb-3 text-sm font-medium">TYPE</p>
                    <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
                        <p className="flex gap-2">
                            <input type="checkbox" className="w-3" value={'Topwear'} onChange={toggleSubCategory} />Topwear
                        </p>
                        <p className="flex gap-2">
                            <input type="checkbox" className="w-3" value={'Bottomwear'} onChange={toggleSubCategory} />Bottomwear
                        </p>
                        <p className="flex gap-2">
                            <input type="checkbox" className="w-3" value={'Winterwear'} onChange={toggleSubCategory} />Winterwear
                        </p>

                    </div>
                </div>

            </div>
            </div>
            {/* Right Side */}

            <div className="flex-1">

                <div className="flex justify-between text-base sm:text-2xl mb-4">
                    <Title text1={'ALL'} text2={'COLLECTIONS'} />
                    {/* Product Short */}
                    <select onChange={(e)=>setSortType(e.target.value)} className="border-2 border-gray-300 text-sm px-2">
                        <option value="relevant">Sort by: Relevant</option>
                        <option value="low-high">Sort by: Low to High</option>
                        <option value="high-low">Sort by: High to Low</option>
                    </select>

                </div>
                {/* Map products */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-y-6 gap-4 h-screen overflow-y-auto">
                  {
                    filteredProducts.map((product,index)=>(
                        <ProductItem key={index} id={product._id} name={product.name} price={product.price} image={product.image}/>
                    ))
                  }

                </div>

            </div>
        
         </div>
    )
}

export default Collection;