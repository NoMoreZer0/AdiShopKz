import User from "@/models/User";
import { getSessionUserId } from "@/lib/session";

export async function GET() {
    const userId = await getSessionUserId();
    if (!userId) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
    try {
        const user = await User.findById(userId).populate("favorites");
        return new Response(JSON.stringify(user.favorites), { status: 200 });
    } catch (error) {
        console.error("Failed to retrieve favorites:", error);
        return new Response(JSON.stringify({ error: "Failed to retrieve favorites" }), { status: 500 });
    }
}
