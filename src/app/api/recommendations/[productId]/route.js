import { generateRecommendations } from '@/lib/recommendationService';
import Product from '@/models/Product';

export async function GET(request, { params }) {
    const { productId } = await params;

    try {
        const recommendations = await generateRecommendations(productId);

        const recommendedProducts = await Product.find({
            _id: { $in: recommendations.map((rec) => rec.id) },
        });

        return new Response(JSON.stringify(recommendedProducts), { status: 200 });
    } catch (error) {
        console.error("Error generating recommendations:", error);
        return new Response(JSON.stringify({ error: "Failed to generate recommendations" }), { status: 500 });
    }
}
