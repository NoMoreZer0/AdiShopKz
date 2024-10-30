import Cart from "@/models/Cart";
import { getSessionUserId } from "@/lib/session";

export async function GET(request) {
    const userId = await getSessionUserId();
    if (!userId) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
    try {
        const cart = await Cart.findOne({ userId }).populate("products.productId");
        return new Response(JSON.stringify(cart), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Failed to retrieve cart" }), { status: 500 });
    }
}
