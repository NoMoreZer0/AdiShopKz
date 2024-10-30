import User from "@/models/User";
import { getSessionUserId } from "@/lib/session";
import { logUserAction } from "@/lib/historyService";

export async function POST(request, { params }) {
    const userId = await getSessionUserId();
    const { productId } = await params;
    if (!userId) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
    try {
        const user = await User.findById(userId);
        if (!user) {
            return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
        }
        if (!user.favorites.includes(productId)) {
            user.favorites.push(productId);
            await user.save();
            await logUserAction({ userId, productId, actionType: "like" })
        } else {
            user.favorites = user.favorites.filter(fav => fav.toString() !== productId);
            await user.save();
        }
        return new Response(JSON.stringify({ success: true, favorites: user.favorites }), { status: 200 });
    } catch (error) {
        console.error("Failed to update favorites:", error);
        return new Response(JSON.stringify({ error: "Failed to update favorites" }), { status: 500 });
    }
}