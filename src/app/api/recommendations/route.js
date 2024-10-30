import { getRecommendationsForUser } from "@/lib/collaborativeFiltering";
import { getSessionUserId } from "@/lib/session";
import Product from "@/models/Product";

export async function GET(request) {
    const userId = await getSessionUserId();
    if (!userId) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
    try {
        let recommendations = await getRecommendationsForUser(userId);
        recommendations = recommendations.filter(rec => rec.score > 0)
        const recommendedProducts = await Product.find({
            _id: { $in: recommendations.map((rec) => rec.product) },
        });
        console.log(recommendedProducts);
        return new Response(JSON.stringify(recommendedProducts), { status: 200 });
    } catch (error) {
        console.error("Error generating recommendations:", error);
        return new Response(JSON.stringify({ error: "Failed to generate recommendations" }), { status: 500 });
    }
}
