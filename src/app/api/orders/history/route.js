import { getSessionUserId } from "@/lib/session";
import Order from "@/models/Order";
import connectToDatabase from "@/lib/mongodb";

export async function GET(request) {
    await connectToDatabase();
    const userId = await getSessionUserId();
    if (!userId) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
    try {
        const orders = await Order.find({ userId }).populate("products.productId").sort({ createdAt: -1 });
        return new Response(JSON.stringify(orders), { status: 200 });
    } catch (error) {
        console.error("Error fetching user orders:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch purchase history" }), { status: 500 });
    }
}