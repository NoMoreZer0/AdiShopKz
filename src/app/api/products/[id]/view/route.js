import Product from "@/models/Product";
import { getSessionUserId } from "@/lib/session";
import { logUserAction } from "@/lib/historyService"

export async function POST(request, { params }) {
    const { id } = await params;
    try {
        const product = await Product.findByIdAndUpdate(
            id,
            { $inc: { viewCount: 1 } },
            { new: true } 
        );
        if (!product) {
            return new Response(JSON.stringify({ error: "Product not found" }), { status: 404 });
        }
        const userId = await getSessionUserId();
        if (userId !== null) {
            await logUserAction({ userId, productId: id, actionType: "view" });
        }
        return new Response(JSON.stringify({ viewCount: product.viewCount }), { status: 200 });
    } catch (error) {
        console.error("Failed to update view count:", error);
        return new Response(JSON.stringify({ error: "Failed to update view count" }), { status: 500 });
    }
}
