import Cart from "@/models/Cart";
import Order from "@/models/Order";
import { getSessionUserId } from "@/lib/session";
import { logUserAction } from "@/lib/historyService";

export async function POST(request) {
    const userId = await getSessionUserId(request);
    if (!userId) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
    try {
        const cart = await Cart.findOne({ userId }).populate("products.productId");
        if (!cart || cart.products.length === 0) {
            return new Response(JSON.stringify({ error: "Cart is empty" }), { status: 400 });
        }
        const totalAmount = cart.products.reduce(
            (total, item) => total + item.productId.price * item.quantity,
            0
        );
        const order = new Order({
            userId,
            products: cart.products,
            totalAmount,
        });
        for (const item of cart.products) {
            await logUserAction({
                userId,
                productId: item.productId._id,
                actionType: "purchase",
            })
        }
        await order.save();
        await Cart.deleteOne({ userId });
        return new Response(JSON.stringify(order), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Failed to create order" }), { status: 500 });
    }
}
