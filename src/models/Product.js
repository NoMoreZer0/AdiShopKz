import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    images: [
        {
            type: String,
            required: true,
        },
    ],
    viewCount: {
        type: Number,
        default: 0,
    }
});

productSchema.index({ name: "text", description: "text" });

export default mongoose.models.Product || mongoose.model("Product", productSchema);
