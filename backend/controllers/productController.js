import {v2 as cloudinary} from 'cloudinary'
import productModal from '../models/productModel.js';


//function for add product
const addProduct = async (req,res) =>{
     try {
        
        const {name,description,price,category,subCategory,sizes,bestSeller, bestseller} = req.body;
        
        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]

        const images = [image1,image2,image3,image4].filter((item)=>item !== undefined)

        let imagesUrl = await Promise.all(
            images.map(async (item)=>{
                const result = await cloudinary.uploader.upload(item.path,{resource_type:'image'})
                return result.secure_url
            })
        )



        const productData = {
            name,
            description,
            price:Number(price),
            image:imagesUrl,
            category,
            subCategory,
            sizes:JSON.parse(sizes),
            bestseller:bestSeller === true || bestSeller === "true" || bestseller === true || bestseller === "true",
            date:Date.now()


        }
        console.log(productData);

        const product = new productModal(productData)
        await product.save()



        res.json({success:true,message:'product added successfully'})


    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

//function for list product
const listProduct = async (req,res) =>{
   

    try {

        const products = await productModal.find({})
        res.json({success:true,products})
        
    } catch (error) {
         console.log(error);
        res.json({success:false,message:error.message})
    
    }

}

//function for remove product
const removeProduct = async (req,res) =>{
    
    try {
         const {productId} = req.body;
        await productModal.findByIdAndDelete(productId)
        res.json({success:true,message:'product removed successfully'})


    } catch (error) {
          console.log(error);
        res.json({success:false,message:error.message})
    
    }

}

//function for single product
const singleProduct = async (req,res) =>{

    try {
        
        const {productId} = req.body;
        const product = await productModal.findById(productId)
        if(!product){
            return res.json({success:false,message:'product not found'})
        }
        res.json({success:true,product})
        

    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    
    }
    
}

export {addProduct,listProduct,removeProduct,singleProduct}