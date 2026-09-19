import mongoose from "mongoose";

const deletedProductSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    deletedAt: {
        type: Date,
        default: Date.now
    }
});

const deletedProductModel = mongoose.models.deletedProduct
    || mongoose.model("deletedProduct", deletedProductSchema);

export default deletedProductModel;
