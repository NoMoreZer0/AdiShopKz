import UserHistory from "@/models/UserHistory";
import { getSessionUserId } from "@/lib/session";

export async function POST(request) {
    const { productId, actionType } = await request.json();
    const userId = await getSessionUserId();
    if (!userId) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
    if (!["view", "like", "purchase"].includes(actionType)) {
        return new Response(JSON.stringify({ error: "Invalid action type" }), { status: 400 });
    }
    try {
        const historyEntry = new UserHistory({
            userId,
            productId,
            actionType,
        });
        await historyEntry.save();
        return new Response(JSON.stringify({ success: true }), { status: 201 });
    } catch (error) {
        console.error("Failed to log user action:", error);
        return new Response(JSON.stringify({ error: "Failed to log user action" }), { status: 500 });
    }
}
