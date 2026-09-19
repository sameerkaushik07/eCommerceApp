import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => new mongoose.Types.ObjectId().toString()
    },
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    image:{
        type:[String],
        required:true
    },
    category:{
        type:String,
        required:true
    },
    subCategory:{
        type:String,
        required:true
    },
    sizes:{
        type:Array,
        required:true
    },
    bestseller:{
        type:Boolean,
        required:true
    },
    date:{
        type:Number,
        required:true
    
    }


})

const productModal = mongoose.models.product || mongoose.model('product',productSchema)

export default productModal