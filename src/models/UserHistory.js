import mongoose from "mongoose";

const userHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    actionType: {
        type: String,
        enum: ["view", "like", "purchase"],
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.UserHistory || mongoose.model("UserHistory", userHistorySchema);
