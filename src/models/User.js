import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, default: "" },
    deliveryAddress: { type: String, default: "" },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }]
});

export default mongoose.models.User || mongoose.model("User", userSchema);