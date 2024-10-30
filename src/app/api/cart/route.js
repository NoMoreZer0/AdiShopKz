import Cart from "@/models/Cart";
import { getSessionUserId } from "@/lib/session";

export async function POST(request) {
    const { productId, quantity } = await request.json();
    const userId = await getSessionUserId();
    if (!userId) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
    try {
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, products: [] });
        }
        const existingProductIndex = cart.products.findIndex(
            (item) => item.productId.toString() === productId
        );
        if (existingProductIndex >= 0) {
            cart.products[existingProductIndex].quantity += quantity;
        } else {
            cart.products.push({ productId, quantity });
        }
        await cart.save();
        return new Response(JSON.stringify(cart), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Failed to add to cart" }), { status: 500 });
    }
}
